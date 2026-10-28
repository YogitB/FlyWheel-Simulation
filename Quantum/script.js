    
const canvas = document.getElementById("flywheel");
const ctx = canvas.getContext("2d");

const graphCanvas = document.getElementById("velocityGraph");
const graphCtx = graphCanvas.getContext("2d");

const simulationTimeDisplay = document.getElementById("simulationTime");


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
let elapsedTime = 0; 
let velocityHistory = [];
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
function drawVelocityGraph() {
    const width = graphCanvas.width;
    const height = graphCanvas.height;

    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    graphCtx.clearRect(0, 0, width, height);

    // Draw the graph background
    graphCtx.fillStyle = "#0b1222";
    graphCtx.fillRect(0, 0, width, height);

    const maxTime = Math.max(5, elapsedTime);


    const maxOmega = Math.max(
        10,
        ...velocityHistory.map(point => point.omega)
    ) * 1.1;

    // draw horizontal grid lines 
    graphCtx.font = "12px Arial";
    graphCtx.textAlign = "right";
    graphCtx.textBaseline = "middle";

    for (let i = 0; i <= 4; i++) {
        const value = (maxOmega / 4) * i;
        const y = height - paddingBottom
            - (value / maxOmega) * plotHeight;

        graphCtx.beginPath();
        graphCtx.moveTo(paddingLeft, y);
        graphCtx.lineTo(width - paddingRight, y);
        graphCtx.strokeStyle = "#293449";
        graphCtx.lineWidth = 1;
        graphCtx.stroke();

        graphCtx.fillStyle = "#94a3b8";
        graphCtx.fillText(value.toFixed(1), paddingLeft - 8, y);
    }

    graphCtx.textAlign = "center";
    graphCtx.textBaseline = "top";

    for (let i = 0; i <= 5; i++) {
        const value = (maxTime / 5) * i;
        const x = paddingLeft + (value / maxTime) * plotWidth;

        graphCtx.fillStyle = "#94a3b8";
        graphCtx.fillText(value.toFixed(1), x, height - paddingBottom + 8);
    }
    graphCtx.fillStyle = "#e5e7eb";
    graphCtx.font = "12px Arial";
    graphCtx.textAlign = "center";

    graphCtx.fillText(
        "Time (s)",
        paddingLeft + plotWidth / 2,
        height - 12
    );

    graphCtx.save();
    graphCtx.translate(15, paddingTop + plotHeight / 2);
    graphCtx.rotate(-Math.PI / 2);
    graphCtx.fillText("Angular velocity (rad/s)", 0, 0);
    graphCtx.restore();

    // draw angle velocity
    if (velocityHistory.length < 2) {
        return;
    }

    graphCtx.beginPath();

    velocityHistory.forEach((point, index) => {
        const x = paddingLeft
            + (point.time / maxTime) * plotWidth;

        const y = height - paddingBottom
            - (point.omega / maxOmega) * plotHeight;

        if (index === 0) {
            graphCtx.moveTo(x, y);
        } else {
            graphCtx.lineTo(x, y);
        }
    });

    graphCtx.strokeStyle = "#38bdf8";
    graphCtx.lineWidth = 3;
    graphCtx.stroke();
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

