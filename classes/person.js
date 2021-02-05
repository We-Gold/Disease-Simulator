function Person(id, params, disease, map) {
  this.id = id

  // Assume that these are already populated:
  this._params = params
  this._disease = disease
  this._map = map

  this.generatePerson = () => {
    // Generate age from normal distribution
    // this.age = this.randn_bm(5, 85, 1)
    // Generate age randomly
    this.age = this.getRandomIntInRange(5,85)
    // Decide if they are infected to begin (small percentage of people) and set their state
    this.infectionStage = (Math.random() <= (0.01 * this._params.initialInfectedPercent)) ? 1 : 0
    // Create a list to store the information about the timeframe of their infection.
    this.infectionTimeline = { // Times stored in timesteps
      "startStep": -1, // Current step at beginning of infection.
      "lastStep": -1,
      "symptomTime": -1,
      "recoveryTime": -1, 
      "deathTime": -1,
      "testTime": 3,
      "isSevereCase": false,
      "willDie": false
    }
    // If they are infected generate the timeframe for their infection
    if(this.isInfected()) {
      this.beginInfection()
    }
    
    // Find a way to make families and make them have the same homes
    this.home = this.getRandomLocation("homes")

    // Based on age generate a daily and weekend schedule
    if(this.age <= 18) {
      // TODO tweak these with random changes to third locations and different entertainment places (or is randomly selected by different class)
      this.weeklySchedule = new Schedule(this.home, this.getRandomLocation("schools"), this.home)
      this.weekendSchedule = new Schedule(this.home, this.getRandomLocation("entertainment"), this.home)
    } else if(this.age <= 60) {
      // TODO tweak these with random changes to third locations and different entertainment places
      this.weeklySchedule = new Schedule(this.home, this.getRandomLocation("jobs"), this.home) // 3rd maybe swapped with entertainment some days
      this.weekendSchedule = new Schedule(this.home, this.getRandomLocation("entertainment"), this.getRandomLocation("entertainment"))
    } else if(this.age <= 85) {
      // TODO tweak these with random changes to third locations and different entertainment places
      this.weeklySchedule = new Schedule(this.home, this.getRandomLocation("entertainment"), this.home) // 3rd maybe swapped with a different home (family) some days
      this.weekendSchedule = new Schedule(this.home, this.getRandomLocation("entertainment"), this.home)
    }
    // Set their current location
    this.location = this.home
    this.location.addPerson(this)
  }

  this.isInfected = () => {
    // Return whether or not the person is currently infected.
    return this.infectionStage < 6 && this.infectionStage > 0
  }

  this.isDead = () => {
    return this.infectionStage == 6
  }

  this.isRecovered = () => {
    return this.infectionStage == 7
  }

  this.isInactive = () => {
    return this.isDead() || this.isRecovered() || this.infectionStage == 0
  }
  
  this.isUninfected = () => {
    // Return whether or not this individual has ever been infected.
    return this.infectionStage == 0
  }

  this.beginInfection = () => {
    if(this.isUninfected()) {
      this.infectionStage = 1
      this.infectionTimeline["startStep"] = currentStep
      this.infectionTimeline["lastStep"] = currentStep
      this.infectionTimeline["symptomTime"] = this._disease.getRandomTime(this._disease.symptomTime)
      this.infectionTimeline["isSevereCase"] = Math.random() <= this._disease.hospitalizationRate
    }
  }

  this.changeLocation = () => {
    this.location.removePerson(this)
    this.location = this.getNextLocation()
    this.location.addPerson(this)
  }

  this.getNextLocation = () => {
    // 1 week = 21 steps
    // Make more efficient by counting
    let step = (currentStep % 21)
    let day = Math.ceil(step / 3)
    let dayStep = step - ((day-1) * 3)

    // Starts at step 1 day 1
    if(day <= 5) {
      return this.weeklySchedule.getLocationByNumber(dayStep)
    } else {
      return this.weekendSchedule.getLocationByNumber(dayStep)
    }
  }

  this.getRandomLocation = (type) => {
    return this._map.locations[type][Math.random() * this._map.locations[type].length>>0]
  }

  this.randn_bm = (min, max, skew) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
  }

  this.getRandomIntInRange = (min, max) => {
    return min + Math.floor(Math.random() * (max - min + 1))
  }

  this.updateInfectionState = () => {
    if(this.isInfected()) {
      // Begin having symptoms if enough time has passed.
      if(this.infectionStage == 1) {
        if(currentStep - this.infectionTimeline["startStep"] >= this.infectionTimeline["symptomTime"]) {
          this.infectionStage = 2
          this.infectionTimeline["lastStep"] = currentStep
        }
      }
      else if(this.infectionStage == 2) {
        // Progress the infection if enough time has passed for testing.
        if(currentStep - this.infectionTimeline["lastStep"] >= this.infectionTimeline["testTime"]) {
          if(this.infectionTimeline["isSevereCase"]) {
            this.infectionStage = 5
          } else {
            this.infectionStage = 4
          }
          this.infectionTimeline["lastStep"] = currentStep
          // Decide whether or not the individual will die. This is currently indepentent from if their case is severe enough for hospitalization, but this may change.
          this.infectionTimeline["willDie"] = Math.random() <= this._disease.deathRate

          if(this.infectionTimeline["willDie"]) {
            this.infectionTimeline["deathTime"] = this._disease.getRandomTime(this._disease.deathTime)
          } else {
            this.infectionTimeline["recoveryTime"] = this._disease.getRandomTime(this._disease.recoveryTime)
          }
        }
      }
      else if(this.infectionStage == 4 || this.infectionStage == 5) {
        if(this.infectionTimeline["willDie"] && currentStep - this.infectionTimeline["lastStep"] >= this.infectionTimeline["deathTime"]) {
          this.infectionStage = 6
        }
        else if(!this.infectionTimeline["willDie"] && currentStep - this.infectionTimeline["lastStep"] >= this.infectionTimeline["recoveryTime"]) {
          this.infectionStage = 7
        }
      }
    }
  }

  this.isHospitalized = () => this.infectionStage == 5

  this.isQuarantined = () => this.infectionStage == 4

  this.isMobile = () => {
    if(this._params["quarantine"] && this.isQuarantined()) return false

    return !this.isHospitalized() && !this.isDead()
  }

  this.show = () => {

  }

  this.step = () => {
    if(this.isMobile()) this.changeLocation()
    this.updateInfectionState()
  }
}