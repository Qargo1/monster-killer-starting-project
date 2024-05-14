const PLAYER_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 27;
const HEAL_PLAYER_VALUE = Array.from({ length: 35 }, (v, i) => i - 17);
let maxHealTries = 3;

const chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function attackMonster(mode) {
    const playerDamage = dealDamage('monster', mode);
    currentMonsterHealth -= playerDamage;
    updateMonsterHealth()
    if (currentMonsterHealth <= 0 && currentPlayerHealth >= 0) {
        alert('You won!');
        return;
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("It's a draw");
        return;
    }
    const monsterDamage = dealDamage('player', MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= monsterDamage;
    updatePlayerHealth()
    if (currentPlayerHealth <= 0){
        alert('You lost!');
    }
}

function attackHandler() {
    attackMonster(PLAYER_ATTACK_VALUE);
}

function strongAttackHandler() {
    attackMonster(STRONG_ATTACK_VALUE);
    // Отображение сообщения пользователю
    alert("Вы измождены после сильной атаки, повторить её не удастся");
    // Изменение цвета кнопки на черный
    strongAttackBtn.style.backgroundColor = "black";
    // Отключение кнопки
    strongAttackBtn.disabled = true;
}

function healPlayerHandler() {
    if (currentPlayerHealth === chosenMaxLife) {
        alert(`Вы отвлекслись на ворона. Вам повезло! Монстр отвлекся вместе с вами`);
        return;
    }
    if (maxHealTries <= 0) {
        alert("Заклинание исцеления больше не поддается вам");
        healBtn.style.backgroundColor = "black";
        healABtn.disabled = true;
        return;
    }
    const randomIndex = Math.floor(Math.random() * HEAL_PLAYER_VALUE.length);
    const randomHealValue = HEAL_PLAYER_VALUE[randomIndex];
    if (randomHealValue < 0) {
        alert(`Вот неудача - вы не успели закончить заклинание и были атакованы на ${randomHealValue} hp`);
        increasePlayerHealth(randomHealValue)
        currentPlayerHealth += randomHealValue;
        updatePlayerHealth()
        if (currentPlayerHealth <= 0){
            alert('You lost!');
        }
    } else if (randomHealValue === 0) {
        alert("Из вас вышел отличный целитель! Вы исцелились на 0 hp");
    } else if (randomHealValue > 0 && currentPlayerHealth < chosenMaxLife && currentPlayerHealth + randomHealValue <= chosenMaxLife) {
        alert(`Вы исцелились на ${randomHealValue} hp`);
        increasePlayerHealth(randomHealValue)
        currentPlayerHealth += randomHealValue;
        updatePlayerHealth()
    } else if (currentPlayerHealth + randomHealValue > chosenMaxLife) {
        increasePlayerHealth(chosenMaxLife - randomHealValue)
        currentPlayerHealth = chosenMaxLife
        alert(`Вы полностью здоровы!`);
        updatePlayerHealth()
    } 
    maxHealTries--;
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler)