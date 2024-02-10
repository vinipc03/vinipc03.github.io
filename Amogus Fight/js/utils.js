function retangularCollision({ retangle1, retangle2}) {
    return (
        retangle1.attackBox.position.x + retangle1.attackBox.width >= retangle2.position.x &&
        retangle1.attackBox.position.x <= retangle2.position.x + retangle2.width && 
        retangle1.attackBox.position.y + retangle1.attackBox.height >= retangle2.position.y && 
        retangle1.attackBox.position.y <= retangle2.position.y + retangle2.height
        )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'EMPATE'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'TRIPULANTE 1 VENCEU'
    } else if (enemy.health > player.health) {
        document.querySelector('#displayText').innerHTML = 'IMPOSTOR VENCEU'
    }
}

let timer = 30
let timerId
function decreaseTimer() {
    
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}