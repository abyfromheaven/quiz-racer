import './style.css';
import * as ex from 'excalibur';
import { QUESTIONS } from './questions';
import type { Question } from './questions';

// --- CONFIGURATION ---
const FINISH_LINE_X = 2000;
const BOT_SPEED = 45;
const PLAYER_BOOST = 180;
const TRACK_WIDTH = 3000;
const MAX_HEALTH = 3;

enum GameMode {
  SOLO,
  MULTI
}

// --- RESOURCES ---
const resources = {
  p1: new ex.ImageSource('/p1.png'),
  p2: new ex.ImageSource('/p2.png'),
};

const loader = new ex.Loader(Object.values(resources));
loader.suppressPlayButton = true;

// --- GAME STATE ---
let currentGameMode: GameMode = GameMode.SOLO;
let isGameOver = false;

const players = [
  { 
    score: 0, 
    health: MAX_HEALTH,
    currentQ: 0, 
    car: null as any, 
    ui: { question: 'p1-question', options: '.p1-opt', score: 'p1-score' } 
  },
  { 
    score: 0, 
    health: MAX_HEALTH,
    currentQ: 0, 
    car: null as any, 
    ui: { question: 'p2-question', options: '.p2-opt', score: 'p2-score' } 
  }
];

// --- EXCALIBUR SETUP ---
const engine = new ex.Engine({
  canvasElementId: 'game',
  width: 1280,
  height: 400,
  displayMode: ex.DisplayMode.FitContainer,
  backgroundColor: ex.Color.fromHex('#0f172a'),
  snapToPixel: true,
});

// Build Tracks
function createTrack(y: number, color: string) {
  const track = new ex.Actor({
    pos: ex.vec(0, y),
    width: TRACK_WIDTH * 2,
    height: 100,
    color: ex.Color.fromHex(color),
    anchor: ex.Vector.Zero,
  });
  engine.add(track);

  for (let i = 0; i < 50; i++) {
    engine.add(new ex.Actor({
      pos: ex.vec(i * 100, y + 50),
      width: 40,
      height: 4,
      color: ex.Color.fromHex('#475569'),
    }));
  }
}

createTrack(100, '#1e293b');
createTrack(250, '#1e293b');

// Finish Line (Checkered Pattern)
function createCheckeredFinish(x: number) {
  const size = 40;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 2; col++) {
      const isBlack = (row + col) % 2 === 0;
      engine.add(new ex.Actor({
        pos: ex.vec(x + (col * size), row * size * 4),
        width: size,
        height: size * 4,
        color: isBlack ? ex.Color.Black : ex.Color.White,
        anchor: ex.Vector.Zero,
      }));
    }
  }
}
createCheckeredFinish(FINISH_LINE_X);

// Cars Initialization
function setupCars() {
  players[0].car = new ex.Actor({
    pos: ex.vec(100, 150),
    width: 100,
    height: 50,
  });
  players[0].car.graphics.use(resources.p1.toSprite());
  players[0].car.graphics.current!.scale = ex.vec(0.2, 0.2); 
  
  players[1].car = new ex.Actor({
    pos: ex.vec(100, 300),
    width: 100,
    height: 50,
  });
  players[1].car.graphics.use(resources.p2.toSprite());
  players[1].car.graphics.current!.scale = ex.vec(0.2, 0.2);

  engine.add(players[0].car);
  engine.add(players[1].car);
}

setupCars();

function updateCarSprite(playerIdx: number) {
  // Tidak ada perubahan sprite otomatis lagi
}

// Bot logic & Win Conditions
players[1].car.on('postupdate', () => {
  if (isGameOver) {
    players[1].car.vel.x = 0;
    players[0].car.vel.x = 0;
    return;
  }

  if (currentGameMode === GameMode.SOLO) {
    players[1].car.vel.x = BOT_SPEED;
    if (players[1].car.pos.x >= FINISH_LINE_X) {
      endGame("BOT MENANG BALAPAN!");
    }
  }

  if (players[0].car.pos.x >= FINISH_LINE_X) endGame(currentGameMode === GameMode.SOLO ? "KAMU MENANG BALAPAN!" : "PLAYER 1 MENANG BALAPAN!");
  if (currentGameMode === GameMode.MULTI && players[1].car.pos.x >= FINISH_LINE_X) endGame("PLAYER 2 MENANG BALAPAN!");
});

engine.currentScene.camera.strategy.elasticToActor(players[0].car, 0.1, 0.1);

// --- UI LOGIC ---
function getRandomQuestionIndex() {
  return Math.floor(Math.random() * QUESTIONS.length);
}

function loadQuestion(playerIdx: number) {
  const p = players[playerIdx];
  const q = QUESTIONS[p.currentQ];
  const qText = document.getElementById(p.ui.question)!;
  const opts = document.querySelectorAll(p.ui.options);
  
  qText.innerText = q.text;
  opts.forEach((btn, idx) => {
    btn.innerHTML = `<span class="opacity-50 mr-1">${String.fromCharCode(65 + idx)}.</span> ${q.options[idx]}`;
  });
}

function handleAnswer(playerIdx: number, selectedIndex: number) {
  if (isGameOver) return;

  const p = players[playerIdx];
  const q = QUESTIONS[p.currentQ];

  if (selectedIndex === q.answer) {
    p.score++;
    document.getElementById(p.ui.score)!.innerText = p.score.toString();
    p.car.pos.x += PLAYER_BOOST;
    p.car.actions.blink(100, 100, 2);
  } else {
    // Damage logic (hanya mengurangi health, sprite tetap sama)
    p.health--;
    
    const ui = document.getElementById(playerIdx === 0 ? 'p1-ui' : 'p2-ui')!;
    ui.classList.add('flash-red');
    setTimeout(() => ui.classList.remove('flash-red'), 300);

    if (p.health <= 0) {
      endGame(playerIdx === 0 ? "PLAYER 1 HANCUR! (KALAH)" : "PLAYER 2 HANCUR! (KALAH)");
      return;
    }
  }

  p.currentQ = getRandomQuestionIndex();
  loadQuestion(playerIdx);
}

function endGame(message: string) {
  isGameOver = true;
  document.getElementById('game-over')!.classList.remove('hidden');
  document.getElementById('result-title')!.innerText = message;
  document.getElementById('result-stats')!.innerText = `P1 Skor: ${players[0].score} | P2/Bot Jarak: ${Math.floor(players[1].car.pos.x)}m`;
}

// --- INITIALIZATION ---
const mainMenu = document.getElementById('main-menu')!;
const p2UI = document.getElementById('p2-ui')!;
const p1Label = document.getElementById('p1-label')!;

// Jalankan engine sekali di awal
engine.start(loader).then(() => {
    console.log("Game Engine Ready");
});

async function startMode(mode: GameMode) {
  currentGameMode = mode;
  isGameOver = false;
  mainMenu.classList.add('hidden');
  
  // Reset states
  players.forEach((p, idx) => {
    p.score = 0;
    p.health = MAX_HEALTH;
    p.currentQ = getRandomQuestionIndex();
    p.car.pos = ex.vec(100, idx === 0 ? 150 : 300);
    p.car.vel.x = 0;
    document.getElementById(p.ui.score)!.innerText = '0';
  });

  if (mode === GameMode.MULTI) {
    p2UI.classList.remove('hidden');
    p1Label.innerText = "PLAYER 1";
    loadQuestion(1);
  } else {
    p2UI.classList.add('hidden');
    p1Label.innerText = "PLAYER";
  }
  
  loadQuestion(0);
}

// Event Listeners
document.getElementById('mode-solo')!.addEventListener('click', () => startMode(GameMode.SOLO));
document.getElementById('mode-multi')!.addEventListener('click', () => startMode(GameMode.MULTI));
document.getElementById('restart-btn')!.addEventListener('click', () => {
  document.getElementById('game-over')!.classList.add('hidden');
  mainMenu.classList.remove('hidden');
});

document.querySelectorAll('.p1-opt').forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(0, parseInt(btn.getAttribute('data-index')!)));
});

document.querySelectorAll('.p2-opt').forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(1, parseInt(btn.getAttribute('data-index')!)));
});
