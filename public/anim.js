var particles = [];

function addParticle() {
  particles.push({
    x: Math.random(),
    y: Math.random(),
    xVel: (Math.random() - 0.5) * 0.2,
    yVel: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 50 + 50
  });
}

function render() {
  var elem = document.getElementById("container");
  elem.innerHTML = "";
  
  for(i = 0; i < particles.length; i++) {
    var newParticle = "<div class='blob' style='width:" + particles[i].size + "px; height:" + particles[i].size +  "px; top:" + particles[i].y * window.innerHeight + "px; left:" + particles[i].x * window.innerWidth + "px;'></div>";
    elem.innerHTML += newParticle;
  }
}

function dataUpdate() {
  if(particles.length < 5 && Math.random() < 0.05) {
    addParticle();
  }
  
  for(i = 0; i < particles.length; i++) {
    particles[i].x += particles[i].xVel / 35;
    particles[i].y += particles[i].yVel / 35;
    if(particles[i].x > 1.2 || particles[i].x < -0.2 || particles[i].y > 1.2 || particles[i].y < -0.2) {
      particles.splice(i, 1);
    }
  }
}

function frame() {
  dataUpdate();
  render();
  
  window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);