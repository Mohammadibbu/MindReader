let currentStep = 0;
let yc = [0, 0, 0, 0]; // Stores the values for each step

// Generates all combinations of [1,2,3,4] that sum to a target
function getCombinationsForSum(targetSum) {
  // const candidates = [1, 2, 3, 4];
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

  // Generate unique random numbers from 0 to 10
  while (assignedSteps.length < 16) {
    const rand = Math.floor(Math.random() * 16);
    if (!assignedSteps.includes(rand)) {
      assignedSteps.push(rand);
    }
  }

  // console.log("Random Step Assignments:", assignedSteps);

  for (let i = 0; i <= assignedSteps.length; i++) {
    const stepValue = assignedSteps[i];
    const combo = getCombinationsForSum(i);

    // console.log(
    //   `Step ${i} → Assigned Value: ${stepValue}, Chosen Combo:`,
    //   combo
    // );

    // Distribute the assigned value to groups based on the combo
    combo.forEach((num) => {
      if (num === 4) {
        num = 3; // Adjusting 6 to 4 for the group assignment
      }
      if (num === 8) {
        num = 4; // Adjusting 3 to 2 for the group assignment
      }
      if (num >= 1 && num <= 4) {
        groups[num - 1].push(stepValue);
      }
    });
  }

  console.log("Final Group Assignments (1 to 4):", groups);

  return [groups, assignedSteps];
}

const [numbers, assignedSteps] = assignStepsToGroups(); // Call the main function
// console.log("Generated Numbers for Steps:", numbers);
// console.log("Assigned Steps:", assignedSteps);

function numberToWordObject(number) {
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
    answer: `'${words[number] || "Invalid"}'`,
    sound: `sounds/${words[number]?.toLowerCase() || "unknown"}.mp3`,
  };
}

// Sound and answer mapping
const results = assignedSteps.map((acc, index) => {
  return numberToWordObject(acc);
});

console.log("Results Mapping:", results);

const AudioHelper = new Audio("sounds/help.mp3");
// Function to play vibration and sound (click or other feedback sounds)
function playVibrationAndClick(
  vibrationPattern = [50],
  soundFile = "sounds/click.mp3"
) {
  navigator.vibrate(vibrationPattern);
  new Audio(soundFile).play();
}

// shuffle the numbers array to randomize the order
function Shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// Function to display the current step
function displayStep(stepIndex) {
  const stepDiv = document.getElementById(`step${stepIndex + 1}`);
  const numberList = stepDiv.querySelector(".number-list");
  numberList.innerHTML = Shuffle(numbers[stepIndex]).join(", ");
  stepDiv.style.display = "block";
  if (stepIndex > 0) hideStep(`step${stepIndex}`);
}

// Show and hide steps
function showStep(stepId) {
  document.getElementById(stepId).style.display = "block";
}

function hideStep(stepId) {
  document.getElementById(stepId).style.display = "none";
}

// Start the game
function startGame() {
  AudioHelper.play();

  playVibrationAndClick([50], "sounds/click.mp3");
  document.getElementById("mainpage").style.display = "none";
  displayStep(currentStep);
}

// Handle Yes/No answers
function handleAnswer(stepIndex, value) {
  AudioHelper.pause();
  AudioHelper.currentTime = 0; // Reset audio to start
  yc[stepIndex] = value;
  currentStep++;
  if (currentStep < 4) {
    playVibrationAndClick([50], "sounds/click.mp3");
    hideStep(`step${stepIndex + 1}`);
    displayStep(currentStep);
  } else {
    playVibrationAndClick([50], "sounds/click.mp3");
    hideStep(`step${stepIndex + 1}`);
    showResult();
  }
}

// Show the final result based on the calculated value
function showResult() {
  let result = yc.reduce((acc, curr) => acc + curr, 0);
  let { answer, sound } = results[result] || {
    answer: "'UNKNOWN'",
    sound: "sounds/unknown.mp3",
  };

  new Audio(sound).play();
  document.getElementById(
    "ans"
  ).innerHTML = `The Number You Thought of Was: <i>${answer}</i>`;
  document.getElementById("restart").style.display = "block";
}

// Restart the game
function reset() {
  playVibrationAndClick([50], "sounds/click.mp3");
  document.getElementById("loader").style.display = "block";
  hideStep("ans");
  hideStep("restart");
  setTimeout(() => {
    location.reload();
  }, 500);
}

// Check if the user is online
function on() {
  showStep("center");
  showStep("online");
  hideStep("offline");
  playVibrationAndClick([50, 100, 200]);
  setTimeout(() => hideStep("online"), 3000);
}

// Handle offline scenario
function of() {
  playVibrationAndClick([50, 200, 200, 200]);
  hideStep("center");
  showStep("offline");
}

// Feedback function to open email
function feedback() {
  if (confirm("Opening Gmail or Email")) {
    document.getElementById("fb").href = "mailto:mohammmadibbu008@gmail.com";
    playVibrationAndClick([50, 100, 50]);
    setTimeout(() => (document.getElementById("fb").href = "#"), 2000);
  } else {
    document.getElementById("fb").href = "#";
    navigator.vibrate([100]);
  }
}
