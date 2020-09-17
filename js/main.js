console.log("This is the main js");

// ----- VARIABLES ----- //

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// posicion inicial de la bolita
var x = canvas.width / 2;
var y = canvas.height - 30;

// velocidad inicial de la bolita
// X: negativo = izq, positivo = der
// Y: negativo = arriba, positivo = abajo
var dx = 2;
var dy = -2;

// Propiedades de la bolita
var ballRadius = 10;
var ballColor = "#0095DD";

// Propiedades del paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleColor = "#0095DD";

// Posicion inicial del paddle
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// velocidad de la bola al inicio del juego
var ballSpeed = 10;
var interval = setInterval(draw, ballSpeed);

// Propiedades de los bricks
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickColor = "#efa7d5";

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];

  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Score
var score = 0;

// ----- FUNCIONES ----- //

// Dibujo de la bolita
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

// Dibujo del paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Dibujo de los bricks
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        switch (r) {
          case 0:
            ctx.fillStyle = "#efa7d5";
            break;

          case 1:
            ctx.fillStyle = "#91c6f3";
            break;

          case 2:
            ctx.fillStyle = "#85d0b4";
            break;

          case 3:
            ctx.fillStyle = "#f3d991";
            break;

          default:
            ctx.fillStyle = "#FFF";
            break;
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Events on keypress
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// Events on mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Colision de la bolita
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS! Total points: " + score);
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

// Tabla de puntaje
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// MEnsaje en pantalla
function message(text) {
  tag = document.createElement("h1");
  document.body.appendChild(tag);
  tag.innerHTML = text;
}

// dibujo del juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  drawBricks();

  // Cuando la bolita pega a los lados
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // Cuando la bolita pega arriba y abajo
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - 5) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if (dy < 7) {
        dy = -dy;
        // aumento de la velocidad
        // dy = -dy * 1.1;
      } else {
        dy = -dy;
      }
    } else {
      // message("GAME OVER! Total points: " + score);
      alert("GAME OVER! Total points: " + score);
      document.location.reload();
      clearInterval(interval);
    }
  }

  // Movimiento del paddle
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  x += dx;
  y += dy;
}
