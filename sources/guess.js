// Modern MindReader Game - Enhanced Performance & UX
// ═══════════════════════════════════════════════════════════════════════════════

// Game State Management
class GameState {
  constructor() {
    this.currentStep = 0;
    this.answers = [0, 0, 0, 0];
    this.isTransitioning = false;
    this.numbers = [];
    this.results = [];
    this.init();
  }

  init() {
    const [numbers, assignedSteps] = this.generateNumberGroups();
    this.numbers = numbers;
    this.results = assignedSteps.map((num, index) => this.numberToWord(num));
    console.log("🧠 Game initialized with numbers:", numbers);
    console.log("📊 Results mapping:", this.results);
  }

  generateNumberGroups() {
    const groups = [[], [], [], []];
    const assignedSteps = [];

    // Generate unique random numbers from 0 to 15
    while (assignedSteps.length < 16) {
      const rand = Math.floor(Math.random() * 16);
      if (!assignedSteps.includes(rand)) {
        assignedSteps.push(rand);
      }
    }

    for (let i = 0; i < assignedSteps.length; i++) {
      const stepValue = assignedSteps[i];
      const combo = this.getCombinationsForSum(i);

      combo.forEach((num) => {
        if (num === 4) num = 3;
        if (num === 8) num = 4;
        if (num >= 1 && num <= 4) {
          groups[num - 1].push(stepValue);
        }
      });
    }

    return [groups, assignedSteps];
  }

  getCombinationsForSum(targetSum) {
    const candidates = [1, 2, 4, 8];
    const validCombinations = [];

    const backtrack = (startIndex, currentCombo, currentSum) => {
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
    };

    backtrack(0, [], 0);
    const randomIndex = Math.floor(Math.random() * validCombinations.length);
    return validCombinations[randomIndex] || [];
  }

  numberToWord(number) {
    const words = [
      "ZERO",
      "ONE",
      "TWO",
      "THREE",
      "FOUR",
      "FIVE",
      "SIX",
      "SEVEN",
      "EIGHT",
      "NINE",
      "TEN",
      "ELEVEN",
      "TWELVE",
      "THIRTEEN",
      "FOURTEEN",
      "FIFTEEN",
    ];

    return {
      answer: words[number] || "UNKNOWN",
      sound: words[number]?.toLowerCase() || "unknown",
    };
  }

  reset() {
    this.currentStep = 0;
    this.answers = [0, 0, 0, 0];
    this.isTransitioning = false;
    this.init();
  }

  getResult() {
    const result = this.answers.reduce((acc, curr) => acc + curr, 0);
    return this.results[result] || { answer: "UNKNOWN", sound: "unknown" };
  }
}

// Enhanced Sound Manager with Performance Optimization
class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.volume = 0.6;
    this.enabled = true;
    this.audioContext = null;
    this.loadedSounds = 0;
    this.totalSounds = 0;
    this.preloadSounds();
  }

  async preloadSounds() {
    const soundFiles = [
      "click",
      "help",
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
    ];

    this.totalSounds = soundFiles.length;

    soundFiles.forEach((sound) => {
      const audio = new Audio(`sounds/${sound}.mp3`);
      audio.volume = this.volume;
      audio.preload = "auto";

      audio.addEventListener(
        "canplaythrough",
        () => {
          this.loadedSounds++;
          if (this.loadedSounds === this.totalSounds) {
            console.log("🎵 All sounds loaded successfully");
          }
        },
        { once: true }
      );

      audio.addEventListener("error", () => {
        console.warn(`⚠️ Failed to load sound: ${sound}`);
      });

      this.sounds.set(sound, audio);
    });
  }

  play(soundName, volume = this.volume) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound && sound.readyState >= 2) {
      try {
        sound.currentTime = 0;
        sound.volume = Math.min(volume, this.volume);
        sound
          .play()
          .catch((e) => console.log(`Sound play failed for ${soundName}:`, e));
      } catch (error) {
        console.warn(`Error playing sound ${soundName}:`, error);
      }
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
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Enhanced Haptic Feedback System
class HapticManager {
  constructor() {
    this.patterns = {
      click: [50],
      success: [100, 50, 100],
      celebration: [200, 100, 200, 100, 200],
      error: [300, 100, 300],
      subtle: [30],
      strong: [150],
    };
    this.enabled = "vibrate" in navigator;
  }

  vibrate(pattern = "click") {
    if (!this.enabled || !this.patterns[pattern]) return;

    try {
      navigator.vibrate(this.patterns[pattern]);
    } catch (error) {
      console.warn("Vibration failed:", error);
    }
  }
}

// Enhanced Animation Manager
class AnimationManager {
  constructor() {
    this.activeAnimations = new Set();
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  animate(element, keyframes, options = {}) {
    if (this.reducedMotion) {
      options.duration = 1;
    }

    const animation = element.animate(keyframes, {
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
      ...options,
    });

    this.activeAnimations.add(animation);

    animation.addEventListener("finish", () => {
      this.activeAnimations.delete(animation);
    });

    return animation;
  }

  cancelAll() {
    this.activeAnimations.forEach((animation) => animation.cancel());
    this.activeAnimations.clear();
  }
}

// Enhanced Screen Manager with Smooth Transitions
class ScreenManager {
  constructor() {
    this.currentScreen = null;
    this.isTransitioning = false;
  }

  async showScreen(screenId, direction = "forward") {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    const targetScreen = document.getElementById(screenId);

    if (!targetScreen) {
      this.isTransitioning = false;
      return;
    }

    // Hide current screen
    if (this.currentScreen && this.currentScreen !== targetScreen) {
      await this.hideScreen(this.currentScreen, direction);
    }

    // Show target screen
    await this.displayScreen(targetScreen, direction);

    this.currentScreen = targetScreen;
    this.isTransitioning = false;
  }

  async hideScreen(screen, direction) {
    const translateX = direction === "forward" ? "-30px" : "30px";

    return new Promise((resolve) => {
      screen.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      screen.style.opacity = "0";
      screen.style.transform = `translateX(${translateX}) scale(0.95)`;

      setTimeout(() => {
        screen.classList.remove("active");
        screen.style.display = "none";
        resolve();
      }, 400);
    });
  }

  async displayScreen(screen, direction) {
    const translateX = direction === "forward" ? "30px" : "-30px";

    return new Promise((resolve) => {
      screen.style.display = "block";
      screen.style.opacity = "0";
      screen.style.transform = `translateX(${translateX}) scale(0.95)`;

      requestAnimationFrame(() => {
        screen.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        screen.style.opacity = "1";
        screen.style.transform = "translateX(0) scale(1)";
        screen.classList.add("active");

        setTimeout(resolve, 500);
      });
    });
  }
}

// Enhanced Confetti System
class ConfettiManager {
  constructor() {
    this.colors = ["#0ea5e9", "#22c55e", "#f59e0b", "#d946ef", "#ef4444"];
    this.isActive = false;
  }

  create() {
    if (this.isActive) return;

    this.isActive = true;
    const confettiCount = 60;
    const container = document.createElement("div");
    container.className = "confetti-container";
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    `;

    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
      this.createConfettiPiece(container, i);
    }

    setTimeout(() => {
      container.remove();
      this.isActive = false;
    }, 4000);
  }

  createConfettiPiece(container, index) {
    const confetti = document.createElement("div");
    const size = Math.random() * 8 + 4;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const startX = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    const delay = index * 20;

    confetti.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${startX}vw;
      top: -10px;
      border-radius: 50%;
      animation: confetti-fall ${duration}s linear ${delay}ms forwards;
    `;

    container.appendChild(confetti);
  }
}

// Initialize managers
const gameState = new GameState();
const soundManager = new SoundManager();
const hapticManager = new HapticManager();
const animationManager = new AnimationManager();
const screenManager = new ScreenManager();
const confettiManager = new ConfettiManager();

// Enhanced utility functions
function playFeedback(pattern = "click", sound = "click") {
  hapticManager.vibrate(pattern);
  soundManager.play(sound);
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Enhanced step display with loading animation
async function displayStep(stepIndex) {
  const stepDiv = document.getElementById(`step${stepIndex + 1}`);
  const numberList = stepDiv.querySelector(".number-list");

  // Loading animation
  let dots = "";
  const loadingInterval = setInterval(() => {
    dots = dots.length >= 3 ? "" : dots + ".";
    numberList.innerHTML = `<span style="opacity: 0.6;">Analyzing${dots}</span>`;
  }, 300);

  await screenManager.showScreen(`step${stepIndex + 1}`);

  setTimeout(() => {
    clearInterval(loadingInterval);
    const shuffledNumbers = shuffleArray(gameState.numbers[stepIndex]);

    // Enhanced number display with staggered animation
    numberList.innerHTML = "";
    shuffledNumbers.forEach((num, index) => {
      const span = document.createElement("span");
      span.textContent = num;
      span.style.cssText = `
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-block;
        margin: 0 0.3em;
      `;

      numberList.appendChild(span);

      if (index < shuffledNumbers.length - 1) {
        const comma = document.createElement("span");
        comma.textContent = ", ";
        comma.style.opacity = "0.7";
        numberList.appendChild(comma);
      }

      setTimeout(() => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      }, index * 100 + 300);
    });
  }, 500);
}

// Enhanced game start function
async function startGame() {
  if (gameState.isTransitioning) return;

  playFeedback("success", "help");
  gameState.isTransitioning = true;

  // Add button loading state
  const startButton = event.target;
  startButton.classList.add("loading");
  startButton.style.pointerEvents = "none";

  try {
    await displayStep(gameState.currentStep);
  } finally {
    gameState.isTransitioning = false;
  }
}

// Enhanced answer handling with visual feedback
async function handleAnswer(stepIndex, value) {
  if (gameState.isTransitioning) return;

  gameState.isTransitioning = true;
  soundManager.stop("help");

  gameState.answers[stepIndex] = value;
  gameState.currentStep++;

  // Enhanced button feedback
  const clickedButton = event.target;
  const isYes = value > 0;

  // Add ripple effect
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(98, 90, 163, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    margin-top: -10px;
    pointer-events: none;
  `;

  clickedButton.style.position = "relative";
  clickedButton.appendChild(ripple);

  // Button press animation
  animationManager.animate(
    clickedButton,
    [
      { transform: "scale(1)" },
      { transform: "scale(0.95)" },
      { transform: "scale(1)" },
    ],
    { duration: 200 }
  );

  setTimeout(() => ripple.remove(), 600);

  try {
    if (gameState.currentStep < 4) {
      playFeedback("click", "click");
      await new Promise((resolve) => setTimeout(resolve, 400));
      await displayStep(gameState.currentStep);
    } else {
      playFeedback("success", "click");
      await new Promise((resolve) => setTimeout(resolve, 400));
      await showResult();
    }
  } finally {
    gameState.isTransitioning = false;
  }
}

// Enhanced result display with dramatic reveal
async function showResult() {
  await screenManager.showScreen("loader");

  // Enhanced loading messages
  const loadingMessages = [
    "Reading your mind...",
    "Analyzing patterns...",
    "Calculating result...",
    "Almost there...",
  ];

  const loaderTitle = document.querySelector(".loading-title");
  let messageIndex = 0;

  const messageInterval = setInterval(() => {
    if (messageIndex < loadingMessages.length) {
      loaderTitle.style.opacity = "0";
      setTimeout(() => {
        loaderTitle.textContent = loadingMessages[messageIndex];
        loaderTitle.style.opacity = "1";
        messageIndex++;
      }, 200);
    }
  }, 700);

  setTimeout(async () => {
    clearInterval(messageInterval);

    const { answer, sound } = gameState.getResult();

    // Play result sound
    soundManager.play(sound);

    // Show result screen
    await screenManager.showScreen("result-screen");

    // Dramatic answer reveal
    const answerElement = document.getElementById("ans");
    answerElement.innerHTML = "";

    // Letter by letter reveal
    const letters = answer.split("");
    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.cssText = `
        opacity: 0;
       
        display: inline-block;
       
      `;
      answerElement.appendChild(span);

      setTimeout(() => {
        span.style.opacity = "1";
      }, index * 100 + 500);
    });

    // Celebration effects
    playFeedback("celebration", "click");
    confettiManager.create();

    // Show restart button with delay
    setTimeout(() => {
      const restartBtn = document.getElementById("restart");
      animationManager.animate(
        restartBtn,
        [
          { opacity: 0, transform: "translateY(30px) scale(0.9)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 500 }
      );
    }, 1500);
  }, 3000);
}

// Enhanced reset function
async function reset() {
  if (gameState.isTransitioning) return;

  playFeedback("click", "click");
  gameState.isTransitioning = true;

  await screenManager.showScreen("loader");

  const loaderTitle = document.querySelector(".loading-title");
  loaderTitle.textContent = "Resetting game...";

  setTimeout(() => {
    gameState.reset();
    location.reload();
  }, 1000);
}

// Enhanced keyboard support
document.addEventListener("keydown", function (event) {
  if (gameState.isTransitioning) return;

  const activeScreen = document.querySelector(".screen.active");
  if (!activeScreen) return;

  const handledKeys = ["Enter", " ", "y", "n", "Y", "N"];
  if (handledKeys.includes(event.key)) {
    event.preventDefault();
  }

  // Handle Enter or Space on main page
  if (
    activeScreen.id === "mainpage" &&
    (event.key === "Enter" || event.key === " ")
  ) {
    startGame();
    return;
  }

  // Handle Y/N keys on step screens
  if (activeScreen.classList.contains("step-screen")) {
    if (event.key.toLowerCase() === "y") {
      const yesButton = activeScreen.querySelector(".primary-btn");
      if (yesButton) {
        animationManager.animate(
          yesButton,
          [{ transform: "scale(1)" }, { transform: "scale(0.95)" }],
          { duration: 100 }
        );
        setTimeout(() => yesButton.click(), 100);
      }
    } else if (event.key.toLowerCase() === "n") {
      const noButton = activeScreen.querySelector(".secondary-btn");
      if (noButton) {
        animationManager.animate(
          noButton,
          [{ transform: "scale(1)" }, { transform: "scale(0.95)" }],
          { duration: 100 }
        );
        setTimeout(() => noButton.click(), 100);
      }
    }
  }

  // Handle Enter on result screen
  if (activeScreen.id === "result-screen" && event.key === "Enter") {
    reset();
  }
});

// Enhanced touch gesture support
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
  "touchstart",
  function (event) {
    touchStartY = event.changedTouches[0].screenY;
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  function (event) {
    touchEndY = event.changedTouches[0].screenY;
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  if (gameState.isTransitioning) return;

  const swipeThreshold = 50;
  const swipeDistanceY = touchStartY - touchEndY;
  const swipeDistanceX = touchStartX - touchEndX;

  // Swipe up to start game on main page
  if (
    swipeDistanceY > swipeThreshold &&
    Math.abs(swipeDistanceX) < swipeThreshold
  ) {
    const mainPage = document.getElementById("mainpage");
    if (mainPage && mainPage.classList.contains("active")) {
      startGame();
    }
  }

  // Swipe left for "Yes" on step screens
  if (
    swipeDistanceX > swipeThreshold &&
    Math.abs(swipeDistanceY) < swipeThreshold
  ) {
    const activeScreen = document.querySelector(".screen.active");
    if (activeScreen && activeScreen.classList.contains("step-screen")) {
      const yesButton = activeScreen.querySelector(".primary-btn");
      if (yesButton) yesButton.click();
    }
  }

  // Swipe right for "No" on step screens
  if (
    swipeDistanceX < -swipeThreshold &&
    Math.abs(swipeDistanceY) < swipeThreshold
  ) {
    const activeScreen = document.querySelector(".screen.active");
    if (activeScreen && activeScreen.classList.contains("step-screen")) {
      const noButton = activeScreen.querySelector(".secondary-btn");
      if (noButton) noButton.click();
    }
  }
}

// Performance optimization: Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

// Add CSS for confetti animation
const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(-10px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(confettiStyle);

// Initialize the game
document.addEventListener("DOMContentLoaded", function () {
  // Show the main page
  screenManager.showScreen("mainpage");

  // Enhanced initial animations
  setTimeout(() => {
    const header = document.querySelector(".app-header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }
  }, 200);

  // Observe animated elements
  document.querySelectorAll(".gradient-orb, .screen").forEach((el) => {
    observer.observe(el);
  });

  // Add visual feedback for user interactions
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("primary-btn") ||
      e.target.classList.contains("secondary-btn")
    ) {
      playFeedback("click", "click");
    }
  });

  console.log("🧠 MindReader Game Enhanced - Ready to read minds!");
  console.log(
    "💡 Controls: Y/N keys, Enter to start/restart, Swipe gestures on mobile"
  );
  console.log("🎵 Sound system initialized");
  console.log("⚡ Performance optimizations active");
});

// Window focus/blur handling for better performance
window.addEventListener("blur", () => {
  soundManager.setVolume(0.2);
});

window.addEventListener("focus", () => {
  soundManager.setVolume(0.6);
});

// Error handling for audio context
window.addEventListener(
  "click",
  function initAudio() {
    soundManager.play("click");
    soundManager.stop("click");
    window.removeEventListener("click", initAudio);
  },
  { once: true }
);

// Performance monitoring
if (typeof performance !== "undefined" && performance.mark) {
  performance.mark("mindreader-init-complete");
}
