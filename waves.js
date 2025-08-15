let wavesSketch;

const waves = function(p) {
    let waves = [];
    let isPaused = false;
    let freq1 = 2;
    let freq2 = 2;
    let phaseDiff = 0;
    
    p.setup = function() {
        p.createCanvas(600, 400);
        setupControls();
        
        // Initialize waves
        for (let i = 0; i < 3; i++) {
            waves.push({
                amplitude: 50,
                frequency: 2,
                phase: 0,
                color: p.color(100 + i * 50, 100, 255 - i * 50)
            });
        }
    };
    
    p.draw = function() {
        p.background(240);
        
        if (!isPaused) {
            updateWaves();
        }
        
        drawWaves();
        drawInterference();
    };
    
    function setupControls() {
        updateSliderValue('freq1-slider', 'freq1-value', ' Hz');
        updateSliderValue('freq2-slider', 'freq2-value', ' Hz');
        updateSliderValue('phase-slider', 'phase-value', '°');
        
        document.getElementById('pause-btn').addEventListener('click', function() {
            isPaused = !isPaused;
            this.textContent = isPaused ? 'Resume' : 'Pause';
        });
        
        document.getElementById('freq1-slider').addEventListener('input', function() {
            freq1 = parseFloat(this.value);
            waves[0].frequency = freq1;
        });
        
        document.getElementById('freq2-slider').addEventListener('input', function() {
            freq2 = parseFloat(this.value);
            waves[1].frequency = freq2;
        });
        
        document.getElementById('phase-slider').addEventListener('input', function() {
            phaseDiff = parseFloat(this.value) * Math.PI / 180;
            waves[1].phase = phaseDiff;
        });
    }
    
    function updateWaves() {
        waves.forEach(wave => {
            wave.phase += 0.05 * wave.frequency;
        });
    }
    
    function drawWaves() {
        p.strokeWeight(2);
        
        // Draw wave 1
        p.stroke(waves[0].color);
        drawWave(waves[0], 100);
        
        // Draw wave 2
        p.stroke(waves[1].color);
        drawWave(waves[1], 200);
        
        // Draw interference pattern
        p.stroke(0, 200, 100);
        drawInterferenceWave(300);
    }
    
    function drawWave(wave, yOffset) {
        p.beginShape();
        for (let x = 0; x <= p.width; x += 2) {
            let y = yOffset + wave.amplitude * Math.sin(
                2 * Math.PI * wave.frequency * (x / p.width) + wave.phase
            );
            p.vertex(x, y);
        }
        p.endShape();
        
        // Label
        p.fill(0);
        p.noStroke();
        p.text(`Wave (${wave.frequency} Hz)`, 10, yOffset - 60);
    }
    
    function drawInterferenceWave(yOffset) {
        p.beginShape();
        for (let x = 0; x <= p.width; x += 2) {
            let y1 = 100 + waves[0].amplitude * Math.sin(
                2 * Math.PI * waves[0].frequency * (x / p.width) + waves[0].phase
            );
            let y2 = 200 + waves[1].amplitude * Math.sin(
                2 * Math.PI * waves[1].frequency * (x / p.width) + waves[1].phase
            );
            let y = yOffset + (y1 - 100) + (y2 - 200);
            p.vertex(x, y);
        }
        p.endShape();
        
        // Label
        p.fill(0);
        p.noStroke();
        p.text('Interference Pattern', 10, yOffset - 60);
    }
    
    function drawInterference() {
        // Draw standing wave visualization
        p.push();
        p.translate(p.width/2, p.height/2 + 50);
        
        let points = 100;
        p.stroke(255, 100, 100);
        p.strokeWeight(3);
        p.beginShape();
        for (let i = 0; i < points; i++) {
            let angle = p.map(i, 0, points, 0, p.TWO_PI);
            let r = 80 + 40 * Math.sin(angle * 3 + p.frameCount * 0.02);
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
        
        p.pop();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    wavesSketch = createCanvas('waves-canvas', waves);
});
