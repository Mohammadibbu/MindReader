let currentStep = 0;
let yc = [0, 0, 0, 0]; // Stores the values for each step

// Enhanced sound management
class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.volume = 0.6;
    this.enabled = true;
  }

  preload(soundName, url) {
    const audio = new Audio(url);
    audio.volume = this.volume;
    audio.preload = 'auto';
    this.sounds.set(soundName, audio);
  }

  play(soundName, volume = this.volume) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play().catch(e => console.log(`Sound play failed for ${soundName}:`, e));
    }
  }

  stop(soundName) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Initialize sound manager
const soundManager = new SoundManager();

// Preload sounds
const soundFiles = [
  'click', 'help', 'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen'
];

soundFiles.forEach(sound => {
  soundManager.preload(sound, `sounds/${sound}.mp3`);
});

// Enhanced vibration patterns
const VibrationPatterns = {
  click: [50],
  success: [100, 50, 100],
  celebration: [200, 100, 200, 100, 200],
  error: [300, 100, 300],
  subtle: [30],
  strong: [150]
};

// Enhanced haptic feedback
function playHapticFeedback(pattern = 'click', sound = 'click') {
  // Vibration
  if (navigator.vibrate && VibrationPatterns[pattern]) {
    navigator.vibrate(VibrationPatterns[pattern]);
  }
  
  // Sound
  soundManager.play(sound);
}

// Generates all combinations of [1,2,4,8] that sum to a target
function getCombinationsForSum(targetSum) {
  const candidates = [1, 2, 4, 8];
  const validCombinations = [];

  function backtrack(startIndex, currentCombo, currentSum) {
    if (currentSum === targetSum) {
      validCombinations.push([...currentCombo]);
      return;
    }
    if (currentSum > targetSum) return;

    for (let i = startIndex; i < candidates.length; i++) {
      currentCombo.push(candidates[i]);
      backtrack(i + 1, currentCombo, currentSum + candidates[i]);
      currentCombo.pop();
    }
  }

  backtrack(0, [], 0);
  console.log(`Valid combinations for sum ${targetSum}:`, validCombinations);

  const randomIndex = Math.floor(Math.random() * validCombinations.length);
  return validCombinations[randomIndex] || [];
}

// Enhanced assignment generator with better distribution
function assignStepsToGroups() {
  const groups = [[], [], [], []];
  const assignedSteps = [];

  // Generate unique random numbers from 0 to 15
  while (assignedSteps.length < 16) {
    const rand = Math.floor(Math.random() * 16);
    if (!assignedSteps.includes(rand)) {
      assignedSteps.push(rand);
    }
  }

  for (let i = 0; i <= assignedSteps.length; i++) {
    const stepValue = assignedSteps[i];
    const combo = getCombinationsForSum(i);

    combo.forEach((num) => {
      if (num === 4) num = 3;
      if (num === 8) num = 4;
      if (num >= 1 && num <= 4) {
        groups[num - 1].push(stepValue);
      }
    });
  }

  console.log("Final Group Assignments (1 to 4):", groups);
  return [groups, assignedSteps];
}

const [numbers, assignedSteps] = assignStepsToGroups();

// Enhanced number to word conversion
function numberToWordObject(number) {
  const words = [
    "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN",
    "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN"
  ];

  return {
    answer: `${words[number] || "UNKNOWN"}`,
    sound: words[number]?.toLowerCase() || "unknown",
  };
}

// Results mapping
const results = assignedSteps.map((acc, index) => {
  return numberToWordObject(acc);
});

console.log("Results Mapping:", results);

// Enhanced shuffle with animation consideration
function Shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Enhanced screen management with smooth transitions
function showScreen(screenId, direction = 'forward') {
  const screens = document.querySelectorAll('.game-screen, .loading-screen');
  const targetScreen = document.getElementById(screenId);
  
  if (!targetScreen) return;

  // Hide all screens with fade out
  screens.forEach(screen => {
    if (screen.classList.contains('active')) {
      screen.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      screen.style.opacity = '0';
      screen.style.transform = direction === 'forward' ? 'translateX(-30px)' : 'translateX(30px)';
      
      setTimeout(() => {
        screen.classList.remove('active');
        screen.style.display = 'none';
      }, 400);
    }
  });
  
  // Show target screen with fade in
  setTimeout(() => {
    targetScreen.style.display = 'block';
    targetScreen.style.opacity = '0';
    targetScreen.style.transform = direction === 'forward' ? 'translateX(30px)' : 'translateX(-30px)';
    
    setTimeout(() => {
      targetScreen.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      targetScreen.style.opacity = '1';
      targetScreen.style.transform = 'translateX(0)';
      targetScreen.classList.add('active');
    }, 50);
  }, direction === 'forward' ? 200 : 100);
}

// Enhanced step display with loading animation
function displayStep(stepIndex) {
  const stepDiv = document.getElementById(`step${stepIndex + 1}`);
  const numberList = stepDiv.querySelector(".number-list");
  
  // Add loading effect with dots animation
  let dots = '';
  const loadingInterval = setInterval(() => {
    dots = dots.length >= 3 ? '' : dots + '.';
    numberList.innerHTML = `<span style="opacity: 0.6;">Analyzing${dots}</span>`;
  }, 200);
  
  setTimeout(() => {
    clearInterval(loadingInterval);
    const shuffledNumbers = Shuffle(numbers[stepIndex]);
    
    // Enhanced number display with staggered animation
    numberList.innerHTML = '';
    shuffledNumbers.forEach((num, index) => {
      const span = document.createElement('span');
      span.textContent = num;
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = 'all 0.3s ease';
      span.style.display = 'inline-block';
      span.style.margin = '0 0.2em';
      
      numberList.appendChild(span);
      
      if (index < shuffledNumbers.length - 1) {
        const comma = document.createElement('span');
        comma.textContent = ', ';
        comma.style.opacity = '0.7';
        numberList.appendChild(comma);
      }
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, index * 100 + 200);
    });
  }, 800);
  
  showScreen(`step${stepIndex + 1}`);
}

// Enhanced game start with intro animation
function startGame() {
  playHapticFeedback('success', 'help');
  
  // Add button loading state
  const startButton = event.target;
  startButton.classList.add('loading');
  startButton.style.pointerEvents = 'none';
  
  // Enhanced fade out effect
  const mainPage = document.getElementById("mainpage");
  mainPage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  mainPage.style.opacity = '0';
  mainPage.style.transform = 'scale(0.9) translateY(-20px)';
  
  setTimeout(() => {
    showScreen('step1');
    displayStep(currentStep);
  }, 600);
}

// Enhanced answer handling with visual feedback
function handleAnswer(stepIndex, value) {
  soundManager.stop('help');
  
  yc[stepIndex] = value;
  currentStep++;
  
  // Enhanced button feedback
  const clickedButton = event.target;
  const isYes = value > 0;
  
  // Add success/neutral feedback
  clickedButton.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
  clickedButton.style.transform = 'scale(0.95)';
  
  // Add ripple effect
  const ripple = document.createElement('div');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255, 255, 255, 0.6)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.6s linear';
  ripple.style.left = '50%';
  ripple.style.top = '50%';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.marginLeft = '-10px';
  ripple.style.marginTop = '-10px';
  
  clickedButton.style.position = 'relative';
  clickedButton.appendChild(ripple);
  
  setTimeout(() => {
    clickedButton.style.transform = '';
    ripple.remove();
  }, 200);
  
  // Add CSS for ripple animation if not exists
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  if (currentStep < 4) {
    playHapticFeedback('click', 'click');
    
    setTimeout(() => {
      displayStep(currentStep);
    }, 400);
  } else {
    playHapticFeedback('success', 'click');
    
    setTimeout(() => {
      showResult();
    }, 400);
  }
}

// Enhanced result display with dramatic reveal
function showResult() {
  showScreen('loader');
  document.getElementById('loader').style.display = 'block';
  
  // Enhanced loading messages
  const loadingMessages = [
    "Reading your mind...",
    "Analyzing patterns...",
    "Calculating result...",
    "Almost there..."
  ];
  
  const loaderText = document.querySelector('.loader-content h3');
  let messageIndex = 0;
  
  const messageInterval = setInterval(() => {
    if (messageIndex < loadingMessages.length) {
      loaderText.style.opacity = '0';
      setTimeout(() => {
        loaderText.textContent = loadingMessages[messageIndex];
        loaderText.style.opacity = '1';
        messageIndex++;
      }, 200);
    }
  }, 600);
  
  setTimeout(() => {
    clearInterval(messageInterval);
    
    let result = yc.reduce((acc, curr) => acc + curr, 0);
    let { answer, sound } = results[result] || {
      answer: "UNKNOWN",
      sound: "unknown",
    };

    // Play result sound
    soundManager.play(sound);

    // Show result screen
    showScreen('result-screen');
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result-screen').classList.add('active');
    
    // Dramatic answer reveal
    const answerElement = document.getElementById("ans");
    answerElement.innerHTML = '';
    
    // Letter by letter reveal
    const letters = answer.split('');
    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.opacity = '0';
      span.style.transform = 'rotateY(90deg)';
      span.style.display = 'inline-block';
      span.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      answerElement.appendChild(span);
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'rotateY(0deg)';
      }, index * 100 + 500);
    });
    
    // Celebration effect
    playHapticFeedback('celebration', 'click');
    
    // Confetti effect (simple version)
    createConfetti();
    
    // Show restart button with delay
    setTimeout(() => {
      const restartBtn = document.getElementById("restart");
      restartBtn.style.opacity = '0';
      restartBtn.style.transform = 'translateY(30px) scale(0.9)';
      restartBtn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        restartBtn.style.opacity = '1';
        restartBtn.style.transform = 'translateY(0) scale(1)';
      }, 100);
    }, 1500);
    
  }, 2500);
}

// Simple confetti effect
function createConfetti() {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
  
  // Add confetti animation if not exists
  if (!document.querySelector('#confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Enhanced reset function
function reset() {
  playHapticFeedback('click', 'click');
  
  // Add loading effect
  showScreen('loader');
  document.getElementById('loader').style.display = 'block';
  
  // Update loading message
  const loaderText = document.querySelector('.loader-content h3');
  loaderText.textContent = 'Resetting game...';
  
  setTimeout(() => {
    // Reset all variables
    currentStep = 0;
    yc = [0, 0, 0, 0];
    
    // Smooth reload
    location.reload();
  }, 1000);
}

// Enhanced keyboard support
document.addEventListener('keydown', function(event) {
  const activeScreen = document.querySelector('.game-screen.active');
  if (!activeScreen) return;
  
  // Prevent default for handled keys
  const handledKeys = ['Enter', 'Space', 'y', 'n', 'Y', 'N'];
  if (handledKeys.includes(event.key)) {
    event.preventDefault();
  }
  
  // Handle Enter or Space on main page
  if (activeScreen.id === 'mainpage' && (event.key === 'Enter' || event.key === ' ')) {
    startGame();
    return;
  }
  
  // Handle Y/N keys on step screens
  if (activeScreen.classList.contains('step-screen')) {
    if (event.key.toLowerCase() === 'y') {
      const yesButton = activeScreen.querySelector('.btn-success');
      if (yesButton) {
        yesButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
          yesButton.style.transform = '';
          yesButton.click();
        }, 100);
      }
    } else if (event.key.toLowerCase() === 'n') {
      const noButton = activeScreen.querySelector('.btn-secondary');
      if (noButton) {
        noButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
          noButton.style.transform = '';
          noButton.click();
        }, 100);
      }
    }
  }
  
  // Handle Enter on result screen
  if (activeScreen.id === 'result-screen' && event.key === 'Enter') {
    reset();
  }
});

// Enhanced touch gesture support
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
  touchStartY = event.changedTouches[0].screenY;
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
  touchEndY = event.changedTouches[0].screenY;
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistanceY = touchStartY - touchEndY;
  const swipeDistanceX = touchStartX - touchEndX;
  
  // Swipe up to start game on main page
  if (swipeDistanceY > swipeThreshold && Math.abs(swipeDistanceX) < swipeThreshold) {
    const mainPage = document.getElementById('mainpage');
    if (mainPage && mainPage.classList.contains('active')) {
      startGame();
    }
  }
  
  // Swipe left for "Yes" on step screens
  if (swipeDistanceX > swipeThreshold && Math.abs(swipeDistanceY) < swipeThreshold) {
    const activeScreen = document.querySelector('.game-screen.active');
    if (activeScreen && activeScreen.classList.contains('step-screen')) {
      const yesButton = activeScreen.querySelector('.btn-success');
      if (yesButton) yesButton.click();
    }
  }
  
  // Swipe right for "No" on step screens
  if (swipeDistanceX < -swipeThreshold && Math.abs(swipeDistanceY) < swipeThreshold) {
    const activeScreen = document.querySelector('.game-screen.active');
    if (activeScreen && activeScreen.classList.contains('step-screen')) {
      const noButton = activeScreen.querySelector('.btn-secondary');
      if (noButton) noButton.click();
    }
  }
}

// Performance optimization: Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, observerOptions);

// Initialize the game with enhanced setup
document.addEventListener('DOMContentLoaded', function() {
  // Show the main page
  showScreen('mainpage');
  
  // Enhanced initial animations
  setTimeout(() => {
    const header = document.querySelector('.header');
    header.style.opacity = '1';
    header.style.transform = 'translateY(0)';
  }, 200);
  
  // Observe animated elements
  document.querySelectorAll('.orb, .game-screen').forEach(el => {
    observer.observe(el);
  });
  
  // Add loading indicator for sounds
  let soundsLoaded = 0;
  const totalSounds = soundFiles.length;
  
  soundFiles.forEach(soundName => {
    const audio = soundManager.sounds.get(soundName);
    if (audio) {
      audio.addEventListener('canplaythrough', () => {
        soundsLoaded++;
        if (soundsLoaded === totalSounds) {
          console.log('All sounds loaded successfully');
        }
      });
    }
  });
  
  // Add visual feedback for user interactions
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
      playHapticFeedback('click', 'click');
    }
  });
  
  console.log('🧠 MindReader Game Enhanced - Ready to read minds!');
  console.log('💡 Controls: Y/N keys, Enter to start/restart, Swipe gestures on mobile');
  console.log('🎵 Sound system initialized with', totalSounds, 'sounds');
});

// Add window focus/blur handling for better performance
window.addEventListener('blur', () => {
  soundManager.setVolume(0.2);
});

window.addEventListener('focus', () => {
  soundManager.setVolume(0.6);
});

// Error handling for audio context
window.addEventListener('click', function initAudio() {
  // This helps with browsers that require user interaction for audio
  soundManager.play('click');
  soundManager.stop('click');
  window.removeEventListener('click', initAudio);
}, { once: true });