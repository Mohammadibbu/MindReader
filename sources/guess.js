let currentStep = 0;
let yc = [0, 0, 0, 0]; // Stores the values for each step

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

  // Randomly return one of the valid combinations, or empty array if none
  const randomIndex = Math.floor(Math.random() * validCombinations.length);
  return validCombinations[randomIndex] || [];
}

// Main assignment generator
function assignStepsToGroups() {
  const groups = [[], [], [], []]; // Each sub-array represents a group for numbers 1 to 4
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

    // Distribute the assigned value to groups based on the combo
    combo.forEach((num) => {
      if (num === 4) {
        num = 3; // Adjusting for group assignment
      }
      if (num === 8) {
        num = 4; // Adjusting for group assignment
      }
      if (num >= 1 && num <= 4) {
        groups[num - 1].push(stepValue);
      }
    });
  }

  console.log("Final Group Assignments (1 to 4):", groups);
  return [groups, assignedSteps];
}

const [numbers, assignedSteps] = assignStepsToGroups();

function numberToWordObject(number) {
  const words = [
    "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN",
    "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN"
  ];

  return {
    answer: `${words[number] || "Invalid"}`,
    sound: `sounds/${words[number]?.toLowerCase() || "unknown"}.mp3`,
  };
}

// Sound and answer mapping
const results = assignedSteps.map((acc, index) => {
  return numberToWordObject(acc);
});

console.log("Results Mapping:", results);

const AudioHelper = new Audio("sounds/help.mp3");

// Enhanced vibration and sound function
function playVibrationAndClick(vibrationPattern = [50], soundFile = "sounds/click.mp3") {
  // Check if vibration is supported
  if (navigator.vibrate) {
    navigator.vibrate(vibrationPattern);
  }
  
  // Play sound with error handling
  try {
    const audio = new Audio(soundFile);
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (e) {
    console.log('Audio creation failed:', e);
  }
}

// Enhanced shuffle function
function Shuffle(arr) {
  const shuffled = [...arr]; // Create a copy to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Enhanced screen management
function showScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.game-screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
    screen.style.display = 'none';
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.style.display = 'block';
    // Add a small delay for smooth transition
    setTimeout(() => {
      targetScreen.classList.add('active');
    }, 50);
  }
}

// Enhanced step display
function displayStep(stepIndex) {
  const stepDiv = document.getElementById(`step${stepIndex + 1}`);
  const numberList = stepDiv.querySelector(".number-list");
  
  // Add loading effect
  numberList.innerHTML = "Loading...";
  
  setTimeout(() => {
    const shuffledNumbers = Shuffle(numbers[stepIndex]);
    numberList.innerHTML = shuffledNumbers.join(", ");
    
    // Add entrance animation
    numberList.style.opacity = '0';
    numberList.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      numberList.style.transition = 'all 0.5s ease';
      numberList.style.opacity = '1';
      numberList.style.transform = 'translateY(0)';
    }, 100);
  }, 300);
  
  showScreen(`step${stepIndex + 1}`);
}

// Enhanced game start
function startGame() {
  try {
    AudioHelper.play().catch(e => console.log('Audio play failed:', e));
  } catch (e) {
    console.log('Audio error:', e);
  }

  playVibrationAndClick([100, 50, 100], "sounds/click.mp3");
  
  // Add fade out effect to main page
  const mainPage = document.getElementById("mainpage");
  mainPage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  mainPage.style.opacity = '0';
  mainPage.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    showScreen('step1');
    displayStep(currentStep);
  }, 500);
}

// Enhanced answer handling
function handleAnswer(stepIndex, value) {
  try {
    AudioHelper.pause();
    AudioHelper.currentTime = 0;
  } catch (e) {
    console.log('Audio control failed:', e);
  }
  
  yc[stepIndex] = value;
  currentStep++;
  
  // Add button click feedback
  const clickedButton = event.target;
  clickedButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    clickedButton.style.transform = '';
  }, 150);
  
  if (currentStep < 4) {
    playVibrationAndClick([50], "sounds/click.mp3");
    
    // Add transition delay for better UX
    setTimeout(() => {
      displayStep(currentStep);
    }, 300);
  } else {
    playVibrationAndClick([100, 50, 100], "sounds/click.mp3");
    
    setTimeout(() => {
      showResult();
    }, 300);
  }
}

// Enhanced result display
function showResult() {
  // Show loading screen first
  showScreen('loader');
  document.getElementById('loader').style.display = 'block';
  
  setTimeout(() => {
    let result = yc.reduce((acc, curr) => acc + curr, 0);
    let { answer, sound } = results[result] || {
      answer: "UNKNOWN",
      sound: "sounds/unknown.mp3",
    };

    // Play result sound
    try {
      new Audio(sound).play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
      console.log('Audio creation failed:', e);
    }

    // Show result screen
    showScreen('result-screen');
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result-screen').classList.add('active');
    
    // Animate the answer reveal
    const answerElement = document.getElementById("ans");
    answerElement.innerHTML = answer;
    
    // Add celebration effect
    playVibrationAndClick([200, 100, 200, 100, 200], "sounds/click.mp3");
    
    // Show restart button with delay
    setTimeout(() => {
      document.getElementById("restart").style.opacity = '0';
      document.getElementById("restart").style.transform = 'translateY(20px)';
      document.getElementById("restart").style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        document.getElementById("restart").style.opacity = '1';
        document.getElementById("restart").style.transform = 'translateY(0)';
      }, 100);
    }, 1000);
    
  }, 2000); // 2 second loading time for dramatic effect
}

// Enhanced reset function
function reset() {
  playVibrationAndClick([100], "sounds/click.mp3");
  
  // Add loading effect
  showScreen('loader');
  document.getElementById('loader').style.display = 'block';
  
  setTimeout(() => {
    // Reset all variables
    currentStep = 0;
    yc = [0, 0, 0, 0];
    
    // Reload the page for a fresh start
    location.reload();
  }, 1000);
}

// Enhanced feedback function
function feedback() {
  if (confirm("Opening Gmail or Email")) {
    const emailLink = document.createElement('a');
    emailLink.href = "mailto:mohammmadibbu008@gmail.com?subject=MindReader Game Feedback";
    emailLink.click();
    playVibrationAndClick([50, 100, 50]);
  } else {
    navigator.vibrate && navigator.vibrate([100]);
  }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
  const activeScreen = document.querySelector('.game-screen.active');
  if (!activeScreen) return;
  
  // Handle Enter key on main page
  if (activeScreen.id === 'mainpage' && event.key === 'Enter') {
    startGame();
    return;
  }
  
  // Handle Y/N keys on step screens
  if (activeScreen.classList.contains('step-screen')) {
    if (event.key.toLowerCase() === 'y') {
      const yesButton = activeScreen.querySelector('.btn-success');
      if (yesButton) yesButton.click();
    } else if (event.key.toLowerCase() === 'n') {
      const noButton = activeScreen.querySelector('.btn-secondary');
      if (noButton) noButton.click();
    }
  }
  
  // Handle Enter key on result screen
  if (activeScreen.id === 'result-screen' && event.key === 'Enter') {
    reset();
  }
});

// Add touch gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
  touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
  touchEndY = event.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchStartY - touchEndY;
  
  // Swipe up to start game on main page
  if (swipeDistance > swipeThreshold) {
    const mainPage = document.getElementById('mainpage');
    if (mainPage && mainPage.classList.contains('active')) {
      startGame();
    }
  }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  // Show the main page
  showScreen('mainpage');
  
  // Add some initial animations
  setTimeout(() => {
    document.querySelector('.header').style.opacity = '1';
    document.querySelector('.header').style.transform = 'translateY(0)';
  }, 100);
  
  console.log('MindReader Game Initialized');
  console.log('Use Y/N keys for quick answers, Enter to start/restart');
});