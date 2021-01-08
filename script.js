// Create a model for storing configuration data
params = {
  "map": "Town",
  "disease": "Influenza A",
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

// TODO Create a model for storing data about the diseases

// Define details about the sketch
let simArea = document.getElementById('sim-area')

sk = {
  w: simArea.clientWidth,
  h: simArea.clientHeight
}

// Instantiate and define the sketch
let sketch = p => {
  p.setup = () => {
    p.createCanvas(sk.w, sk.h)
    p.background('#C4C4C4')
  }
}

new p5(sketch, 'sketch-container')