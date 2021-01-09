function Disease(infectionRate, deathRate, recoveryTime, deathTime, symptomTime, hospitalizationRate) {
  // Likelyhood of being infected:
  this.infectionRate = infectionRate
  // Likelyhood of dying from the disease (should have an increase if the case is severe):
  this.deathRate = deathRate
  this.recoveryTime = recoveryTime // [min, max]
  this.deathTime = deathTime // [min, max]
  this.symptomTime = symptomTime // [min, max]
  // Likelyhood of having a severe case: 
  this.hospitalizationRate = hospitalizationRate
}