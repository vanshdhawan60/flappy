
// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//Bird
let birdHeight = 24;
let birdWidth = 34;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImage = new Image ();
birdImage.src = "./flappybird.png";

let bird = {
    x: birdX,
    y: birdY,
    height: birdHeight,
    width: birdWidth,
    img: birdImage,
}

//Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

//physics
let velocity = -2; //pipes X velocity
let birdVelocity = 0; // Y velocity
let gravity = 0.4;

let gameOver = false;
let score = 0;

console.log(window);

window.onload = () => {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    context.drawImage (bird.img, bird.x, bird.y, bird.width, bird.height);

    topPipeImage = new Image ();
    topPipeImage.src = "./toppipe.png";

    bottomPipeImage = new Image () ;
    bottomPipeImage.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval (placePipes, 1500);
    document.addEventListener ("keydown", moveBird);
    document.addEventListener ("click", moveBird);
    document.addEventListener ("touchstart", moveBird);
}

function  update() {
    if (gameOver) return;
    context.clearRect (0,0,board.width,board.height);

    //update bird
    birdVelocity += gravity;
    // bird.y += birdVelocity,
    bird.y = Math.max (bird.y + birdVelocity, 0); 
    if (bird.y > board.height) gameOver = true;
    context.drawImage (bird.img, bird.x, bird.y, bird.width, bird.height);

    //update pipes
    for (let i=0; i<pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocity;
        context.drawImage (pipe.image, pipe.x, pipe.y, pipe.width, pipe.height); 

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (isCollided (pipe, bird) ) {
            gameOver = true;
        }
    }

    //clear pipes from array when passed
    while (pipeArray.length > 0 &&  pipeArray[0].x + pipeArray[0].width < 0) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "32px arial";
    context.fillText (score, 5, 35);

    //gameOver
    if (gameOver) {
        context.fillText ("Game Over." , (board.width)/4, board.height/2);
    }

    requestAnimationFrame (update);
}

function placePipes () {

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()* (pipeHeight/2) ;
    let openingSpace = boardHeight/4;

    let toppipe = {
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
        image: topPipeImage,
    }

    pipeArray.push(toppipe);

    let bottompipe = {
        x: pipeX,
        y: toppipe.y + toppipe.height + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        image: bottomPipeImage,
        passed: false,
    }

    pipeArray.push(bottompipe);
}

function moveBird (event) {
    if (event.code === "Space" || event.code === "ArrowUp") {
        birdVelocity = -6;
        if (gameOver) {
            bird.y = birdY;
            score = 0;
            pipeArray = [];
            gameOver = false;
            requestAnimationFrame(update);
        }
    }
}

function isCollided (x, y) {
    return (
        x.x + x.width > y.x &&
        x.x < y.x + y.width &&
        x.y + x.height > y.y &&
        x.y < y.y + y.height
    )
}
