function DiseaseMap(name, locations, people, background, p5sketch) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  this.show = () => {
    // Show background (img or color)
    this.p.background(this.background)
    
    // Show all locations
    for(let loc of this.locations) {
      loc.show()
    }

    // Show all people
    for(let person of this.people) {
      person.show()
    }
  }

  this.step = () => {
    
  }
}