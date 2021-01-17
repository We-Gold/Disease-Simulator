// Create a model for storing configuration data
let params = {
  "map": "Town",
  "disease": "Influenza",
  "initialInfectedPercent": 3,
  "masks": true,
  // "maskDelay": 0,
  // "maskPercent": 90,
  "quarantine": true,
  // "quarDelay": 0,
  // "quarPercent": 95,
  "vaccine": true,
  // "vaccDelay": 300,
  // "vaccPercent": 99,
  "vaccEffectiveness": 85.63,
  "medCareCapacity": 135
}

// States of infection:
// 0 - Not infected
// 1 - infected
// 2 - symptomatic
// 3 - testing
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

document.getElementById("beginSimButton").addEventListener('click', ()=>{
  for(var key of Object.keys(params)) {
    params[key] = ["masks", "quarantine", "vaccine"].includes(key) ? document.getElementById(key).checked : document.getElementById(key).value
  }
  isRunning = true
  hide(document.getElementById("beginSimButton"))
  show(document.querySelector(".btn-group"))
})

document.getElementById("toggleSimButton").addEventListener('click', ()=>{
  isRunning = !isRunning
  document.getElementById("toggleSimButton").innerText == "Resume" ? document.getElementById("toggleSimButton").innerText = "Pause" : document.getElementById("toggleSimButton").innerText = "Resume"
})

document.getElementById("endSimButton").addEventListener('click', ()=>{
  isRunning = false
  // TODO do other stuff here to end the simulation
  show(document.getElementById("beginSimButton"))
  hide(document.querySelector(".btn-group"))
})

// The location where the sketch will be created:
let simArea = document.getElementById('sim-area')

// Define sketch dimensions
sk = {
  w: simArea.clientWidth,
  h: simArea.clientHeight
}

let map; // Store the main map class, which runs all operations
let fr = 30 // Define the frame rate
let secondsPerStep = 4 // Set how often a disease step will occur
let frameCounter = 0 // Create a counter to track how many frame have occured

// Instantiate and define the sketch
let sketch = p => {
  p.setup = () => {
    p.createCanvas(sk.w, sk.h)
    p.frameRate(fr)

    // Create the initial population list
    let pop = []
    // Create all of the locations
    let locations = {}
    for(let i = 0; i < locationTypes.length; i++) {
      locations[locationTypes[i]] = []
      for(let j = 0; j < maps[params.map].locations[locationTypes[i]]; j++) {
        locations[locationTypes[i]].push(new Location(0, p.createVector(p.random(p.width), p.random(p.height)), 'fff'))
      }
    }

    map = new DiseaseMap(params.map, locations, pop, maps[params.map].background, p)

    // Create the initial population 
    for(let i = 0; i < maps[params.map].initialPopulation; i++) {
      pop.push(new Person(i, params, diseases[params.disease], map))
      pop[i].generatePerson()
    }
  }

  p.draw = () => {
    map.show()

    // Run one step
    if(frameCounter >= fr * secondsPerStep) {
      map.step()
      frameCounter = 0
    }

    frameCounter++
  }
}

new p5(sketch, 'sketch-container')