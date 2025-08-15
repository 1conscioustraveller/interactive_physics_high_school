let kinematicsSketch;

const kinematics = function(p) {
    let projectile = {
        x: 50,
        y: 350,
        vx: 0,
        vy: 0,
        radius: 10,
        trail: []
    };
    
    let initialVelocity = 20;
    let angle = 45;
    let isLaunched = false;
    let g = 9.8;
    let scale = 2;
    
    p.setup = function() {
        p.createCanvas(600, 400);
        setupControls();
    };
    
    p.draw = function() {
        p.background(240);
        drawGrid();
        
        if (isLaunched) {
            updateProjectile();
        }
        
        drawProjectile();
        drawTrajectory();
        updateData();
    };
    
    function setupControls() {
        updateSliderValue('velocity-slider', 'velocity-value', ' m/s');
        updateSliderValue('angle-slider', 'angle-value', '°');
        
        document.getElementById('launch-btn').addEventListener('click', launch);
        document.getElementById('reset-btn').addEventListener('click', reset);
    }
    
    function launch() {
        initialVelocity = parseFloat(document.getElementById('velocity-slider').value);
        angle = parseFloat(document.getElementById('angle-slider').value);
        
        projectile.x = 50;
        projectile.y = 350;
        projectile.vx = initialVelocity * Math.cos(angle * Math.PI / 180) * scale;
        projectile.vy = -initialVelocity * Math.sin(angle * Math.PI / 180) * scale;
        projectile.trail = [];
        
        isLaunched = true;
    }
    
    function reset() {
        isLaunched = false;
        projectile.x = 50;
        projectile.y = 350;
        projectile.trail = [];
        p.background(240);
    }
    
    function updateProjectile() {
        projectile.x += projectile.vx / 30;
        projectile.y += projectile.vy / 30;
        projectile.vy += g * scale / 30;
        
        projectile.trail.push({x: projectile.x, y: projectile.y});
        
        if (projectile.trail.length > 100) {
            projectile.trail.shift();
        }
        
        if (projectile.y >= 350) {
            isLaunched = false;
        }
    }
    
    function drawProjectile() {
        p.fill(255, 0, 0);
        p.noStroke();
        p.ellipse(projectile.x, projectile.y, projectile.radius * 2);
    }
    
    function drawTrajectory() {
        p.stroke(100, 100, 255);
        p.strokeWeight(2);
        p.noFill();
        
        let v0 = initialVelocity * scale;
        let theta = angle * Math.PI / 180;
        let steps = 50;
        
        p.beginShape();
        for (let i = 0; i <= steps; i++) {
            let t = (i / steps) * (2 * v0 * Math.sin(theta) / g);
            let x = 50 + v0 * Math.cos(theta) * t;
            let y = 350 - (v0 * Math.sin(theta) * t - 0.5 * g * t * t);
            
            if (y <= 350) {
                p.vertex(x, y);
            }
        }
        p.endShape();
        
        // Draw trail
        p.stroke(255, 0, 0, 100);
        p.strokeWeight(1);
        p.beginShape();
        for (let point of projectile.trail) {
            p.vertex(point.x, point.y);
        }
        p.endShape();
    }
    
    function drawGrid() {
        p.stroke(200);
        p.strokeWeight(1);
        
        for (let x = 0; x <= p.width; x += 50) {
            p.line(x, 0, x, p.height);
            p.textAlign(p.CENTER);
            p.text((x - 50) / scale + "m", x, 395);
        }
        
        for (let y = 0; y <= p.height; y += 50) {
            p.line(0, y, p.width, y);
            p.textAlign(p.RIGHT);
            p.text((350 - y) / scale + "m", 45, y + 5);
        }
    }
    
    function updateData() {
        const v0 = initialVelocity;
        const theta = angle * Math.PI / 180;
        
        const maxHeight = (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);
        const range = (v0 * v0 * Math.sin(2 * theta)) / g;
        const timeFlight = (2 * v0 * Math.sin(theta)) / g;
        
        document.getElementById('max-height').textContent = maxHeight.toFixed(1);
        document.getElementById('range').textContent = range.toFixed(1);
        document.getElementById('time-flight').textContent = timeFlight.toFixed(1);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    kinematicsSketch = createCanvas('kinematics-canvas', kinematics);
});
