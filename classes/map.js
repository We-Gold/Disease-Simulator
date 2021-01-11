function Map(name, locations, people, background, p5sketch) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  this.show = () => {
    for(let loc in this.locations) {
      loc.show()
    }
    // Show background (img or color)
  }
}