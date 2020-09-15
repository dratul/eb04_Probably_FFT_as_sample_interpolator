let delay = 50;
let changeAt = 20;
let elapsed = 0;
let signal = 0;

let intervalID = 0;
let animFrame = 0;

let started = false;

const delayOut = document.getElementById('delay');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const button0 = document.getElementById('button0');
const button1 = document.getElementById('button1');

const canvas = document.getElementById('myCanvas');
const mid = canvas.height >> 1;
const high = (mid - mid / 2) >> 0;
const low = (mid + mid / 2) >> 0;

const outCanvas = document.getElementById('outerCanvas');
const outCtx = outCanvas.getContext('2d');
drawLine();


let current = undefined;
let points = [];
initPoints();


const ctx = canvas.getContext('2d');
drawAxis();


function drawLine() {
    // left position
    outCtx.strokeStyle = 'maroon';
    outCtx.lineWidth = 2.0;
    outCtx.beginPath();
    outCtx.moveTo(186, 37);
    outCtx.lineTo(230, 37);
    outCtx.stroke();
}

function initPoints() {
    points = Array(canvas.width).fill(0);
}

function drawFrame() {
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.moveTo(0, points[0]);
    let w = points.length;
    let last = points[0];
    let x = 1;
    while (x < w && points[x] != 0) {
        if (points[x] != last) {
            ctx.lineTo(x, last);
            ctx.lineTo(x, points[x]);
        } else {
            ctx.lineTo(x, points[x]);
        }
        last = points[x];
        x++;
    }
    ctx.stroke();
}

function shiftPoints() {
    points.splice(points.length - 1, 1);
    points.unshift(current);
}

function drawAxis() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(0, low);
    ctx.lineTo(canvas.width, low);
    ctx.stroke();
    let step = 20;
    ctx.strokeStyle = 'wheat';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '10px serif';
    let up = false;
    for (let i = 0; i <= canvas.width; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        if (up) {
            ctx.lineTo(i, canvas.height - 30);
            ctx.stroke();
            ctx.fillText(('' + ((i * 5) / 2)), i,  canvas.height - 20);
        } else {
            ctx.lineTo(i, canvas.height - 10);
            ctx.stroke();
            ctx.fillText(('' + ((i * 5) / 2)), i,  canvas.height);
        }
        up = !up;
    }
    
}

function delayChange(e) {
    delay = +e.value;
    delayOut.innerHTML = delay;
    changeAt = (delay * 2) / 5 >> 0;
}


function signal1() {
    signal = 1;
    button0.classList.remove('sel_button');
    button1.classList.add('sel_button');
}

function signal0() {
    signal = 0;
    button1.classList.remove('sel_button');
    button0.classList.add('sel_button');
}

function clearScreen() {
    window.cancelAnimationFrame(animFrame);
    // clearInterval(intervalID);
    elapsed = 0;
    initPoints();
    line1.style.color = 'white';
    line2.style.color = 'white';
    line3.style.color = 'white';
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    started = false;
    current = undefined;
    document.getElementById('startBT').innerHTML = 'Start';
    drawAxis();
}

function change() {
    line2.style.color = 'white';
    line3.style.color = 'yellow';
    setTimeout(
        () => {
            line3.style.color = 'white';
            line1.style.color = 'yellow';
            setTimeout(
                () => {
                    line1.style.color = 'white';
                    line2.style.color = 'yellow';
                }, 100
            );
        }, 100
    );
    // signal = !signal;
    current = current == high ? low : high;
}

function draw() {
    if (elapsed == 0) {
        change();
        elapsed = 0;
    }
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    ctx.save();
    drawAxis();
    drawFrame();
    ctx.restore();
    shiftPoints();
    elapsed = (elapsed + 1) % changeAt;
    animFrame = window.requestAnimationFrame(draw);
}

function start(e) {

    // switch(startState) {
    //     case 0:
    //         startState = 1;
    //         e.innerHTML = 'Pause';
    //         current = signal == 1 ? high : low;
    //         animFrame = window.requestAnimationFrame(draw);
    //         break;
    //     case 1:

    // }

    if (started) {
        window.cancelAnimationFrame(animFrame);
        clearInterval(intervalID);
        e.innerHTML = 'Start';
        started = false;
    } else {
        started = true;
        e.innerHTML = 'Pause';
        if (current === undefined) {
            current = signal == 1 ? high : low;
        }
        // change();
        // intervalID  = setInterval(
        //     change, delay
        // );
        animFrame = window.requestAnimationFrame(draw);
    }
    
}

