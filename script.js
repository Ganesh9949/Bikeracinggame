const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const popup = document.getElementById("game-over-popup");
const finalScoreEl = document.getElementById("final-score");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const backgroundMusic = document.getElementById("background-music");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.9;

// Game variables
let player = { x: canvas.width / 2 - 20, y: canvas.height - 100, width: 40, height: 80, speed: 5 };
let obstacles = [];
let roadY = 0;
let roadSpeed = 5;
let score = 0;
let gameRunning = true;
let musicPlaying = true;

// Load images
const playerBikeImg = new Image();
playerBikeImg.src = "bike.png";

const obstacleCarImg = new Image();
obstacleCarImg.src = "car.png";

const obstacleBikeImg = new Image();
obstacleBikeImg.src = "bikeobstacle.png";

const roadImg = new Image();
roadImg.src = "road.png";

// Function to draw the road
function drawRoad() {
  ctx.drawImage(roadImg, 0, roadY, canvas.width, canvas.height);
  ctx.drawImage(roadImg, 0, roadY - canvas.height, canvas.width, canvas.height);
  roadY += player.speed; // Road scrolls faster when bike moves faster
  if (roadY >= canvas.height) roadY = 0;
}

// Function to draw the player bike
function drawPlayer() {
  ctx.drawImage(playerBikeImg, player.x, player.y, player.width, player.height);
}

// Function to generate obstacles
function generateObstacle() {
  const randomX = Math.random() * (canvas.width - 50);
  const type = Math.random() < 0.5 ? "car" : "bike";
  obstacles.push({
    x: randomX,
    y: -100,
    width: 50,
    height: 100,
    speed: Math.random() * 2 + roadSpeed,
    type,
  });
}

// Function to draw obstacles
function drawObstacles() {
  obstacles.forEach((obstacle, index) => {
    const img = obstacle.type === "car" ? obstacleCarImg : obstacleBikeImg;
    ctx.drawImage(img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    obstacle.y += obstacle.speed + player.speed; // Obstacle speed adjusts to player speed
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
    }
  });
}

// Function to draw the speedometer
function drawSpeedometer() {
  const radius = 60; // Speedometer radius
  const centerX = 100; // Speedometer center X
  const centerY = canvas.height - 100; // Speedometer center Y
  const maxSpeed = 10; // Maximum speed value
  const angle = (player.speed / maxSpeed) * Math.PI * 1.5 - Math.PI / 2; // Calculate arrow angle

  // Draw the circular speedometer
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw speedometer marks
  ctx.lineWidth = 2;
  for (let i = 0; i <= maxSpeed; i++) {
    const markAngle = (i / maxSpeed) * Math.PI * 1.5 - Math.PI / 2;
    const startX = centerX + Math.cos(markAngle) * (radius - 10);
    const startY = centerY + Math.sin(markAngle) * (radius - 10);
    const endX = centerX + Math.cos(markAngle) * radius;
    const endY = centerY + Math.sin(markAngle) * radius;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  }

  // Draw the arrow
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(angle) * (radius - 20),
    centerY + Math.sin(angle) * (radius - 20)
  );
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.stroke();
}

// Function to detect collision
function detectCollision() {
  obstacles.forEach((obstacle) => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameRunning = false;
      endGame();
    }
  });
}

// Function to end the game
function endGame() {
  popup.classList.remove("hidden");
  finalScoreEl.textContent = score;
  pauseMusic();
}

// Function to restart the game
function restartGame() {
  popup.classList.add("hidden");
  player.x = canvas.width / 2 - 20;
  player.y = canvas.height - 100;
  obstacles = [];
  score = 0;
  gameRunning = true;
  player.speed = 5; // Reset player speed
  playMusic();
  update();
}

// Adjust player speed (for forward movement)
function adjustPlayerSpeed(delta) {
  player.speed = Math.min(10, Math.max(3, player.speed + delta)); // Limit speed between 3 and 10
}

// Play and Pause Music
function playMusic() {
  backgroundMusic.play();
  musicPlaying = true;
  musicToggleBtn.textContent = "Music: On";
}

function pauseMusic() {
  backgroundMusic.pause();
  musicPlaying = false;
  musicToggleBtn.textContent = "Music: Off";
}

function toggleMusic() {
  musicPlaying ? pauseMusic() : playMusic();
}

// Play and Pause Game
function toggleGame() {
  gameRunning = !gameRunning;
  playPauseBtn.textContent = gameRunning ? "Pause" : "Play";
  if (gameRunning) update();
}

// Move player (left-right)
function movePlayer(event) {
  if (event.key === "ArrowLeft" && player.x > 10) player.x -= 20;
  else if (event.key === "ArrowRight" && player.x < canvas.width - player.width - 10) player.x += 20;
  else if (event.key === "ArrowUp") adjustPlayerSpeed(1); // Speed up
  else if (event.key === "ArrowDown") adjustPlayerSpeed(-1); // Slow down
}

// Game loop
function update() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  drawPlayer();
  drawObstacles();
  drawSpeedometer(); // Draw speedometer
  detectCollision();
  if (Math.random() < 0.02) generateObstacle();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", movePlayer);
playMusic();
update();
