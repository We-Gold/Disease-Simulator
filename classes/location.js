function Location(id, spreadRateBias, position, graphic, type, disease, params) {
  this.id = id
  this.spreadRateBias = spreadRateBias
  this.disease = disease
  // person.id : obj
  this.population = new Map() // Contains all healthy and infected
  this.infected = new Map() // Contains only infected
  this.position = position // PVector
  this.graphic = graphic // SVG or Image
  this.type = type // Contains the type of location
  this.params = params

  this.addPerson = (person) => {
    this.population.set(person.id, person)
    if(person.isInfected()) {
      this.infected.set(person.id, person)
    }
  }

  this.removePerson = (person) => {
    // Might be useful to use some kind of data structure to make this more efficient
    this.population.delete(person.id)
    if(person.isInfected()) {
      this.infected.delete(person.id)
    }
  }

  this.show = () => {
    
  }

  this.step = () => {
    const infectionRate = this.disease.infectionRate / this.mean(this.disease.symptomTime) 

    const chanceOfBeingInfected = Math.ceil(this.infected.size * infectionRate * this.getMaskFactor()) / 100

    // Infect those who have been exposed (random)
    this.population.forEach((person) => {
      if(Math.random() <= chanceOfBeingInfected) person.beginInfection()
    })
  }

  this.mean = (list) => list.reduce((count, current) => count + current, 0)/list.length

  this.getMaskFactor = () => {
    if(this.params["masks"]) return 1 - (this.getMaskPercent() * this.getMaskEffectiveness())

    return 1
  }

  this.getMaskPercent = () => this.params["maskPercent"] * 0.01

  this.getMaskEffectiveness = () => this.params["maskEffectiveness"] * 0.01

  this.shuffle = (array) => {
    let i = array.length, j = 0, temp;

    while (i--) {
      // Select a random index in the array.
      j = Math.floor(Math.random() * (i+1))
      // Swap the random element with the current one.
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }
}