const PLAYER_ATTACK_VALUE = 11;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 27;
const HEAL_PLAYER_VALUE = Array.from({ length: 35 }, (v, i) => i - 17);
let maxHealTries = 3;

let battleLog = [];

let chosenMaxLife = xpInput.value;

let hasBonusChance = true;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

showMessage('При желании, введите максимальное hp (ваше и монстра) в поле слева.');

adjustHealthBars(chosenMaxLife);

function checkBonusLife(monsterDamage, playerDamage) {
    if (monsterDamage < 0 && currentPlayerHealth > 0) {
        hitSound.play();
        currentPlayerHealth += monsterDamage;
        playerHealthBar.value = +playerHealthBar.value + monsterDamage;
        updatePlayerHealth();
        return
    } else if (monsterDamage < 0) {
        monsterDamage = -monsterDamage
    }

    currentPlayerHealth -= monsterDamage;
    hitSound.play();
    vibrateImage();
    updatePlayerHealth();

    if (currentPlayerHealth > 0) {
        writeToLog('damage', currentPlayerHealth, currentMonsterHealth, monsterDamage, 'none');
        logMessage(`Вы нанесли ${playerDamage.toFixed()} урона. Вам нанесли ${monsterDamage.toFixed()} урона.`);
        return
    } else if (hasBonusChance && currentPlayerHealth <= 0) {
        logMessage("You've used your bonus chance!");
        hasBonusChance = false;
        removeBonusLife();
        currentPlayerHealth += monsterDamage;
        increasePlayerHealth(monsterDamage);
        vibrateImage();
        updatePlayerHealth();
        writeToLog('player_used_bonus_life', currentPlayerHealth, currentMonsterHealth, -monsterDamage, 'none');

    } else {
        lostSound.play();
        logMessage("Sorry, you've lost");
        heroImage.classList.add('rotated');
        attackBtn.disabled = true;
        strongAttackBtn.disabled = true;
        healBtn.disabled = true;
        writeToLog('player_is_dead', currentPlayerHealth, currentMonsterHealth, monsterDamage, 'none');
    }
}

function attackMonster(mode) {
    const playerDamage = dealDamage('monster', mode);
    currentMonsterHealth -= playerDamage;
    updateMonsterHealth();
    vibrateImage();
    if (currentMonsterHealth <= 0) {
        winSound.play();
        monsterImage.classList.add('rotated');
        writeToLog('monster_is_dead', currentPlayerHealth, currentMonsterHealth, 'none', playerDamage);
        logMessage("Congratulations!!! You've won!");
    } 

    const monsterDamage = dealDamage('player', MONSTER_ATTACK_VALUE);
    checkBonusLife(monsterDamage, playerDamage);
}

function attackHandler() {
    attackMonster(PLAYER_ATTACK_VALUE);
}

function strongAttackHandler() {
    hitSound.play();
    attackMonster(STRONG_ATTACK_VALUE);
    // Отображение сообщения пользователю
    logMessage("Вы измождены после сильной атаки, повторить её не удастся");
    // Изменение цвета кнопки на черный
    strongAttackBtn.style.backgroundColor = "black";
    // Отключение кнопки
    strongAttackBtn.disabled = true;
}

function healPlayerHandler() {
    if (currentPlayerHealth === chosenMaxLife) {
        logMessage("Вы отвлекслись на ворона. Вам повезло! Монстр отвлекся вместе с вами");
        return;
    }
    if (maxHealTries <= 0) {
        logMessage("Заклинание исцеления больше не поддается вам");
        healBtn.style.backgroundColor = "black";
        healABtn.disabled = true;
        return;
    }
    const randomIndex = Math.floor(Math.random() * HEAL_PLAYER_VALUE.length);
    const randomHealValue = HEAL_PLAYER_VALUE[randomIndex];
    if (randomHealValue < 0) {
        logMessage(`Вот неудача - вы не успели закончить заклинание и были атакованы на ${randomHealValue} hp`);
        checkBonusLife(monsterDamage = randomHealValue)
    } else if (randomHealValue === 0) {
        logMessage("Из вас вышел отличный целитель! Вы исцелились на 0 hp");
        healSound.play();
    } else if (randomHealValue > 0 && currentPlayerHealth < chosenMaxLife && currentPlayerHealth + randomHealValue <= chosenMaxLife) {
        logMessage(`Вы исцелились на ${randomHealValue} hp`);
        healSound.play();
        increasePlayerHealth(randomHealValue)
        currentPlayerHealth += randomHealValue;
        updatePlayerHealth()
        writeToLog('player_healed', currentPlayerHealth, currentMonsterHealth, -randomHealValue, 'none')
    } else if (currentPlayerHealth + randomHealValue > chosenMaxLife) {
        increasePlayerHealth(chosenMaxLife - randomHealValue)
        currentPlayerHealth = chosenMaxLife
        logMessage(`Вы полностью здоровы!`);
        updatePlayerHealth()
    } 
    --maxHealTries;
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
    chosenMaxLife = 100;
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    attackBtn.disabled = false;
    maxHealTries = 3;

    xpInput.value = chosenMaxLife;
    playerHealthNumber.value = chosenMaxLife;
    playerHealthNumber.textContent = chosenMaxLife;
    monsterHealthNumber.value = chosenMaxLife;
    monsterHealthNumber.textContent = chosenMaxLife;
    adjustHealthBars(chosenMaxLife);

    strongAttackBtn.disabled = false;
    strongAttackBtn.style.backgroundColor = "#ff0062";
    healBtn.style.backgroundColor = "#ff0062";

    healBtn.disabled = false;
    resetGame(chosenMaxLife);
    heroImage.classList.remove('rotated');
    monsterImage.classList.remove('rotated');
    writeToLog('reset', currentPlayerHealth, currentMonsterHealth, 'none', 'none');

    const logElements = logElement.querySelectorAll('li');
    logElements.forEach(element => element.parentNode.removeChild(element));
    logElement.style.height = 100 + 'px';
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);

resetBtn.addEventListener('click', reset);

maxHealthForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    chosenMaxLife = parseInt(xpInput.value); // Get the input value
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;

    adjustHealthBars(chosenMaxLife);
    playerHealthNumber.value = chosenMaxLife;
    playerHealthNumber.textContent = chosenMaxLife;
    monsterHealthNumber.value = chosenMaxLife;
    monsterHealthNumber.textContent = chosenMaxLife;
    // Use chosenMaxLife here
    showMessage(`Максимальное hp выставлено на: ${chosenMaxLife}`);

    // Perform any other actions you need after getting the value

});
