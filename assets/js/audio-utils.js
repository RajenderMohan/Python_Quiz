// Web Audio API implementation
let audioContext;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.error('Web Audio API not supported', e);
}

function playTone(frequency, duration, type = 'sine') {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
}

export function playCorrectSound() {
    playTone(880, 0.3); // High pitch
}

export function playIncorrectSound() {
    playTone(220, 0.5); // Low pitch
}

export function playWarningSound() {
    playTone(660, 0.1); // Beep
    setTimeout(() => playTone(660, 0.1), 150); // Double beep
}