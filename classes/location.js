function Location(spreadRateBias, position, graphic) {
  this.spreadRateBias = spreadRateBias
  // person.id : obj
  this.population = new Map() // Contains all healthy and infected
  this.infected = new Map() // Contains only infected
  this.position = position // PVector
  this.graphic = graphic // SVG or Image

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
    
  }
}