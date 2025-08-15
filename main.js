// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const topicSections = document.querySelectorAll('.topic-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.dataset.topic;
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            topicSections.forEach(section => section.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(topic).classList.add('active');
        });
    });
});

// Common utility functions
function createCanvas(containerId, sketch) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    return new p5(sketch, container);
}

function updateSliderValue(sliderId, displayId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    
    slider.addEventListener('input', function() {
        display.textContent = this.value + suffix;
    });
}
