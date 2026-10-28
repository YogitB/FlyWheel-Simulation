    
const canvas = document.getElementById("flywheel");
const ctx = canvas.getContext("2d");


const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

// Experiment sliders
const torqueSlider = document.getElementById("torque");
const inertiaSlider = document.getElementById("inertia");
const frictionSlider = document.getElementById("friction");

// labels
const torqueValue = document.getElementById("torqueValue");
const inertiaValue = document.getElementById("inertiaValue");
const frictionValue = document.getElementById("frictionValue");

// displays
const omegaDisplay = document.getElementById("omega");
const alphaDisplay = document.getElementById("alpha");
const energyDisplay = document.getElementById("energy");

let angle = 0;
let omega = 0;
let alpha = 0;
let running = false;
let lastTime = 0;
let animationId = null;
function calculatePhysics() {
    const torque = Number(torqueSlider.value);
    const inertia = Number(inertiaSlider.value);
    const friction = Number(frictionSlider.value);

    alpha = (torque - friction * omega) / inertia;

    const energy = 0.5 * inertia * omega * omega;

    return {
        torque: torque,
        inertia: inertia,
        friction: friction,
        alpha: alpha,
        energy: energy
    };
}

function updateDashboard() {
    const results = calculatePhysics();

    torqueValue.textContent = results.torque.toFixed(1);
    inertiaValue.textContent = results.inertia.toFixed(2);
    frictionValue.textContent = results.friction.toFixed(2);

    omegaDisplay.textContent = omega.toFixed(2) + " rad/s";
    alphaDisplay.textContent = results.alpha.toFixed(2) + " rad/s²";
    energyDisplay.textContent = results.energy.toFixed(2) + " J";
}

torqueSlider.addEventListener("input", updateDashboard);
inertiaSlider.addEventListener("input", updateDashboard);
frictionSlider.addEventListener("input", updateDashboard);

updateDashboard();

function drawFlywheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 115;

    // clear last frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw outer rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 8;
    ctx.stroke();

    // draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.72, 0, Math.PI * 2);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.stroke();

    //draw eight spokes 
    for (let i = 0; i < 8; i++) {
        const spokeAngle = angle + i * (Math.PI / 4);

        const endX = centerX + Math.cos(spokeAngle) * radius;
        const endY = centerY + Math.sin(spokeAngle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Draw hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();
}

function animate(timestamp) {
    if (!running) {
        return;
    }

    // Convert milisecs into secs
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Avoid a huge physics jump after a pause or lag
    dt = Math.min(dt, 0.05);
// Calculate current acceleeration
    const results = calculatePhysics();

    omega += results.alpha * dt;
    angle += omega * dt;

    updateDashboard();

    // draws the flywheel
    drawFlywheel();

    // schedule the time fram
    animationId = requestAnimationFrame(animate);
}

startButton.addEventListener("click", () => {
    if (running) {
        return;
    }

    running = true;
    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);
});

pauseButton.addEventListener("click", () => {
    running = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

resetButton.addEventListener("click", () => {
    running = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    angle = 0;
    omega = 0;
    alpha = 0;
    lastTime = 0;

    updateDashboard();
    drawFlywheel();
});

//
drawFlywheel();

