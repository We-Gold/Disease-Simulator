// replace each range with a method that provides a random number based on either randomness or a graph - function thingy

const diseases = {
  "COVID-19": new Disease(1.6, 0.017, [10, 20], [10,18], [3, 7], 0.01),
  // {
  //   "infectionRate": 1.5,
  //   "deathRate": 0.017,
  //   "recoveryTime": [10, 20],
  //   "deathTime": [10,18],
  //   "symptomTime": [3, 14],
  //   "hospitalizationRate": 0.01
  // },
  "Influenza": new Disease(1.25, 0.00961603347529, [5, 7], [5,9], [1, 4], 0.01382)
  // {
  //   "infectionRate": 1.5,
  //   "deathRate": 0.00961603347529,
  //   "recoveryTime": [5, 7],
  //   "deathTime": [5,9],
  //   "symptomTime": [1, 4],
  //   "hospitalizationRate": 0.01382
  // }
}