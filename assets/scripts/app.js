const PLAYER_ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 27;
const HEAL_PLAYER_VALUE = Array.from({ length: 35 }, (v, i) => i - 17);
let maxHealTries = 3;

let battleLog = [];

const enteredValue = prompt('Maximum number for you and the monster.', '100');

let chosenMaxLife = parseInt(enteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    alert("Invalid value, so it's set to the default 100");
    chosenMaxLife = 100;
} else {
    resetGame(chosenMaxLife);
}

let hasBonusChance = true;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function checkBonusLife(monsterDamage) {
    currentPlayerHealth -= monsterDamage;
    vibrateImage();
    updatePlayerHealth();

    if (currentPlayerHealth > 0) {
        writeToLog('damage', currentPlayerHealth, currentMonsterHealth, monsterDamage, 'none')
        return
    } else if (hasBonusChance && currentPlayerHealth <= 0) {
        alert("You've used your bonus chance!");
        hasBonusChance = false;
        removeBonusLife();
        currentPlayerHealth += monsterDamage;
        increasePlayerHealth(monsterDamage)
        vibrateImage()
        updatePlayerHealth();
        writeToLog('player_used_bonus_life', currentPlayerHealth, currentMonsterHealth, -monsterDamage, 'none')

    } else {
        alert("Sorry, you've lost");
        heroImage.classList.add('rotated');
        attackBtn.disabled = true;
        strongAttackBtn.disabled = true;
        healBtn.disabled = true;
        writeToLog('player_is_dead', currentPlayerHealth, currentMonsterHealth, monsterDamage, 'none')
    }
}

function attackMonster(mode) {
    const playerDamage = dealDamage('monster', mode);
    currentMonsterHealth -= playerDamage;
    updateMonsterHealth()
    vibrateImage()
    if (currentMonsterHealth <= 0) {
        monsterImage.classList.add('rotated');
        writeToLog('monster_is_dead', currentPlayerHealth, currentMonsterHealth, 'none', playerDamage)
        alert("You've won!");
    } 

    const monsterDamage = dealDamage('player', MONSTER_ATTACK_VALUE);
    checkBonusLife(monsterDamage);
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
        checkBonusLife(randomHealValue)
    } else if (randomHealValue === 0) {
        alert("Из вас вышел отличный целитель! Вы исцелились на 0 hp");
    } else if (randomHealValue > 0 && currentPlayerHealth < chosenMaxLife && currentPlayerHealth + randomHealValue <= chosenMaxLife) {
        alert(`Вы исцелились на ${randomHealValue} hp`);
        increasePlayerHealth(randomHealValue)
        currentPlayerHealth += randomHealValue;
        updatePlayerHealth()
        writeToLog('player_healed', currentPlayerHealth, currentMonsterHealth, -randomHealValue, 'none')
    } else if (currentPlayerHealth + randomHealValue > chosenMaxLife) {
        increasePlayerHealth(chosenMaxLife - randomHealValue)
        currentPlayerHealth = chosenMaxLife
        alert(`Вы полностью здоровы!`);
        updatePlayerHealth()
    } 
    maxHealTries--;
}

function writeToLog(eventType, currentPlayerHealth, currentMonsterHealth, damageToPlayer, damageToMonster) {
    console.log('Logging event');
    let logEntry;
    logEntry = {
        event_type: eventType,
        player_health: currentPlayerHealth,
        monster_health: currentMonsterHealth,
        damage_to_player: damageToPlayer,
        damage_to_monster: damageToMonster
    }
    battleLog.push(logEntry);
    console.log(battleLog);
}


function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    attackBtn.disabled = false;
    strongAttackBtn.disabled = false;
    healBtn.disabled = false;
    resetGame(chosenMaxLife);
    heroImage.classList.remove('rotated');
    monsterImage.classList.remove('rotated');
    writeToLog('reset', currentPlayerHealth, currentMonsterHealth, 'none', 'none');
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);

resetBtn.addEventListener('click', reset);

