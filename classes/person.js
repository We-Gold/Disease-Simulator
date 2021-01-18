function Person(id, params, disease, map) {
  this.id = id

  // On each global step iterate the step of each person
  // If global vars work, may change this later.
  this.currentStep = 0

  this.iterStep = () => {this.currentStep++}

  // Assume that these are already populated:
  this._params = params
  this._disease = disease
  this._map = map

  this.generatePerson = () => {
    // Generate age from normal distribution
    this.age = this.randn_bm(5, 85, 1)
    // Decide if they are infected to begin (small percentage of people) and set their state
    this.infectionStage = (Math.random() <= (0.01 * this._params.initialInfectedPercent)) ? 1 : 0
    // Create a list to store the information about the timeframe of their infection.
    this.infectionTimeline = { // Times stored in timesteps
      "symptomTime": -1,
      "recoveryTime": -1, 
      "deathTime": -1,
      "isSevereCase": false
    }
    // If they are infected generate the timeframe for their infection
    if(this.isInfected()) {
      // this.timeToSymptoms = this.randn_bm(this._disease.symptomTime[0],this._disease.symptomTime[0], 1)
      this.beginInfection()
    }
    
    // Find a way to make families and make them have the same homes
    this.home = this.getRandomLocation("homes")

    // Based on age generate a daily and weekend schedule
    if(this.age <= 18) {
      // TODO tweak these with random changes to third locations and different entertainment places (or is randomly selected by different class)
      this.weeklySchedule = new Schedule(this.home, this.getRandomLocation("schools"), this.home)
      this.weekendSchedule = new Schedule(this.home, "entertainment", this.home)
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

  this.beginInfection = () => {
    this.infectionTimeline["symptomTime"] = this._disease.getRandomTime(this._disease.symptomTime)
    this.infectionTimeline["isSevereCase"] = Math.random() <= this._disease.hospitalizationRate
  }

  this.changeLocation = (nextLocation) => {
    this.location.removePerson(this)
    this.location = this.getNextLocation()
    this.location.addPerson(this)
  }

  this.getNextLocation = () => {
    // 1 week = 21 steps
    // Make more efficient by counting
    let step = (this.currentStep % 21)
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

  this.show = () => {

  }

  this.step = () => {
    
  }
}