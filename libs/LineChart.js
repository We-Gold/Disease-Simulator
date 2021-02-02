function LineChart(data, colors, lineLabels, w, h, x, y, xRange, yRange, p5sketch) {
  this.p = p5sketch

  this.padding = 30
  this.data = data // [[]]
  this.colors = colors
  this.lineLabels = lineLabels
  this.w = w
  this.h = h
  this.chartW = w - this.padding
  this.chartH = h - this.padding
  this.x = x
  this.y = y
  this.chartX = this.padding
  this.chartY = this.padding
  this.xRange = xRange // [min, max]
  this.yRange = yRange // [min, max]
  this.hAxisLabelCount = 6
  this.vAxisLabelCount = 5
  this.xLine = this.p.map(yRange[0], yRange[0], yRange[1], this.chartH, this.chartY)
  this.yLine = this.p.map(xRange[0], xRange[0], xRange[1], this.chartX, this.chartW)

  this.show = () => {
    this.p.rectMode(this.p.CORNER)
    this.p.fill(255)
    this.p.push()
    this.p.translate(x, y)
    this.p.rect(0, 0, w, h)

    this.p.fill(0)
    this.p.stroke(0)
    this.p.strokeWeight(2)
    this.p.line(this.chartX, this.xLine, this.chartW, this.xLine)
    this.p.line(this.yLine, this.chartY, this.yLine, this.chartH)

    for (let i = 0; i < data.length; i++) {
      let prev = null;
      for (let j = 0; j < data[i].length; j++) {
        let x = this.p.map(data[i][j].x, this.xRange[0], this.xRange[1], this.chartX, this.chartX + this.chartW - this.padding)
        let y = (this.chartY + this.chartH) - this.p.map(data[i][j].y, this.yRange[0], this.yRange[1], this.chartY, this.chartY + this.chartH - this.padding)

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

    // Draw the x axis labels
    for (let i = 0; i < this.hAxisLabelCount; i++) {
      let label = this.p.map(i, 0, this.hAxisLabelCount - 1, this.xRange[0], this.xRange[1])
      this.p.strokeWeight(0)
      this.p.textAlign(this.p.CENTER)
      this.p.textSize(10)
      this.p.fill(0)
      let x = this.p.map(label, this.xRange[0], this.xRange[1], this.chartX, this.chartX + this.chartW - this.padding)
      this.p.text(this.p.round(label) + "", x, this.xLine + (this.padding * 0.7))
      this.p.strokeWeight(2)
      this.p.line(x, this.xLine + 3, x, this.xLine - 3)
    }

    // Draw the y axis labels
    for (let i = 0; i < this.vAxisLabelCount; i++) {
      let label = this.p.map(i, 0, this.vAxisLabelCount - 1, this.yRange[0], this.yRange[1])
      this.p.strokeWeight(0)
      this.p.textAlign(this.p.RIGHT, this.p.CENTER)
      this.p.textSize(10)
      this.p.fill(0)
      let y = (this.chartY + this.chartH) - this.p.map(label, this.yRange[0], this.yRange[1], this.chartY, this.chartY + this.chartH - this.padding)
      this.p.text(this.p.round(label) + "", this.yLine - (this.padding * 0.25), y)
      this.p.strokeWeight(2)
      this.p.line(this.yLine + 3, y, this.yLine - 3, y)
    }

    this.p.strokeWeight(0)
    this.p.textAlign(this.p.LEFT, this.p.BOTTOM)
    this.p.textSize(12)
    
    let totalWidth = 0
    
    let textPadding = 10
    
    for (let i = 0; i < this.lineLabels.length; i++) {
      totalWidth += this.p.textWidth(this.lineLabels[i]) + textPadding
      
      if(i + 1 == this.lineLabels.length) {
        totalWidth -= textPadding
      }
    }
    
    let startX = this.chartX + (this.chartW - this.padding - totalWidth)/2 
    
    let startTracker = 0

    // Draw the line labels
    for (let i = 0; i < this.lineLabels.length; i++) {
      this.p.fill(this.colors[i])
      this.p.text(this.lineLabels[i], startX + startTracker, this.chartY - 3)
      startTracker += this.p.textWidth(this.lineLabels[i]) + textPadding
    }
    this.p.pop()
  }
}