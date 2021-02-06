function DiseaseMap(name, locations, people, background, p5sketch, graphMode="UIR") {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  this.graphMode = graphMode // UIR, HID

  this.lineLabels = {
    "SIR": ["Susceptible", "Infected", "Removed"],
    "HID": ["Healthy", "Infected", "Dead"]
  }

  // Healthy, Infected, Dead
  this.chartData = {
    data: [[], [], []], // Stateful
    colors: ["#27A8F1", "#F03A5F", "#000"],
    lineLabels: this.lineLabels[this.graphMode],
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

    let data = []

    if(this.graphMode == "SIR") data = this.getSIRData()
    else data = this.getHIDData()

    this.pushChartData(data)

    if(currentStep >= this.chartData.xRange[1]) this.chartData.xRange[1]++
  }

  this.pushChartData = (data) => {
    this.chartData.data[0].push(this.p.createVector(currentStep - 1, data[0]))
    this.chartData.data[1].push(this.p.createVector(currentStep - 1, data[1]))
    this.chartData.data[2].push(this.p.createVector(currentStep - 1, data[2]))
  }

  this.getHIDData = () => {
    return [
      this.countHealthy(this.people),
      this.countInfected(this.people),
      this.countDead(this.people)
    ]
  }

  this.getSIRData = () => {
    return [
      this.countSusceptible(this.people),
      this.countInfected(this.people),
      this.countRemoved(this.people)
    ]
  }

  this.countInfected = (people) => people.filter(this.isInfected).reduce((count) => count + 1, 0)

  this.isInfected = (person) => person.isInfected()

  this.countHealthy = (people) => people.filter(this.isHealthy).reduce((count) => count + 1, 0)

  this.isHealthy = (person) => (person.isUninfected() || person.isRecovered())

  this.countSusceptible = (people) => people.filter(this.isSusceptible).reduce((count) => count + 1, 0)

  this.isSusceptible = (person) => person.isSusceptible()

  this.countDead = (people) => people.filter(this.isDead).reduce((count) => count + 1, 0)

  this.isDead = (person) => person.isDead()

  this.countRemoved = (people) => people.filter(this.isRemoved).reduce((count) => count + 1, 0)

  this.isRemoved = (person) => (person.isDead() || person.isRecovered())
}