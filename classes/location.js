function Location(id, spreadRateBias, position, graphic, type, disease) {
  this.id = id
  this.spreadRateBias = spreadRateBias
  this.disease = disease
  // person.id : obj
  this.population = new Map() // Contains all healthy and infected
  this.infected = new Map() // Contains only infected
  this.position = position // PVector
  this.graphic = graphic // SVG or Image
  this.type = type // Contains the type of location

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
    // Need to figure if the objects are being changed or not (reference or value)
    let popKeys = this.shuffle([...this.population.keys()])
    let newInfectedCount = Math.ceil(this.infected.size * this.disease.infectionRate)
    for(let i = 0; i < newInfectedCount && popKeys.length >= newInfectedCount; i++) {
      this.population.get(popKeys[i]).beginInfection()
    }
  }

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