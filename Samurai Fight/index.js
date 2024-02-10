const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 130
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax : 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax : 8     
        },
        runl: { //MOVIMENTAÇÃO PARA ESQUERDA
            imageSrc: './img/samuraiMack/Runl.png',
            framesMax : 8,   
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax : 2  
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax : 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax : 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit.png',
            framesMax : 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax : 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax : 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax : 8     
        },
        runr: { //MOVIMENTAÇÃO PARA DIREITA
            imageSrc: './img/kenji/Runr.png',
            framesMax : 8
            
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax : 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax : 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax : 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax : 7
        }
    },
    attackBox: {
        offset: {
            x: -150,
            y: 50
        },
        width: 150,
        height: 50
    }
})

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() { //função que cria animações e põe coisas na tela
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //MOVIMENTAÇÃO DO INIMIGO
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('runr')
    } else {
        enemy.switchSprite('idle')
    }

    // PULO INIMIGO
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }
    
    //MOVIMENTAÇÃO DO JOGADOR
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5 
        player.switchSprite('runl')
        // player.image = player.sprites.runl.image //movimentação para esquerda
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
        //player.image = player.sprites.run.image //movimentação para direita
    } else {
        player.switchSprite('idle')
    }

    // PULO
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    // DETECÇÃO DE COLISÃO & INIMIGO LEVANDO GOLPE
    if ( 
        retangularCollision({
            retangle1: player,
            retangle2: enemy
        }) &&
        player.isAttaking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttaking = false
        gsap.to('#vidaInimigo', {
            width: enemy.health + '%'})
        //console.log('ataque do jogador');
    }

    // SE O JOGADOR ERRA
    if (player.isAttaking && player.framesCurrent ===4) {
        player.isAttaking = false
    }

    // QUANDO O JOGADOR LEVA UM GOLPE
    if ( 
        retangularCollision({
            retangle1: enemy,
            retangle2: player
        }) &&
        enemy.isAttaking && enemy.framesCurrent === 2) {
        player.takeHit()
        enemy.isAttaking = false 
        gsap.to('#vidaJogador', {
            width: player.health + '%'})
        //console.log('ataque do inimigo');
    }

    // SE O INIMIGO ERRA
    if (enemy.isAttaking && enemy.framesCurrent ===2) {
        enemy.isAttaking = false
    }

    // finalizar o jogo baseado na vida dos personagens
    if (enemy.health <= 0 || player.health <=0) {
        determineWinner({ player, enemy, timerId })
    }
}


animate()


window.addEventListener('keydown', (event) => {
        if (!player.dead){
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }
    
        if(!enemy.dead){
        switch(event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
})