const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.width = 600;
canvas.height = 600;


let snake = [{ x: 200, y: 200 }];
let direction = 'RIGHT';
let food = getRandomFoodPosition();
let score = 0;
let gameOver = false;


let highScore = localStorage.getItem('highScore') || 0;


function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });
}

function drawFood() {
    ctx.fillStyle = 'white';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = { ...snake[0] };
    if (direction === 'RIGHT') head.x += 20;
    if (direction === 'LEFT') head.x -= 20;
    if (direction === 'UP') head.y -= 20;
    if (direction === 'DOWN') head.y += 20;


    if (head.x < 0) head.x = canvas.width - 20;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - 20;
    if (head.y >= canvas.height) head.y = 0;

   
    if (isCollision(head, snake)) {
        gameOver = true;
      
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        return;
    }

    snake.unshift(head);

   
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});


function getRandomFoodPosition() {
    const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    const y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    return { x, y };
}


function isCollision(head, snake) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width - 100, 30);
    ctx.fillText('High Score: ' + highScore, canvas.width - 550, 30);
  
}
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        return;
    }

  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();
    moveSnake();
    drawScore();
}

setInterval(gameLoop, 100);
