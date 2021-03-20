function DiseaseMap(name, locations, people, background, p5sketch, graphMode="SIR", images) {
  this.name = name
  // Dictionary for storing locations associated by their type
  this.locations = locations
  // List of people
  this.people = people
  this.background = background

  this.p = p5sketch

  this.graphMode = graphMode // SIR, HID

  this.images = images

  this.lineLabels = {
    "SIR": ["Susceptible", "Infected", "Recovered", "Dead"],
    "HID": ["Healthy", "Infected", "Dead"]
  }

  // Healthy, Infected, Dead
  this.chartData = {
    data: [[], [], [], []], // Stateful
    colors: ["#27A8F1", "#F03A5F", "#22BB33", "#000"],
    lineLabels: this.lineLabels[this.graphMode],
    axisLabels: ["Weeks", "People"], // [x,y]
    chartWidth: this.p.width * (4/10), //200,
    w: this.p.width * (4.5/10), //225,
    h: this.p.width * (4.5/10),
    x: 20,
    y: this.p.height / 2 - (this.p.width * (4.5/10) / 2),
    xRange: [0, 5], // Weeks
    yRange: [0, maps[this.name]["initialPopulation"]],
    p5sketch: this.p
  }

  this.pieData = {
    data: [[], [], [], [], []],
    colors: ["#27A8F1", "#F03A5F", "#22BB33", "#000"]
  }

  this.chart = new LineChart(this.chartData)

  this.show = () => {
    this.p.textSize(this.p.constrain(this.p.width/500 * 12, 12, 20))

    // Show background (img or color)
    this.p.background(this.background)
    
    // Show all locations
    this.showAllLocations()

    // Show all people
    this.people.forEach(this.showPerson)

    this.p.stroke(0)
    this.chart.show()

    this.showImages()

    this.drawFinalNumbers()
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

  this.showImages = () => {
    const imageDistance = this.p.height / 6 // The distance between each image
    let i = 1
    
    const personCounts = this.getPersonCounts()

    this.p.imageMode(this.p.CORNER)

    for(const [type, image] of Object.entries(this.images)) {
      const newDims = {
        width: (imageDistance * (3/4)/image.height) * image.width,
        height: imageDistance * (3/4)
      }
      this.p.image(image, this.p.width * (6.5/10), imageDistance * i - (imageDistance / 2), newDims.width, newDims.height)

      if(!(personCounts[type][0] == 0 && personCounts[type][1] == 0)) {
        this.pieData.data[i - 1] = personCounts[type]
      }

      const totalPeople = this.pieData.data[i - 1].reduce((prev, curr) => prev + curr, 0)
      
      pieChart(
        this.p, 
        [this.p.width * (5.75/10), imageDistance * i], 
        50, 
        this.pieData.data[i - 1].map((count) => count / totalPeople * 360),
        this.pieData.colors
      )
      i++
    }
  }

  this.getPersonCounts = () => {
    // Susceptible, Infected, Recovered, Dead
    let counts = {
      homes: [0,0,0,0],
      hospitals: [0,0,0,0],
      entertainment: [0,0,0,0],
      jobs: [0,0,0,0],
      schools: [0,0,0,0]
    }

    this.people.forEach((person) => {
      if(this.isSusceptible(person)) {
        counts[person.location.type][0]++
      } else if(this.isInfected(person)) {
        counts[person.location.type][1]++
      } else if(this.isRecovered(person)) {
        counts[person.location.type][2]++
      } else if(this.isDead(person)) {
        counts[person.location.type][3]++
      }
    })

    return counts
  }

  this.step = () => {
    // Update all people
    this.people.forEach(this.stepPerson)

    // Update all locations
    this.stepAllLocations()

    this.updateChartData()

    if(this.simulationIsComplete()) {
      endSimButtonFunc()
    }
  }

  this.drawFinalNumbers = () => {
    const data = this.getSIRData()

    this.p.textAlign(this.p.LEFT, this.p.BOTTOM)

    let lastLine = this.chartData.y - this.p.textLeading()

    const gap = this.p.textSize() / 2

    for(let i = data.length - 1; i >= 0; i--) {
      this.p.fill(this.chartData.colors[i])
      this.p.noStroke()

      this.p.text(`${this.lineLabels["SIR"][i]}: ${data[i]}`, this.chartData.x, lastLine)

      lastLine -= this.p.textLeading() + gap
    }
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

    if(this.getWeeksFromSteps(currentStep) >= this.chartData.xRange[1]) this.chartData.xRange[1]++
  }

  this.pushChartData = (data) => {
    for(let i = 0; i < data.length; i++) {
      this.chartData.data[i].push(this.p.createVector(this.getWeeksFromSteps(currentStep - 1), data[i]))
    }
  }

  this.getWeeksFromSteps = (steps) => (steps * 3) / 7

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
      this.countRecovered(this.people),
      this.countDead(this.people)
    ]
  }

  this.isInfected = (person) => person.isInfected()
  this.isHealthy = (person) => (person.isSusceptible() || person.isRecovered())
  this.isSusceptible = (person) => person.isSusceptible()
  this.isDead = (person) => person.isDead()
  this.isRecovered = (person) => person.isRecovered()
  this.isRemoved = (person) => (person.isDead() || person.isRecovered())

  this.countInfected = (people) => people.filter(this.isInfected).reduce((count) => count + 1, 0)
  this.countHealthy = (people) => people.filter(this.isHealthy).reduce((count) => count + 1, 0)
  this.countSusceptible = (people) => people.filter(this.isSusceptible).reduce((count) => count + 1, 0)
  this.countDead = (people) => people.filter(this.isDead).reduce((count) => count + 1, 0)
  this.countRecovered = (people) => people.filter(this.isRecovered).reduce((count) => count + 1, 0)
  this.countRemoved = (people) => people.filter(this.isRemoved).reduce((count) => count + 1, 0)

}