
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreLabel = document.getElementById("score");
const message = document.getElementById("message");
const startButton = document.getElementById("start-button");

const cells = 20;
const tile = canvas.width / cells;

let snake, food, direction, nextDirection, score;
let timer = null;
let playing = false;

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  scoreLabel.textContent = score;
  food = makeFood();
  draw();
}

function makeFood() {
  let position;

  do {
    position = {
      x: Math.floor(Math.random() * cells),
      y: Math.floor(Math.random() * cells)
    };
  } while (snake.some(part =>
    part.x === position.x && part.y === position.y
  ));

  return position;
}

function draw() {
  ctx.fillStyle = "#080b10";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#17202a";
  for (let i = 0; i <= cells; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tile, 0);
    ctx.lineTo(i * tile, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * tile);
    ctx.lineTo(canvas.width, i * tile);
    ctx.stroke();
  }

  ctx.fillStyle = "#ff6685";
  ctx.fillRect(
    food.x * tile + 3,
    food.y * tile + 3,
    tile - 6,
    tile - 6
  );

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#b3ffad" : "#55d86a";
    ctx.fillRect(
      part.x * tile + 1,
      part.y * tile + 1,
      tile - 2,
      tile - 2
    );
  });
}

function setDirection(x, y) {
  // Prevent reversing directly into yourself.
  if (x === -direction.x && y === -direction.y) return;
  nextDirection = { x, y };
}

function endGame() {
  playing = false;
  clearInterval(timer);
  timer = null;
  message.textContent = `Game over! Final score: ${score}`;
  startButton.textContent = "PLAY AGAIN";
}

function tick() {
  direction = { ...nextDirection };

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  const ateFood = head.x === food.x && head.y === food.y;

  const bodyToCheck = ateFood ? snake : snake.slice(0, -1);

  const hitWall =
    head.x < 0 || head.x >= cells ||
    head.y < 0 || head.y >= cells;

  const hitSelf = bodyToCheck.some(part =>
    part.x === head.x && part.y === head.y
  );

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (ateFood) {
    score += 10;
    scoreLabel.textContent = score;
    food = makeFood();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  clearInterval(timer);
  resetGame();
  playing = true;
  message.textContent = "Game on!";
  startButton.textContent = "RESTART";
  timer = setInterval(tick, 120);
}

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", event => {
  const keys = {
    ArrowUp: [0, -1],
    w: [0, -1], W: [0, -1],
    ArrowDown: [0, 1],
    s: [0, 1], S: [0, 1],
    ArrowLeft: [-1, 0],
    a: [-1, 0], A: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0], D: [1, 0]
  };

  if (keys[event.key]) {
    event.preventDefault();
    const [x, y] = keys[event.key];
    setDirection(x, y);
  }
});

document.querySelectorAll("[data-dir]").forEach(button => {
  button.addEventListener("click", () => {
    const directions = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0]
    };

    const [x, y] = directions[button.dataset.dir];
    setDirection(x, y);
  });
});

resetGame();
