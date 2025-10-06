
// Global variables
let stopwatchInterval;
let countdownInterval;
let stopwatchTime = 0;
let countdownTime = 0;
let isStopwatchRunning = false;
let isCountdownRunning = false;
let lapCounter = 1;

// Tab switching functionality
function switchTab(tab) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.timer-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tab).classList.add('active');
}

// Utility function to format time
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Stopwatch functions
function startStopwatch() {
    if (!isStopwatchRunning) {
        isStopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            document.getElementById('stopwatch-display').textContent = formatTime(stopwatchTime);
        }, 1000);
        
        // Update button visibility
        document.getElementById('stopwatch-start').style.display = 'none';
        document.getElementById('stopwatch-pause').style.display = 'inline-block';
        document.getElementById('stopwatch-lap').style.display = 'inline-block';
    }
}

function pauseStopwatch() {
    if (isStopwatchRunning) {
        isStopwatchRunning = false;
        clearInterval(stopwatchInterval);
        
        // Update button visibility
        document.getElementById('stopwatch-start').style.display = 'inline-block';
        document.getElementById('stopwatch-pause').style.display = 'none';
        document.getElementById('stopwatch-lap').style.display = 'none';
    }
}

function resetStopwatch() {
    isStopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    lapCounter = 1;
    
    document.getElementById('stopwatch-display').textContent = '00:00:00';
    document.getElementById('laps-container').innerHTML = '';
    
    // Reset button visibility
    document.getElementById('stopwatch-start').style.display = 'inline-block';
    document.getElementById('stopwatch-pause').style.display = 'none';
    document.getElementById('stopwatch-lap').style.display = 'none';
}

function lapStopwatch() {
    if (isStopwatchRunning) {
        const lapTime = formatTime(stopwatchTime);
        const lapContainer = document.getElementById('laps-container');
        
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span>Lap ${lapCounter}</span>
            <span>${lapTime}</span>
        `;
        
        lapContainer.insertBefore(lapItem, lapContainer.firstChild);
        lapCounter++;
    }
}

// Countdown functions
function updateCountdownDisplay() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    
    countdownTime = hours * 3600 + minutes * 60 + seconds;
    document.getElementById('countdown-display').textContent = formatTime(countdownTime);
}

function startCountdown() {
    if (!isCountdownRunning) {
        // Get initial time if not already set
        if (countdownTime === 0) {
            updateCountdownDisplay();
        }
        
        if (countdownTime > 0) {
            isCountdownRunning = true;
            countdownInterval = setInterval(() => {
                countdownTime--;
                document.getElementById('countdown-display').textContent = formatTime(countdownTime);
                
                if (countdownTime <= 0) {
                    // Countdown finished
                    clearInterval(countdownInterval);
                    isCountdownRunning = false;
                    document.getElementById('countdown-display').classList.add('finished');
                    
                    // Play notification sound (optional)
                    playNotificationSound();
                    
                    // Reset button visibility
                    document.getElementById('countdown-start').style.display = 'inline-block';
                    document.getElementById('countdown-pause').style.display = 'none';
                    
                    // Show alert
                    setTimeout(() => {
                        alert('Time\'s up!');
                        document.getElementById('countdown-display').classList.remove('finished');
                    }, 100);
                }
            }, 1000);
            
            // Update button visibility
            document.getElementById('countdown-start').style.display = 'none';
            document.getElementById('countdown-pause').style.display = 'inline-block';
        } else {
            alert('Please set a valid countdown time!');
        }
    }
}

function pauseCountdown() {
    if (isCountdownRunning) {
        isCountdownRunning = false;
        clearInterval(countdownInterval);
        
        // Update button visibility
        document.getElementById('countdown-start').style.display = 'inline-block';
        document.getElementById('countdown-pause').style.display = 'none';
    }
}

function resetCountdown() {
    isCountdownRunning = false;
    clearInterval(countdownInterval);
    countdownTime = 0;
    
    // Reset input values
    document.getElementById('hours').value = 0;
    document.getElementById('minutes').value = 5;
    document.getElementById('seconds').value = 0;
    
    // Update display
    updateCountdownDisplay();
    document.getElementById('countdown-display').classList.remove('finished');
    
    // Reset button visibility
    document.getElementById('countdown-start').style.display = 'inline-block';
    document.getElementById('countdown-pause').style.display = 'none';
}

// Optional notification sound function
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Audio notification not supported');
    }
}

// Initialize countdown display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCountdownDisplay();
});
