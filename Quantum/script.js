    
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

