const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste o tamanho do canvas
canvas.width = 1800;
canvas.height = 960;

// Carregando as imagens
const playerImg = new Image();
playerImg.src = 'images/águia.png';  // Substituindo o avião por um macaco
const bulletImg = new Image();
bulletImg.src = 'images/bala.png';   // Substituindo os tiros por bala
const fuelTankImg = new Image();
fuelTankImg.src = 'images/maçã.png'; // Substituindo o combustível por banana
const enemyImg = new Image();
enemyImg.src = 'images/corvo.png'; // Substituindo inimigos por onça (ou polícia)

// Variáveis do jogo
let score = 0;
let fuel = 100;
let speed = 2;
let player = { x: 200, y: 500, width: 140, height: 100 };
let fuelDecrement = 0.05;
let enemies = [];
let fuelTanks = [];
let bullets = [];
let maxBullets = 3;  // Número máximo de tiros
let availableBullets = maxBullets;  // Tiros disponíveis

// Função para criar inimigos
function createEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 100,
        height: 90
    };
    enemies.push(enemy);
}

// Função para criar tanques de combustível
function createFuelTank() {
    const tank = {
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 100,
        height: 80
    };
    fuelTanks.push(tank);
}

// Função para criar projéteis (tiros)
function shoot() {
    if (availableBullets > 0) {  // Verifica se há tiros disponíveis
        const bullet = {
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 70,
            height: 85,
            speed: 5
        };
        bullets.push(bullet);
        availableBullets--;  // Diminui a quantidade de tiros disponíveis
    }
}

// Desenha o tambor de balas na tela (agora no canto inferior esquerdo)
function drawBulletIndicator() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Balas: ${availableBullets}`, 10, canvas.height - 20);  // Exibe as balas no canto inferior esquerdo
}

// Desenha o jogador (agora o macaco)
function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Desenha os inimigos (agora a polícia)
function drawEnemies() {
    enemies.forEach(enemy => {
        enemy.y += speed;
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Desenha os tanques de combustível (agora as bananas)
function drawFuelTanks() {
    fuelTanks.forEach(tank => {
        tank.y += speed;
        ctx.drawImage(fuelTankImg, tank.x, tank.y, tank.width, tank.height);
    });
}

// Desenha e move os projéteis (agora balas)
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed; // Movimenta o tiro para cima
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove o projétil se sair da tela
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Atualiza o jogo
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawFuelTanks();
    drawBullets();
    drawBulletIndicator();  // Exibe o tambor de balas

    // Movimenta o macaco
    if (keys.ArrowLeft && player.x > 0) player.x -= 5;
    if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += 5;
    if (keys.ArrowUp && player.y > 0) player.y -= 5;
    if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += 5;

    // Combustível diminui ao longo do tempo
    fuel -= fuelDecrement;
    if (fuel <= 0) {
        gameOver();
    }

    // Colisão com inimigos
    enemies.forEach((enemy, enemyIndex) => {
        // Verifica colisão entre jogador e inimigos
        if (checkCollision(player, enemy)) {
            gameOver();
        }

        // Verifica colisão dos projéteis com inimigos
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                // Remove inimigo e projétil ao colidir
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 100; // Adiciona pontos ao destruir inimigos
            }
        });

        if (enemy.y > canvas.height) enemies.splice(enemyIndex, 1);
    });

    // Colisão com tanques de combustível (bananas)
    fuelTanks.forEach((tank, index) => {
        if (checkCollision(player, tank)) {
            fuel = Math.min(fuel + 20, 100); // Aumenta o combustível
            fuelTanks.splice(index, 1);
            availableBullets = maxBullets;  // Recarrega o tambor de balas
        }
    });

    // Atualizar pontuação e combustível
    score++;
    document.getElementById('score').textContent = score;
    document.getElementById('fuel').textContent = `${fuel.toFixed(1)}%`;
}

// Função para verificar colisão
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Função de Game Over
function gameOver() {
 
    document.location.reload();
}

// Controles do jogo
const keys = {};
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    // Atira ao pressionar a barra de espaço, mas somente se houver balas disponíveis
    if (e.key === ' ' && availableBullets > 0) {
        shoot();
    }
});
window.addEventListener('keyup', e => keys[e.key] = false);

// Loop do jogo
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}


// Cria inimigos e tanques de combustível de forma intermitente
setInterval(createEnemy, 1000);
setInterval(createFuelTank, 5000);

// Inicia o loop do jogo
gameLoop();
