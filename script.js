const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const accuracyEl = document.getElementById("accuracy");
const highScoreEl = document.getElementById("high-score");

let score = 0;
let timeLeft = 30;
let hitCount = 0;
let totalClicks = 0;
let moleTimer;
let gameTimer;
let moleSpeed = 1000;

const hitSound = document.getElementById("hitSound");
const missSound = document.getElementById("missSound");

function getRandomHole() {
  return holes[Math.floor(Math.random() * holes.length)];
}

function spawnMole() {
  holes.forEach(h => h.classList.remove("mole", "evil"));

  const moleType = Math.random() > 0.2 ? "mole" : "evil"; // 80% chance normal mole
  const target = getRandomHole();
  target.classList.add(moleType);
}

function whack(e) {
  totalClicks++;
  if (e.target.classList.contains("mole")) {
    score++;
    hitCount++;
    hitSound.play();
    e.target.classList.add("hit");
    setTimeout(() => e.target.classList.remove("hit"), 300);
  } else if (e.target.classList.contains("evil")) {
    score -= 2;
    missSound.play();
    e.target.classList.add("missed");
    setTimeout(() => e.target.classList.remove("missed"), 300);
  } else {
    missSound.play();
  }

  updateDisplay();
}

function updateDisplay() {
  scoreEl.textContent = score;
  accuracyEl.textContent = totalClicks > 0 ? Math.round((hitCount / totalClicks) * 100) : 100;

  // High Score Save
  let highScore = parseInt(localStorage.getItem("whackHigh") || 0);
  if (score > highScore) {
    localStorage.setItem("whackHigh", score);
    highScoreEl.textContent = score;
  }
}

function startGame() {
  score = 0;
  timeLeft = 30;
  hitCount = 0;
  totalClicks = 0;
  moleSpeed = 1000;

  updateDisplay();
  timeEl.textContent = timeLeft;

  holes.forEach(h => h.classList.remove("mole", "evil"));
  holes.forEach(h => h.addEventListener("click", whack));

  moleTimer = setInterval(spawnMole, moleSpeed);
  gameTimer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft % 10 === 0 && moleSpeed > 400) {
      // Increase difficulty
      clearInterval(moleTimer);
      moleSpeed -= 150;
      moleTimer = setInterval(spawnMole, moleSpeed);
    }

    if (timeLeft <= 0) {
      clearInterval(moleTimer);
      clearInterval(gameTimer);
      alert("Game Over! Score: " + score);
    }
  }, 1000);

  // Load high score
  highScoreEl.textContent = localStorage.getItem("whackHigh") || 0;
}
