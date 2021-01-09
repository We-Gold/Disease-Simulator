function Map(name, locations, background) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  this.background = background

  this.show = () => {
    for(let loc in this.locations) {
      loc.show()
    }
    // Show background (img or color)
  }
}