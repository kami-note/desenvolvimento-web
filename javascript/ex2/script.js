function calculate() {
    let weight;
    const height = parseFloat(document.getElementById("altura").value);
    const gender = document.querySelector('input[name="genero"]:checked');

    if(gender.value === "masculino"){
        weight = 52 + (0.75 * (height - 152.4));
    }else if(gender.value === "feminino"){
        weight = 52 + (0.67 * (height - 152.4));
    }

    if(isNaN(height) || height < 54){
        document.getElementById("resultado").innerText = "A altura não pode esta vazia ou ser menor que 54 Cm";
    }else {
        document.getElementById("resultado").innerText = `Seu peso ideal é: ${weight.toFixed(0)}`;
    }
}


const audio = new Audio('./audio/02.-Cultist-Base.aac');
document.getElementById('playButton').addEventListener('click', () => {
    audio.play()
        .catch(error => {
            console.error('Error playing audio:', error);
        });
});

const canvas = document.getElementById("fireCanvas");
const ctx = canvas.getContext("2d");

let fireWidth = 65;
let fireHeight = 39;
let firePixels = new Array(fireWidth * fireHeight).fill(0);
let fireColors = [];
let lastUpdateTime = 0;
let fireSpeed = 70;

function createFirePalette() {
    for (let i = 0; i < 18; i++) fireColors.push(`rgb(${i * 7}, 0, 0)`);
    for (let i = 0; i < 18; i++) fireColors.push(`rgb(255, ${i * 7}, 0)`);
    for (let i = 0; i < 18; i++) fireColors.push(`rgb(255, 255, ${i * 7})`);
}

function createFireSource() {
    for (let x = 0; x < fireWidth; x++) {
        firePixels[(fireHeight - 1) * fireWidth + x] = fireColors.length - 1;
    }
}

function updateFire(time) {
    if (time - lastUpdateTime < fireSpeed) return;
    lastUpdateTime = time;

    for (let y = 1; y < fireHeight; y++) {
        for (let x = 0; x < fireWidth; x++) {
            let index = y * fireWidth + x;
            let belowIndex = (y + 1) * fireWidth + x;

            if (belowIndex >= firePixels.length) continue;

            let decay = Math.floor(Math.random() * 3);
            firePixels[index - decay] = Math.max(firePixels[belowIndex] - decay, 0);
        }
    }
}

function renderFire() {
    let pixelSizeX = canvas.width / fireWidth;
    let pixelSizeY = canvas.height / fireHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < fireHeight; y++) {
        for (let x = 0; x < fireWidth; x++) {
            let index = y * fireWidth + x;
            let colorIndex = firePixels[index];
            ctx.fillStyle = fireColors[colorIndex] || "black";
            ctx.fillRect(x * pixelSizeX, y * pixelSizeY, pixelSizeX + 1, pixelSizeY + 1);
        }
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loop(time) {
    updateFire(time);
    renderFire();
    requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);

createFirePalette();
createFireSource();
resizeCanvas();
loop(0);
