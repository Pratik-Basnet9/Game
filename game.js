// ==========================================
// THINKIX - SPOT THE CYBER THREAT
// ==========================================

// ---------- GAME EVENTS ----------

const events = [
  {
    icon: "🌡️",
    text: "A registered temperature sensor sends normal readings to the approved MQTT broker.",
    answer: "safe",
    explanation:
      "This is normal communication from a registered sensor to an approved service.",
  },
  {
    icon: "🚨",
    text: "An unknown device attempts to connect directly to the PLC VLAN.",
    answer: "threat",
    explanation:
      "Unknown devices should not be allowed to access the protected PLC network.",
  },
  {
    icon: "⚙️",
    text: "A registered PLC communicates with devices inside its assigned VLAN.",
    answer: "safe",
    explanation:
      "The PLC is registered and communicating inside its authorised network segment.",
  },
  {
    icon: "🔐",
    text: "The management system receives multiple failed login attempts from an unknown source.",
    answer: "threat",
    explanation:
      "Repeated failed logins may indicate an attempted unauthorised access or brute-force attack.",
  },
  {
    icon: "📡",
    text: "A registered sensor publishes approved production data to the Mosquitto MQTT broker.",
    answer: "safe",
    explanation:
      "This is expected MQTT communication from an authorised industrial device.",
  },
  {
    icon: "👁️",
    text: "Suricata detects unusual traffic scanning several industrial devices.",
    answer: "threat",
    explanation:
      "Network scanning can indicate reconnaissance or preparation for an attack.",
  },
  {
    icon: "🛡️",
    text: "pfSense allows an approved management connection according to an existing firewall rule.",
    answer: "safe",
    explanation: "The connection matches an authorised firewall rule.",
  },
  {
    icon: "🔀",
    text: "A device in the sensor VLAN suddenly attempts to access restricted PLC services.",
    answer: "threat",
    explanation:
      "Unexpected communication between protected VLANs may indicate compromise or incorrect configuration.",
  },
  {
    icon: "💻",
    text: "An authorised administrator registers a new IoT sensor through the ThinkiX management system.",
    answer: "safe",
    explanation:
      "Registering approved devices through the management system is expected activity.",
  },
  {
    icon: "📡",
    text: "An unregistered device begins publishing MQTT messages to the industrial broker.",
    answer: "threat",
    explanation:
      "Unregistered devices should not be trusted to publish industrial MQTT data.",
  },
  {
    icon: "🔒",
    text: "A registered IoT device communicates using its approved security configuration.",
    answer: "safe",
    explanation:
      "The device is registered and following the approved security configuration.",
  },
  {
    icon: "⚠️",
    text: "A PLC suddenly generates a large amount of unusual network traffic.",
    answer: "threat",
    explanation:
      "Unexpected traffic from a PLC may indicate compromise, malfunction or unauthorised activity.",
  },
  {
    icon: "📊",
    text: "The monitoring system records normal network traffic for analysis.",
    answer: "safe",
    explanation:
      "Network monitoring is an expected part of the ThinkiX security architecture.",
  },
  {
    icon: "🌐",
    text: "An industrial sensor attempts to make an unexpected direct connection to the Internet.",
    answer: "threat",
    explanation:
      "Industrial sensors should not make unexpected direct Internet connections.",
  },
  {
    icon: "🛡️",
    text: "pfSense blocks an unauthorised connection attempting to enter the industrial network.",
    answer: "safe",
    explanation: "The firewall is correctly protecting the industrial network.",
  },
  {
    icon: "👤",
    text: "An unknown user attempts to change the VLAN assigned to a registered PLC.",
    answer: "threat",
    explanation:
      "Unauthorised configuration changes can compromise network segmentation.",
  },
  {
    icon: "📋",
    text: "ThinkiX records a newly approved device in the registration history.",
    answer: "safe",
    explanation:
      "Maintaining device-registration records is normal management activity.",
  },
  {
    icon: "🔓",
    text: "A device starts sending sensitive industrial data using an unexpected insecure connection.",
    answer: "threat",
    explanation:
      "Unexpected insecure communication can expose industrial information.",
  },
];

// ==========================================
// ELEMENTS
// ==========================================

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const safeBtn = document.getElementById("safeBtn");
const threatBtn = document.getElementById("threatBtn");

const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");

const eventIcon = document.getElementById("eventIcon");
const eventText = document.getElementById("eventText");

const feedback = document.getElementById("feedback");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackText = document.getElementById("feedbackText");

const eventCountElement = document.getElementById("eventCount");
const accuracyElement = document.getElementById("accuracy");
const progressFill = document.getElementById("progressFill");

// ==========================================
// GAME VARIABLES
// ==========================================

let gameEvents = [];

let currentEvent = 0;

let score = 0;

let correctAnswers = 0;

let answeredEvents = 0;

let streak = 0;

let bestStreak = 0;

let timeLeft = 45;

let timerInterval = null;

let gameRunning = false;

let waitingForNextEvent = false;

// ==========================================
// SHUFFLE EVENTS
// ==========================================

function shuffleEvents(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// ==========================================
// CHANGE SCREEN
// ==========================================

function showScreen(screen) {
  startScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  screen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ==========================================
// START GAME
// ==========================================

function startGame() {
  clearInterval(timerInterval);

  gameEvents = shuffleEvents(events);

  currentEvent = 0;

  score = 0;

  correctAnswers = 0;

  answeredEvents = 0;

  streak = 0;

  bestStreak = 0;

  timeLeft = 45;

  gameRunning = true;

  waitingForNextEvent = false;

  updateStats();

  feedback.className = "feedback";

  safeBtn.disabled = false;
  threatBtn.disabled = false;

  showScreen(gameScreen);

  showEvent();

  timerInterval = setInterval(() => {
    timeLeft--;

    timerElement.textContent = timeLeft;

    // Timer warning

    if (timeLeft <= 10) {
      timerElement.style.color = "#ff435d";
    } else {
      timerElement.style.color = "";
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ==========================================
// SHOW EVENT
// ==========================================

function showEvent() {
  if (!gameRunning) {
    return;
  }

  // If all events are completed, reshuffle
  // so the player can continue until timer ends.

  if (currentEvent >= gameEvents.length) {
    gameEvents = shuffleEvents(events);

    currentEvent = 0;
  }

  const event = gameEvents[currentEvent];

  eventIcon.textContent = event.icon;

  eventText.textContent = event.text;

  feedback.className = "feedback";

  safeBtn.disabled = false;
  threatBtn.disabled = false;

  waitingForNextEvent = false;
}

// ==========================================
// ANSWER EVENT
// ==========================================

function answerEvent(choice) {
  if (!gameRunning || waitingForNextEvent) {
    return;
  }

  waitingForNextEvent = true;

  safeBtn.disabled = true;
  threatBtn.disabled = true;

  const event = gameEvents[currentEvent];

  answeredEvents++;

  const isCorrect = choice === event.answer;

  // CORRECT ANSWER

  if (isCorrect) {
    correctAnswers++;

    streak++;

    if (streak > bestStreak) {
      bestStreak = streak;
    }

    // Score increases with streak

    const streakBonus = Math.min(streak * 10, 50);

    const points = 100 + streakBonus;

    score += points;

    feedback.className = "feedback show correct";

    feedbackTitle.textContent = `✓ CORRECT! +${points} POINTS`;

    feedbackText.textContent = event.explanation;
  }

  // WRONG ANSWER
  else {
    streak = 0;

    score = Math.max(0, score - 25);

    feedback.className = "feedback show wrong";

    feedbackTitle.textContent = "✕ WRONG DECISION";

    feedbackText.textContent = event.explanation;
  }

  updateStats();

  currentEvent++;

  // Automatically move to next event

  setTimeout(() => {
    if (gameRunning) {
      showEvent();
    }
  }, 1200);
}

// ==========================================
// UPDATE STATS
// ==========================================

function updateStats() {
  scoreElement.textContent = score;

  streakElement.textContent = `${streak} 🔥`;

  eventCountElement.textContent = answeredEvents;

  let accuracy = 0;

  if (answeredEvents > 0) {
    accuracy = Math.round((correctAnswers / answeredEvents) * 100);
  }

  accuracyElement.textContent = accuracy + "%";

  // Progress increases with correct answers

  const progress = Math.min((correctAnswers / 10) * 100, 100);

  progressFill.style.width = progress + "%";
}

// ==========================================
// END GAME
// ==========================================

function endGame() {
  if (!gameRunning) {
    return;
  }

  gameRunning = false;

  clearInterval(timerInterval);

  safeBtn.disabled = true;
  threatBtn.disabled = true;

  let accuracy = 0;

  if (answeredEvents > 0) {
    accuracy = Math.round((correctAnswers / answeredEvents) * 100);
  }

  // FINAL RESULTS

  document.getElementById("finalScore").textContent = score;

  document.getElementById("finalCorrect").textContent =
    `${correctAnswers}/${answeredEvents}`;

  document.getElementById("finalAccuracy").textContent = accuracy + "%";

  document.getElementById("finalStreak").textContent = bestStreak;

  // SECURITY RANK

  let rank = "";
  let rankIcon = "";

  if (accuracy >= 90 && answeredEvents >= 5) {
    rank = "THINKIX CYBER GUARDIAN";
    rankIcon = "🏆";
  } else if (accuracy >= 75) {
    rank = "SECURITY ANALYST";
    rankIcon = "🛡️";
  } else if (accuracy >= 55) {
    rank = "IoT DEFENDER";
    rankIcon = "🔐";
  } else {
    rank = "SECURITY TRAINEE";
    rankIcon = "🎓";
  }

  document.getElementById("rank").textContent = rank;

  document.getElementById("rankIcon").textContent = rankIcon;

  setTimeout(() => {
    showScreen(resultScreen);
  }, 300);
}

// ==========================================
// BUTTON EVENTS
// ==========================================

startBtn.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", startGame);

safeBtn.addEventListener("click", () => answerEvent("safe"));

threatBtn.addEventListener("click", () => answerEvent("threat"));
