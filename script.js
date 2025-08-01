const targetNumberEl = document.getElementById('target-number');
const nextBtn = document.getElementById('next-btn');
const calcScreen = document.getElementById('calc-screen');
const buttons = document.querySelector('.buttons');
const mascot = document.getElementById('mascot');
const backgroundMusic = document.getElementById('background-music');
const winSound = document.getElementById('win-sound');
const wrongSound = document.getElementById('wrong-sound');
const makingSound = document.getElementById('making-sound');
const volumeSlider = document.getElementById('volume-slider');
const speakerIcon = document.getElementById('speaker-icon');
const speakerPath = document.getElementById('speaker-path');
const wavePath = document.getElementById('wave-path');

let targetNumber = 0;
let currentExpression = '';
const wrongMascots = ['angry.gif', 'sad.gif', 'cry.gif'];
let isMusicStarted = false;

// Set default volume to 5% and update the slider value
volumeSlider.value = 5;

// Function to handle playing background music on first user interaction
function playBackgroundMusic() {
    // Check if the music hasn't started yet
    if (!isMusicStarted) {
        backgroundMusic.volume = volumeSlider.value / 100; // Set initial volume
        backgroundMusic.play().then(() => {
            // If the music plays successfully, set the flag
            isMusicStarted = true;
        }).catch(e => {
            // Handle cases where autoplay is blocked, though it should work on user interaction
            console.log("Failed to play background music. It needs a user gesture.");
        });
    }
}

function generateNewTarget() {
    makingSound.pause();
    makingSound.currentTime = 0;
    
    mascot.src = 'making.gif';
    makingSound.play();

    targetNumberEl.style.transform = 'translateY(-100px)';
    targetNumberEl.style.opacity = '0';

    setTimeout(() => {
        makingSound.pause();
        makingSound.currentTime = 0;

        targetNumber = Math.floor(Math.random() * 10) + 1;
        targetNumberEl.textContent = targetNumber;
        
        targetNumberEl.style.transform = 'translateY(0)';
        targetNumberEl.style.opacity = '1';

        currentExpression = '';
        calcScreen.textContent = '0';
        mascot.src = 'waiting.gif';
    }, 2000);
}

function handleButtonClick(event) {
    playBackgroundMusic(); // This will trigger the music on ANY button click

    const buttonValue = event.target.textContent;

    winSound.pause();
    winSound.currentTime = 0;
    wrongSound.pause();
    wrongSound.currentTime = 0;

    if (event.target.classList.contains('num-btn') || event.target.classList.contains('op-btn')) {
        if (calcScreen.textContent === '0' && !'x+-÷'.includes(buttonValue)) {
            currentExpression = buttonValue;
        } else {
            currentExpression += buttonValue;
        }
        const displayExpression = currentExpression.replace('x', '*').replace('÷', '/');
        calcScreen.textContent = displayExpression;
    } else if (event.target.classList.contains('clear-btn')) {
        currentExpression = '';
        calcScreen.textContent = '0';
    } else if (event.target.classList.contains('del-btn')) {
        currentExpression = currentExpression.slice(0, -1);
        if (currentExpression === '') {
            calcScreen.textContent = '0';
        } else {
            calcScreen.textContent = currentExpression.replace('x', '*').replace('÷', '/');
        }
    } else if (event.target.classList.contains('equals-btn')) {
        checkAnswer();
    }
}

function checkAnswer() {
    try {
        const expressionToEval = currentExpression.replace('x', '*').replace('÷', '/');
        const result = eval(expressionToEval);

        if (result === targetNumber) {
            mascot.src = 'win.gif';
            winSound.play();
        } else {
            const randomWrongMascot = wrongMascots[Math.floor(Math.random() * wrongMascots.length)];
            mascot.src = randomWrongMascot;
            wrongSound.play();
        }
    } catch (e) {
        const randomWrongMascot = wrongMascots[Math.floor(Math.random() * wrongMascots.length)];
        mascot.src = randomWrongMascot;
        wrongSound.play();
    }
}

// Event Listeners
buttons.addEventListener('click', handleButtonClick);
nextBtn.addEventListener('click', () => {
    playBackgroundMusic(); // Also trigger music on the 'Next' button click
    generateNewTarget();
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    backgroundMusic.volume = e.target.value / 100;
});

// Toggle mute/unmute
speakerIcon.addEventListener('click', () => {
    // This is also a user interaction, so we can play the music here if it hasn't started
    playBackgroundMusic();
    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        backgroundMusic.volume = volumeSlider.value / 100;
        speakerPath.setAttribute('d', 'M11 5L6 9H2V15H6L11 19V5Z');
        wavePath.setAttribute('d', 'M15.5 8C17.8443 10.3443 17.8443 13.6557 15.5 16M19 4C23 8 23 16 19 20');
    } else {
        backgroundMusic.muted = true;
        speakerPath.setAttribute('d', 'M11 5L6 9H2V15H6L11 19V5Z');
        wavePath.setAttribute('d', 'M14.5 10L19 14.5M19 10L14.5 14.5');
    }
});

generateNewTarget();
