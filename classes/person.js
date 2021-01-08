function Person(id, params) {
  this.id = id
  this._params = params

  this.generatePerson = () => {
    // Generate age from normal distribution
    this.age = this.randn_bm(5, 85, 1)
    // Decide if they are infected to begin (small percentage of people) and set their state
    this.infected = Math.random() <= (0.01 * this._params.initialInfectedPercent)
    // If they are infected generate the timeframe for their infection

    // Set their current location
      // Assign a specific home in the simulation
    // Based on age generate a daily and weekend schedule
    if(this.age <= 18) {
      // TODO tweak these with random changes to third locations and different entertainment places (or is randomly selected by different class)
      this.weeklySchedule = Schedule("home", "school", "home")
      this.weekendSchedule = Schedule("home", "entertainment", "home")
    } else if(this.age <= 60) {
      // TODO tweak these with random changes to third locations and different entertainment places
      this.weeklySchedule = Schedule("home", "job", "home") // 3rd maybe swapped with entertainment some days
      this.weekendSchedule = Schedule("home", "entertainment", "entertainment")
    } else if(this.age <= 85) {
      // TODO tweak these with random changes to third locations and different entertainment places
      this.weeklySchedule = Schedule("home", "entertainment", "home") // 3rd maybe swapped with a different home (family) some days
      this.weekendSchedule = Schedule("home", "entertainment", "home")
    }
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
}