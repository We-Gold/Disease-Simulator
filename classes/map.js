function DiseaseMap(name, locations, people, background, p5sketch) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  // this.chart = new LineChart()

  this.show = () => {
    // Show background (img or color)
    this.p.background(this.background)
    
    // Show all locations
    for(let locType of locationTypes) {
      for(let loc of this.locations[locType]) {
        loc.show()
      }
    }

    // Show all people
    for(let person of this.people) {
      person.show()
    }
  }

  this.step = () => {
    // Update all people
    // This order is important
    for(let person of this.people) {
      person.step()
    }

    // Update all locations
    for(let locType of locationTypes) {
      for(let loc of this.locations[locType]) {
        loc.step()
      }
    }

    this.outputInfo()
  }

  this.outputInfo = () => {
    // Print the number of infected
    // TODO make this code a lot nicer.
    let infected = 0
    let hasSymptoms = 0
    let quarantined = 0
    let recovered = 0
    let dead = 0

    for(let person of this.people) {
      if(person.isRecovered()) recovered++
      else if(person.isDead()) dead++
      else if(person.isInfected() && person.infectionStage == 4) quarantined++
      else if(person.isInfected() && person.infectionStage == 2) hasSymptoms++
      else if(person.isInfected()) infected++
    }
    console.log(`Current step: ${currentStep}`)
    console.log(`Total: ${this.people.length} \nInfected: ${infected} \nSymptomatic: ${hasSymptoms} \nQuarantined: ${quarantined} \nRecovered: ${recovered} \nDead: ${dead}`)
  }
}