// Create a model for storing configuration data
let params = {
  "map": "Town",
  "disease": "COVID-19",
  "initialInfectedPercent": 5,
  "masks": false,
  // "maskDelay": 0,
  "maskPercent": 75, // Percentage of people that wear masks
  "maskEffectiveness": 90,
  "quarantine": false,
  // "quarDelay": 0,
  // "quarPercent": 95,
  // "vaccine": false,
  // "vaccDelay": 300,
  // "vaccPercent": 99,
  // "vaccEffectiveness": 85.63,
  // "medCareCapacity": 135,
  "graphMode": "SIR"
}

// States of infection:
// 0 - Not infected
// 1 - infected
// 2 - symptomatic
// 3 - testing (may not be used)
// 4 - quarantine
// 5 - hospitalized
// 6 - death
// 7 - recovered

// Units of time:
// Time is measured in timesteps
// 1 timestep = 8 hrs

// Location types:
// (quantity of each is determined by the map)

let isRunning = false

let show = (el) => {
  el.style.display = "block"
}

let hide = (el) => {
  el.style.display = "none"
}

let saveParams = () => {
  try {
    localStorage.setItem("parameters", JSON.stringify(params));
  } catch(err) {
    console.log(err);
  }
}

let getParams = () => {
  try {
    if(localStorage.getItem("parameters")) {
      params = JSON.parse(localStorage.getItem("parameters"))
    } 
  } catch(err) {
    console.log(err);
  }
}

function beginSimButtonFunc() {
  Object.keys(params).filter((key) => {
    return !["maskEffectiveness", "maskPercent", "graphMode"].includes(key)}).forEach((key) => {
      params[key] = ["masks", "quarantine"].includes(key) ? document.getElementById(key).checked : document.getElementById(key).value
  })

  saveParams()

  isRunning = true
  initializeSimulation(_p)
  hide(document.getElementById("beginSimButton"))
  show(document.querySelector(".btn-group"))
}

function toggleSimButtonFunc() {
  isRunning = !isRunning
  document.getElementById("toggleSimButton").innerText == "Resume" ? document.getElementById("toggleSimButton").innerText = "Pause" : document.getElementById("toggleSimButton").innerText = "Resume"
}

function endSimButtonFunc() {
  isRunning = false
  show(document.getElementById("beginSimButton"))
  hide(document.querySelector(".btn-group"))
}

document.getElementById("beginSimButton").addEventListener('click', beginSimButtonFunc)

document.getElementById("toggleSimButton").addEventListener('click', toggleSimButtonFunc)

document.getElementById("endSimButton").addEventListener('click', endSimButtonFunc)

document.getElementById("modalArea").addEventListener('click', () => {
  document.getElementById("modalArea").style.display = "none"
})

document.getElementById("infoLink").addEventListener('click', () => {
  document.getElementById("modalArea").style.display = "block"
})

// The location where the sketch will be created:
let simArea = document.getElementById('sim-area')

// Define sketch dimensions
const sk = {
  w: simArea.clientWidth,
  h: simArea.clientHeight
}

let map; // Store the main map class, which runs all operations
const fr = 30 // Define the frame rate
const secondsPerStep = 0.05 // (0.1) Set how often a disease step will occur
let frameCounter = 0 // Create a counter to track how many frame have occured
let currentStep = 0 // Create a counter track the current timestep
let _p = null // Create a pointer to the p5 sketch
let images = {}

function initializeSimulation(p) {
  // Reset the current step
  currentStep = 0
  // Create the initial population list
  let pop = []
  // Create all of the locations
  let locations = {}
  for(let i = 0; i < locationTypes.length; i++) {
    locations[locationTypes[i]] = []
    for(let j = 0; j < maps[params.map].locations[locationTypes[i]]; j++) {
      locations[locationTypes[i]].push(new Location(j, 0, p.createVector(p.random(p.width), p.random(p.height)), 'fff', locationTypes[i], diseases[params.disease], params))
    }
  }

  map = new DiseaseMap(params.map, locations, pop, maps[params.map].background, p, params.graphMode, images)

  // Create the initial population 
  for(let i = 0; i < maps[params.map].initialPopulation; i++) {
    pop.push(new Person(i, params, diseases[params.disease], map))
    pop[i].generatePerson()
  }
}

let updateHTMLWithParams = () => {
  Object.keys(params).filter((key) => {
    return !["maskEffectiveness", "maskPercent", "graphMode"].includes(key)}).forEach((key) => {
      if(["masks", "quarantine"].includes(key)) {
        document.getElementById(key).checked = params[key]
      }
      else {
        document.getElementById(key).value = params[key]
      } 
  })
}

// Instantiate and define the sketch
let sketch = p => {
  p.preload = () => {
    images = {
        homes: p.loadImage('./assets/house.png'),
        hospitals: p.loadImage('./assets/hospital.png'),
        entertainment: p.loadImage('./assets/entertainment.png'),
        jobs: p.loadImage('./assets/job.png'),
        schools: p.loadImage('./assets/school.png')
    }
  }

  p.setup = () => {
    p.createCanvas(sk.w, sk.h)
    p.frameRate(fr)

    _p = p

    getParams()
    updateHTMLWithParams()

    initializeSimulation(_p)
  }

  p.draw = () => {
    map.show()

    if(isRunning){
      // Run one step
      if(frameCounter >= fr * secondsPerStep) {
        currentStep++
        map.step()
        frameCounter = 0
      }

      frameCounter++
    }
  }
}

new p5(sketch, 'sketch-container')