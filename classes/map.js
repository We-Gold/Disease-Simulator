function DiseaseMap(name, locations, people, background, p5sketch) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  // Uninfected, Infected, Removed (dead or recovered)
  this.chartData = {
    data: [[], [], []], // Stateful
    colors: ["#27A8F1", "#F03A5F", "#000"],
    lineLabels: ["Uninfected", "Infected", "Removed"],
    w: 200,
    h: 200,
    x: 20,
    y: 20,
    xRange: [0, 10], // Stateful
    yRange: [0, maps[this.name]["initialPopulation"]],
    p5sketch: this.p
  }

  this.chart = new LineChart(this.chartData)

  this.show = () => {
    // Show background (img or color)
    this.p.background(this.background)
    
    // Show all locations
    this.showAllLocations()

    // Show all people
    this.people.forEach(this.showPerson)

    this.chart.show()
  }

  this.showAllLocations = () => {
    locationTypes.forEach((type) => this.locations[type].forEach(this.showLocation))
  }

  this.showLocation = (location) => {
    location.show()
  } 

  this.showPerson = (person) => {
    person.show()
  }

  this.step = () => {
    // Update all people
    this.people.forEach(this.stepPerson)

    // Update all locations
    this.stepAllLocations()

    this.updateChartData()

    if(this.simulationIsComplete()) endSimButtonFunc()
  }

  this.stepPerson = (person) => person.step()

  this.stepAllLocations = () => {
    locationTypes.forEach((type) => this.locations[type].forEach(this.stepLocation))
  }

  this.stepLocation = (location) => location.step()

  this.simulationIsComplete = () => {
    // Track the number of active members of the population
    let activePeople = this.people.length

    this.people.filter((person) => person.isInactive()).forEach(() => {activePeople--})

    return activePeople == 0
  }

  this.updateChartData = () => {
    // Hard coding the data being displayed in the chart

    const uninfected = this.countUninfected(this.people)
    const infected = this.countInfected(this.people)
    const removed = this.countRemoved(this.people)

    this.chartData.data[0].push(this.p.createVector(currentStep - 1, uninfected))
    this.chartData.data[1].push(this.p.createVector(currentStep - 1, infected))
    this.chartData.data[2].push(this.p.createVector(currentStep - 1, removed))

    if(currentStep >= this.chartData.xRange[1]) this.chartData.xRange[1]++
  }

  this.countInfected = (people) => people.filter(this.isInfected).reduce((count) => count + 1, 0)

  this.isInfected = (person) => person.isInfected()

  this.countUninfected = (people) => people.filter(this.isUninfected).reduce((count) => count + 1, 0)

  this.isUninfected = (person) => person.isUninfected()

  this.countRemoved = (people) => people.filter(this.isRemoved).reduce((count) => count + 1, 0)

  this.isRemoved = (person) => (person.isDead() || person.isRecovered())
}