function DiseaseMap(name, locations, people, background, p5sketch) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  // Healthy, Infected, Removed (dead or recovered)
  this.chartData = {
    data: [[], [], []], // Stateful
    colors: ["#27A8F1", "#F03A5F", "#000"],
    lineLabels: ["Healthy", "Infected", "Removed"],
    w: 200,
    h: 200,
    x: 20,
    y: 20,
    xRange: [0, 10], // Stateful
    yRange: [0, 200],
  }


  this.chart = new LineChart(this.chartData.data, this.chartData.colors, this.chartData.lineLabels, this.chartData.w, this.chartData.h, this.chartData.x, this.chartData.y, this.chartData.xRange, this.chartData.yRange, this.p)

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

    this.chart.show()
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

    // this.outputInfo()

    this.updateChartData()

    if(this.simulationIsComplete()) endSimButtonFunc()
  }

  this.simulationIsComplete = () => {
    // Track the number of active members of the population
    let activePeople = this.people.length

    for(let person of this.people) {
      if(person.isDead() || person.isRecovered() || person.infectionStage == 0) {
        activePeople--
      }
    }

    return activePeople == 0
  }

  this.updateChartData = () => {
    // Hard coding the data being displayed in the chart

    let healthy = 0
    let infected = 0
    let removed = 0

    for(let person of this.people) {
      if(person.isInfected()) infected++
      else if(person.isHealthy()) healthy++
      else if(person.isDead() || person.isRecovered()) removed++
    }

    this.chartData.data[0].push(this.p.createVector(currentStep, healthy))
    this.chartData.data[1].push(this.p.createVector(currentStep, infected))
    this.chartData.data[2].push(this.p.createVector(currentStep, removed))

    if(currentStep >= this.chartData.xRange[1]) this.chartData.xRange[1]++
  }

  // this.outputInfo = () => {
  //   // Print the number of infected
  //   // TODO make this code a lot nicer.
  //   let infected = 0
  //   let hasSymptoms = 0
  //   let quarantined = 0
  //   let recovered = 0
  //   let dead = 0

  //   for(let person of this.people) {
  //     if(person.isRecovered()) recovered++
  //     else if(person.isDead()) dead++
  //     else if(person.isInfected() && person.infectionStage == 4) quarantined++
  //     else if(person.isInfected() && person.infectionStage == 2) hasSymptoms++
  //     else if(person.isInfected()) infected++
  //   }
  //   console.log(`Current step: ${currentStep}`)
  //   console.log(`Total: ${this.people.length} \nInfected: ${infected} \nSymptomatic: ${hasSymptoms} \nQuarantined: ${quarantined} \nRecovered: ${recovered} \nDead: ${dead}`)
  // }
}