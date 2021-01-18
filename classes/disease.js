function Disease(infectionRate, deathRate, recoveryTime, deathTime, symptomTime, hospitalizationRate) {
  // Likelyhood of being infected:
  this.infectionRate = infectionRate
  // Likelyhood of dying from the disease (should have an increase if the case is severe):
  this.deathRate = deathRate

  // TODO use function approximations rather than ranges to represent time frames.

  this.recoveryTime = recoveryTime // [min, max]
  this.deathTime = deathTime // [min, max]
  this.symptomTime = symptomTime // [min, max]
  // Likelyhood of having a severe case: 
  this.hospitalizationRate = hospitalizationRate

  this.getRandomTime = (timeframe) => {
    // Get a random number of days within the given range.
    let days = timeframe[0] + Math.floor(Math.random() * (timeframe[1] - timeframe[0] + 1))
    // Convert from days to steps.
    return days * 3
  }

  this.randn_bm = (min, max, skew) => { // Random distribution
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