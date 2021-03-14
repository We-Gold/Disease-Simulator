function LineChart(params) {
  this.p = params.p5sketch

  this.padding = 30
  this.data = params.data // [[]]
  this.colors = params.colors
  this.lineLabels = params.lineLabels
  this.chartWidth = params.chartWidth
  this.w = params.w
  this.h = params.h
  this.chartW = this.chartWidth - this.padding
  this.chartH = this.chartWidth - this.padding
  this.x = params.x
  this.y = params.y
  this.chartX = this.padding
  this.chartY = this.padding
  this.xRange = params.xRange // [min, max]
  this.yRange = params.yRange // [min, max]
  this.hAxisLabelCount = 6
  this.vAxisLabelCount = 5
  this.xLine = this.p.map(this.yRange[0], this.yRange[0], this.yRange[1], this.chartH, this.chartY)
  this.yLine = this.p.map(this.xRange[0], this.xRange[0], this.xRange[1], this.chartX, this.chartW)

  this.show = () => {
    this.p.rectMode(this.p.CORNER)
    this.p.fill(255)
    this.p.push()
    this.p.translate(this.x, this.y)
    this.p.rect(0, 0, this.w, this.h)

    this.drawLineLabels()

    this.p.translate(this.w - this.chartWidth - (this.padding / 3), (this.h - this.chartWidth)/2)

    this.drawAxes()

    this.drawAllData()

    this.drawXAxisLabels()

    this.drawYAxisLabels()
    
    this.p.pop()
  }

  this.drawAxes = () => {
    this.p.fill(0)
    this.p.stroke(0)
    this.p.strokeWeight(2)
    this.p.line(this.chartX, this.xLine, this.chartW, this.xLine)
    this.p.line(this.yLine, this.chartY, this.yLine, this.chartH)
  }

  this.drawAllData = () => {
    for (let i = 0; i < this.data.length; i++) {
      let prev = null;
      for (let j = 0; j < this.data[i].length; j++) {
        let x = this.p.map(this.data[i][j].x, this.xRange[0], this.xRange[1], this.chartX, this.chartX + this.chartW - this.padding)
        let y = (this.chartY + this.chartH) - this.p.map(this.data[i][j].y, this.yRange[0], this.yRange[1], this.chartY, this.chartY + this.chartH - this.padding)

        if (prev == null) {
          prev = this.p.createVector(x, y)
        } else {
          this.p.stroke(this.colors[i])
          this.p.line(prev.x, prev.y, x, y)
          this.p.fill(0)
          this.p.stroke(0)
          // this.p.circle(prev.x, prev.y, 4)
          prev = this.p.createVector(x, y)
        }

        this.p.fill(0)
        this.p.stroke(0)
        // this.p.circle(x, y, 4)
      }
    }
  }

  this.drawLineLabels = () => {
    this.p.strokeWeight(0)
    this.p.textAlign(this.p.LEFT, this.p.BOTTOM)
    this.p.textSize(this.p.constrain(this.p.textSize(), 12, 18))
    
    let totalWidth = 0
    
    let textPadding = 10
    
    for (let i = 0; i < this.lineLabels.length; i++) {
      totalWidth += this.p.textWidth(this.lineLabels[i]) + textPadding
      
      if(i + 1 == this.lineLabels.length) {
        totalWidth -= textPadding
      }
    }
    
    let startX = this.chartX + (this.w - (2 * this.padding) - totalWidth)/2 
    
    let startTracker = 0

    // Draw the line labels
    for (let i = 0; i < this.lineLabels.length; i++) {
      this.p.fill(this.colors[i])
      this.p.text(this.lineLabels[i], startX + startTracker, this.chartY - 4)
      startTracker += this.p.textWidth(this.lineLabels[i]) + textPadding
    }
  }

  this.drawXAxisLabels = () => {
    for (let i = 0; i < this.hAxisLabelCount; i++) {
      let label = this.p.map(i, 0, this.hAxisLabelCount - 1, this.xRange[0], this.xRange[1])
      this.p.strokeWeight(0)
      this.p.textAlign(this.p.CENTER)
      // this.p.textSize(10)
      this.p.fill(0)
      let x = this.p.map(label, this.xRange[0], this.xRange[1], this.chartX, this.chartX + this.chartW - this.padding)
      this.p.text(this.p.round(label) + "", x, this.xLine + 1.5*this.p.textSize())
      this.p.strokeWeight(2)
      this.p.line(x, this.xLine + 3, x, this.xLine - 3)
    }
  }

  this.drawYAxisLabels = () => {
    for (let i = 0; i < this.vAxisLabelCount; i++) {
      let label = this.p.map(i, 0, this.vAxisLabelCount - 1, this.yRange[0], this.yRange[1])
      this.p.strokeWeight(0)
      this.p.textAlign(this.p.RIGHT, this.p.CENTER)
      // this.p.textSize(10)
      this.p.fill(0)
      let y = (this.chartY + this.chartH) - this.p.map(label, this.yRange[0], this.yRange[1], this.chartY, this.chartY + this.chartH - this.padding)
      this.p.text(this.p.round(label) + "", this.yLine - (this.padding * 0.25), y)
      this.p.strokeWeight(2)
      this.p.line(this.yLine + 3, y, this.yLine - 3, y)
    }
  }
}