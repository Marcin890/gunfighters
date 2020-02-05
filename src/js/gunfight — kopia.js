const windows = document.querySelectorAll(".window-frame");
const gunfighters = document.querySelectorAll(".gunfighter");
const scoresBoard = document.querySelector(".score__text");
const scoresBg = document.querySelector(".score");
const board = document.querySelector(".board");
const bullets = document.querySelector(".bullets");
const nextRound = document.querySelector(".round");
const signBoard = document.querySelector(".signboard__text");
const saloon = document.querySelector(".saloon");
const intro = document.querySelector(".intro");
const start = document.querySelector(".intro__link");
const audio = document.querySelector(".audio__gun");
const gameOver = document.querySelector(".gameover");
const gameOverScore = document.querySelector(".gameover__score");

// Settings

let round = 0;
let scores = 0;
let scoresToWin;
let game;
let bulletsNumber;
let bulletLeft;
let minTime = 1200;
let maxTime = 1500;
let endTime = 3000;
let interval = 3;
let gunNumbers;

function settings() {
  interval = interval + Math.round((interval * 30) / 100);
  round++;
  scoresToWin = scores + interval;
  bulletsNumber = interval + 2;
  minTime = minTime - (minTime * 15) / 100;
  maxTime = maxTime - (maxTime * 15) / 100;
  endTime = endTime - (endTime * 10) / 100;
  gunNumbers = 0;
  scoresBoard.innerHTML = scores;
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomGunfighter(gun) {
  const numb = Math.floor(Math.random() * gun.length);
  const gunfighter = gun[numb];
  if (gunfighter.classList.contains("showGunfigter")) {
    return randomGunfighter(gun);
  } else {
    return gunfighter;
  }
}

function fight() {
  // const time = randomTime(1000, 1000);
  if (gunNumbers < interval) {
    gunNumbers++;
    console.log(gunNumbers);
    const actualGunfighter = randomGunfighter(gunfighters);
    actualGunfighter.classList.add("showGunfigter");
    const countdown = setTimeout(endgame, endTime);
    actualGunfighter.addEventListener("click", function clearCount() {
      clearTimeout(countdown);
      actualGunfighter.removeEventListener("click", clearCount);
    });
  }
}

function endgame() {
  clearInterval(game);
  gameOver.classList.add("show");
  gameOverScore.innerHTML = scores;
}

function win() {
  clearInterval(game);
  nextRound.classList.add("show");
  nextRound.addEventListener("click", nextRounds);
  window.removeEventListener("click", shoot);
}

function nextRounds() {
  nextRound.classList.remove("show");
  startGame();
}

function shoot() {
  // audio.play();
  let node = bullets.lastChild;
  bullets.removeChild(node);
  bulletLeft = document.querySelectorAll(".bullet");
  if (bulletLeft.length <= 0) {
    endgame();
  }
}

function generateBullets() {
  bullets.innerHTML = "";
  for (let i = 0; i < bulletsNumber; i++) {
    let bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullets.appendChild(bullet);
  }
}

function startGame() {
  settings();
  signBoard.innerHTML = `Runda ${round}`;
  clearInterval(game);
  generateBullets();
  window.addEventListener("click", shoot);
  game = setInterval(() => {
    fight();
  }, randomTime(minTime, maxTime));
}

function init() {
  intro.classList.add("hide");
  saloon.classList.add("flex");
  scoresBg.classList.add("show");
  startGame();
}

start.addEventListener("click", init);

gunfighters.forEach(g =>
  g.addEventListener("click", e => {
    // Blood
    const x = e.pageX;
    const y = e.pageY;
    const el = document.createElement("div");
    el.classList.add("blood");
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    board.appendChild(el);
    setTimeout(() => {
      board.removeChild(el);
    }, 200);

    // Dead
    e.target.classList.remove("showGunfigter");
    // Score
    scores++;
    scoresBoard.innerHTML = scores;
    if (scores == scoresToWin) {
      win();
    }
  })
);
