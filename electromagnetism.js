let emSketch;

const electromagnetism = function(p) {
    let charges = [];
    let fieldLines = [];
    let showField = false;
    let showEquipotential = false;
    
    p.setup = function() {
        p.createCanvas(600, 400);
        setupControls();
        
        // Initialize charges
        charges.push({x: 200, y: 200, q: 1, color: p.color(255, 0, 0)});
        charges.push({x: 400, y: 200, q: -1, color: p.color(0, 0, 255)});
    };
    
    p.draw = function() {
        p.background(240);
        
        // Draw grid
        drawGrid();
        
        // Update charges from sliders
        charges[0].q = parseFloat(document.getElementById('charge1-slider').value);
        charges[1].q = parseFloat(document.getElementById('charge2-slider').value);
        
        // Draw charges
        drawCharges();
        
        // Draw field lines if enabled
        if (showField) {
            drawFieldLines();
        }
        
        // Draw equipotential lines if enabled
        if (showEquipotential) {
            drawEquipotentialLines();
        }
        
        // Draw legend
        drawLegend();
    };
    
    function setupControls() {
        updateSliderValue('charge1-slider', 'charge1-value', ' μC');
        updateSliderValue('charge2-slider', 'charge2-value', ' μC');
        
        document.getElementById('show-field-btn').addEventListener('click', function() {
            showField = !showField;
            this.textContent = showField ? 'Hide Field Lines' : 'Show Field Lines';
        });
        
        document.getElementById('show-equipotential-btn').addEventListener('click', function() {
            showEquipotential = !showEquipotential;
            this.textContent = showEquipotential ? 'Hide Equipotential' : 'Show Equipotential Lines';
        });
        
        // Make charges draggable
        p.mousePressed = function() {
            charges.forEach(charge => {
                let d = p.dist(p.mouseX, p.mouseY, charge.x, charge.y);
                if (d < 20) {
                    charge.dragging = true;
                }
            });
        };
        
        p.mouseDragged = function() {
            charges.forEach(charge => {
                if (charge.dragging) {
                    charge.x = p.constrain(p.mouseX, 30, p.width - 30);
                    charge.y = p.constrain(p.mouseY, 30, p.height - 30);
                }
            });
        };
        
        p.mouseReleased = function() {
            charges.forEach(charge => {
                charge.dragging = false;
            });
        };
    }
    
    function drawGrid() {
        p.stroke(200);
        p.strokeWeight(1);
        
        for (let x = 0; x <= p.width; x += 50) {
            p.line(x, 0, x, p.height);
        }
        
        for (let y = 0; y <= p.height; y += 50) {
            p.line(0, y, p.width, y);
        }
    }
    
    function drawCharges() {
        charges.forEach(charge => {
            p.fill(charge.color);
            p.noStroke();
            p.ellipse(charge.x, charge.y, 40);
            
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.text(charge.q > 0 ? '+' : (charge.q < 0 ? '-' : '0'), charge.x, charge.y);
        });
    }
    
    function drawFieldLines() {
        const numLines = 16;
        
        charges.forEach(charge => {
            if (charge.q === 0) return;
            
            const numRays = Math.abs(charge.q) * numLines;
            const angleStep = p.TWO_PI / numRays;
            
            for (let i = 0; i < numRays; i++) {
                let angle = i * angleStep;
                let x = charge.x + 25 * Math.cos(angle);
                let y = charge.y + 25 * Math.sin(angle);
                
                p.stroke(0);
                p.strokeWeight(1);
                
                for (let step = 0; step < 100; step++) {
                    let field = calculateField(x, y);
                    let fieldMag = Math.sqrt(field.x * field.x + field.y * field.y);
                    
                    if (fieldMag < 0.1) break;
                    
                    let nextX = x + field.x / fieldMag * 3;
                    let nextY = y + field.y / fieldMag * 3;
                    
                    if (nextX < 0 || nextX > p.width || nextY < 0 || nextY > p.height) break;
                    
                    p.line(x, y, nextX, nextY);
                    
                    // Check if too close to another charge
                    for (let other of charges) {
                        if (other !== charge && p.dist(nextX, nextY, other.x, other.y) < 25) {
                            step = 100;
                            break;
                        }
                    }
                    
                    x = nextX;
                    y = nextY;
                }
            }
        });
    }
    
    function drawEquipotentialLines() {
        const voltageLevels = [-5, -3, -1, 0, 1, 3, 5];
        
        voltageLevels.forEach(voltage => {
            p.stroke(0, 150, 0);
            p.strokeWeight(1);
            p.noFill();
            p.beginShape();
            
            for (let x = 30; x < p.width - 30; x += 2) {
                for (let y = 30; y < p.height - 30; y += 2) {
                    let v = calculatePotential(x, y);
                    if (Math.abs(v - voltage) < 0.1) {
                        p.vertex(x, y);
                    }
                }
            }
            p.endShape();
        });
    }
    
    function calculateField(x, y) {
        let fx = 0, fy = 0;
        
        charges.forEach(charge => {
            let dx = x - charge.x;
            let dy = y - charge.y;
            let r = Math.sqrt(dx * dx + dy * dy);
            
            if (r > 5) {
                let force = charge.q / (r * r);
                fx += force * dx / r;
                fy += force * dy / r;
            }
        });
        
        return {x: fx, y: fy};
    }
    
    function calculatePotential(x, y) {
        let potential = 0;
        
        charges.forEach(charge => {
            let dx = x - charge.x;
            let dy = y - charge.y;
            let r = Math.sqrt(dx * dx + dy * dy);
            
            if (r > 5) {
                potential += charge.q / r;
            }
        });
        
        return potential;
    }
    
    function drawLegend() {
        p.fill(0);
        p.noStroke();
        p.textAlign(p.LEFT);
        p.textSize(12);
        
        p.fill(255, 0, 0);
        p.ellipse(50, 30, 20);
        p.fill(0);
        p.text("Positive Charge", 70, 35);
        
        p.fill(0, 0, 255);
        p.ellipse(50, 60, 20);
        p.fill(0);
        p.text("Negative Charge", 70, 65);
        
        if (showField) {
            p.stroke(0);
            p.line(50, 90, 70, 90);
            p.fill(0);
            p.text("Electric Field Lines", 80, 95);
        }
        
        if (showEquipotential) {
            p.stroke(0, 150, 0);
            p.line(50, 120, 70, 120);
            p.fill(0);
            p.text("Equipotential Lines", 80, 125);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    emSketch = createCanvas('em-canvas', electromagnetism);
});
