const pieChart = (p, position, diameter, angles, colors) => {
  let lastAngle = 0
  for (let i = 0; i < angles.length; i++) {
    p.noStroke()
    p.fill(colors[i])
    p.arc(
      position[0],
      position[1],
      diameter,
      diameter,
      lastAngle,
      lastAngle + p.radians(angles[i])
    )
    lastAngle += p.radians(angles[i])
  }
}