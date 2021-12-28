let canvas = document.getElementById('map');
let map = canvas.getContext('2d');
let gameStart = document.querySelector('.button_start'); // кнопка старта
let gameStop = document.querySelector('.button_stop'); // кнопка остановки
let form = document.querySelector('.form'); // форма ввода логина
let maxLength = form.getAttribute('maxlength'); // максимальное колличество символов
let textCounter = document.querySelector('.text_counter span'); // счетчик символов
const login = document.getElementById('login'); // форма ввода логина
const btn = document.querySelector('.btn');
let x = canvas.width / 2;
let y = canvas.height - 30;
let ballRadius = 10;
let dx = 4;
let dy = -4;
let widthPlatform = 100;
let heigthPlatform = 10;
let platformX = (canvas.width - widthPlatform) / 2;
let arrowRight = false;
let arrowLeft = false;
let brickRowCount = 3;
let brickColumnCount = 7;
let brickWidth = 80;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 10;
let brickOffsetLeft = 90;
let counter = 0;
let lives = 2;
let name = prompt('Пожалуйста введите свое имя(не более 15 символов):', 'Name'); // первоначальная регистр

//#region Логин подсчет символов
textCounter.innerHTML = maxLength;
form.addEventListener('keyup', txtSetCounter);
form.addEventListener('keydown', function(e) {
    if (e.repeat) txtSetCounter();
});

function txtSetCounter() {
    let result = maxLength - form.value.length;
    textCounter.innerHTML = result;
}

// Проверка на заполнено ли поле ?
login.addEventListener('input', enterLogin, false);
enterLogin.call(login);

function enterLogin() {
    btn.disabled = this.value.trim().length === 0;
}

/* btn.addEventListener('click', saveLogin, false);

function saveLogin(name) {
    name = from.value;
} */
//#endregion

// Старт игры
gameStart.addEventListener('click', function(event) {
    if (event.target.closest('.button_start')) {
        moveDrawBall();
    }
});

/* gameStop.addEventListener('click', function(event) {
    if (event.target.closest('.button')) {
        moveDrawBall();
    }
}) */

// Изменение стиля курсора
canvas.addEventListener('mouseover', mouseStyle, false);

function mouseStyle(e) {
    e.target.style.cssText = `cursor: url('https://cdn.custom-cursor.com/db/cursor/32/Purple_Dot_Cursor.png') 4 1, pointer`;
}

// Массив для хранения кирпичей
let bricks = [];
for (let colum = 0; colum < brickColumnCount; colum++) {
    bricks[colum] = [];
    for (let row = 0; row < brickRowCount; row++) {
        bricks[colum][row] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDownHandler, false); // Нажатие на клавишу вправо/влево
document.addEventListener('keyup', keyUpHandler, false); // Отжатие клавиши вправо/влево
document.addEventListener('mousemove', mouseMoveHandler, false); // Отслеживание движении мыши


// Нажатие на клавишу вправо/влево
function keyDownHandler(event) {
    if (event.key == "ArrowRight" || event.key == "Right") {
        arrowRight = true;
    }
    if (event.key == "ArrowLeft" || event.key == "Left") {
        arrowLeft = true;
    }
}

// Отжатие на клавиши вправо/влево
function keyUpHandler(event) {
    if (event.key == "ArrowRight" || event.key == "Right") {
        arrowRight = false;
    }
    if (event.key == "ArrowLeft" || event.key == "Left") {
        arrowLeft = false;
    }
}

// Наведении мыши и управление при помощи мыши
function mouseMoveHandler(event) {
    let relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        platformX = relativeX - widthPlatform / 2;
    }
}


// Отслеживание столкновения
function collisionDetection() {
    for (let colum = 0; colum < brickColumnCount; colum++) {
        for (let row = 0; row < brickRowCount; row++) {
            let block = bricks[colum][row];
            if (block.status == 1) {
                if (x > block.x && x < block.x + brickWidth && y > block.y && y < block.y + brickHeight) {
                    dy = -dy;
                    block.status = 0;
                    counter++;
                    /* if (counter == 10) {
                        dx = dx + 1;
                        dy = dy - 1;
                        widthPlatform = widthPlatform + 50;
                    } */
                    if (counter == brickColumnCount * brickRowCount) {
                        alert(`YOU WIN! ${name}`);
                        document.location.reload();
                        /* clearInterval(interval); */
                    }
                }
            }
        }
    }
}
// Создание жизней
function drawLives() {
    map.font = "18px Arial";
    map.fillStyle = "#003597";
    map.fillText("Live : " + lives, canvas.width - 65, 20);
}

// Создание счетчика
function drawCount() {
    map.font = "18px Arial";
    map.fillStyle = "#003597";
    map.fillText("Score: " + counter, 8, 20);
}

// Отрисовка мяча
function drawBall() {
    map.beginPath(); // .beginPath = метод создает новый путь. Метод вызывается перед началом каждой строки, так что они могут быть сделаны с различными цветами.
    map.arc(x, y, ballRadius, 0, Math.PI * 2); // .arc = метод добавляет дугу окружности к текущему подпути. arc()Метод создает дугу окружности с центром в точке (x, y) с радиусом radius. 
    //Путь начинается в startAngle, заканчивается в endAngleи идет в направлении, заданном counterclockwise(по умолчанию по часовой стрелке).
    map.fillStyle = '#2675a3'; // задает цвет
    map.fill(); // закрашивает цвет
    map.closePath(); // закрываем путь; Метод попыток Холст 2D API , чтобы добавить прямую линию от текущей точки до начала текущего подпути. 
    //Если фигура уже замкнута или имеет только одну точку, эта функция ничего не делает.
}

// Отрисовка платформы
function drawPlatform() {
    map.beginPath();
    map.rect(platformX, canvas.height - heigthPlatform, widthPlatform, heigthPlatform);
    map.fillStyle = '#2675a3';
    map.fill();
    map.closePath();
}

// Отрисовка кирпичей 
function drawBricks() {
    for (let colum = 0; colum < brickColumnCount; colum++) {
        for (let row = 0; row < brickRowCount; row++) {
            if (bricks[colum][row].status == 1) {
                let brickX = (colum * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[colum][row].x = brickX;
                bricks[colum][row].y = brickY;
                map.beginPath();
                map.rect(brickX, brickY, brickWidth, brickHeight);
                map.fillStyle = '#071218';
                map.fill();
                map.closePath();
            }
        }
    }
}

// Движение мяча и платформы, отрисовка кирпичей
function moveDrawBall() {
    map.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPlatform();
    collisionDetection();
    drawCount();
    drawLives();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > platformX && x < platformX + widthPlatform) {
            dy = -dy;
        } else {
            lives--;
            if (lives == 0) {
                alert(`GAME OVER ${name}`);
                document.location.reload();
                /* clearInterval(interval); */ // Needed for Chrome to end game
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                platformX = (canvas.width - widthPlatform) / 2;
            }
            /* alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game */
        }
    }

    if (arrowRight && platformX < canvas.width - widthPlatform) {
        platformX += 10;
    } else if (arrowLeft && platformX > 0) {
        platformX -= 10;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(moveDrawBall);
}

/* moveDrawBall(); */
/* var interval = setInterval(moveDrawBall, 10); */