const PLAYER_ATTACK_VALUE = 11;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 27;
const HEAL_PLAYER_VALUE = Array.from({ length: 35 }, (v, i) => i - 17);

let battleLog = [];

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let maxHealTries = 3;
let hasBonusChance = true;
let playerLost = false;

function disableButtons() {
    attackBtn.disabled = true;
    strongAttackBtn.disabled = true;
    healBtn.disabled = true;
}


function resetBasicStats() {
    chosenMaxLife = 100;
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    attackBtn.disabled = false;
    maxHealTries = 3;
    hasBonusChance = true;
    playerLost = false;
}

function attackPattern() {
    hitSound.play(); 
    vibrateImage(); 
    updateMonsterHealth();
}

showMessage('При желании', ', введите максимальное hp (ваше и монстра) в поле снизу.', 'coral');

adjustHealthBars(chosenMaxLife);

function checkBonusLife(monsterDamage) {
    switch (true) {
        case (hasBonusChance && currentPlayerHealth <= 0):
            logMessage("You've used your bonus chance!", "red", "1.5rem");
            writeToLog('player_used_bonus_life', currentPlayerHealth, currentMonsterHealth, -monsterDamage, 'none');
            hasBonusChance = false;
            removeBonusLife();
            currentPlayerHealth += monsterDamage;
            increasePlayerHealth(monsterDamage);
            updatePlayerHealth();
            return true
        case (!hasBonusChance && currentPlayerHealth <= 0):
            lostSound.play();
            logMessage("Sorry, you've lost", "red", "1.5rem");
            showMessage("You've lost, but Please, try again! ", ' You can start anew using a reset button on the right!', 'DeepSkyBlue');
            writeToLog('player_is_dead', currentPlayerHealth, currentMonsterHealth, monsterDamage, 'none');
            heroImage.classList.add('rotated');
            disableButtons()
            return true
    }
}

function attackMonster(mode) {
    attackPattern()
    const playerDamage = dealDamage('monster', mode);
    currentMonsterHealth -= playerDamage;
    updateMonsterHealth();
    switch (true) {
        case (currentMonsterHealth <= 0):
            winSound.play();
            logMessage("Congratulations!!! You've won!", "blue", "1.5rem");
            showMessage("You've won! But you can try your luck again! ", 'Start anew - using a reset button on the right!', 'DeepSkyBlue');
            writeToLog('monster_is_dead', currentPlayerHealth, currentMonsterHealth, 'none', playerDamage);
            monsterImage.classList.add('rotated');
            disableButtons()
            break;
        case (currentMonsterHealth > 0):
            attackPlayer(playerDamage)
    }
}

function attackPlayer(playerDamage) {
    attackPattern()
    const monsterDamage = dealDamage('player', MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= monsterDamage;
    updatePlayerHealth()
    const playerLost = checkBonusLife(monsterDamage);
    switch (!playerLost) {
        case (playerLost):
            return;
        default:
            updatePlayerHealth();
            logMessage(`Вы нанесли ${playerDamage.toFixed()} урона. Вам нанесли ${monsterDamage.toFixed()} урона.`);
            writeToLog('damage', currentPlayerHealth, currentMonsterHealth, monsterDamage, 'none');
    }
}

function attackHandler() {
    attackMonster(PLAYER_ATTACK_VALUE);
}

function strongAttackHandler() {
    attackMonster(STRONG_ATTACK_VALUE);
    // Отображение сообщения пользователю
    logMessage("Вы измождены после сильной атаки, повторить её не удастся", 'red');
    // Изменение цвета кнопки на черный
    strongAttackBtn.style.backgroundColor = "black";
    // Отключение кнопки
    strongAttackBtn.disabled = true;
}

function healPlayerHandler() {
    switch (true) {
        case (currentPlayerHealth === chosenMaxLife):
            logMessage("Вы отвлекслись на ворона. Вам повезло! Монстр отвлекся вместе с вами", 'LimeGreen');
            return;
        case (maxHealTries <= 0):
            showMessage("Заклинание исцеления больше не поддается вам");
            healBtn.style.backgroundColor = "black";
            healABtn.disabled = true;
            return;
    }
    const randomIndex = Math.floor(Math.random() * HEAL_PLAYER_VALUE.length);
    const randomHealValue = HEAL_PLAYER_VALUE[randomIndex];
    switch (true) {
        case (randomHealValue < 0):
            hitSound.play();
            logMessage(`Вот неудача - вы не успели закончить заклинание и были атакованы на ${randomHealValue} hp`, 'OrangeRed');
            currentPlayerHealth += randomHealValue;
            playerHealthBar.value = +playerHealthBar.value + randomHealValue;
            updatePlayerHealth();
            checkBonusLife(monsterDamage = -randomHealValue);
            break;
        case (randomHealValue === 0):
            healSound.play();
            logMessage("Из вас вышел отличный целитель! Вы исцелились на 0 hp", 'LimeGreen');
            break;
        case (currentPlayerHealth + randomHealValue <= chosenMaxLife):
            healSound.play();
            writeToLog('player_healed', currentPlayerHealth, currentMonsterHealth, -randomHealValue, 'none');
            logMessage(`Вы исцелились на ${randomHealValue} hp`, 'DodgerBlue');
            increasePlayerHealth(randomHealValue);
            currentPlayerHealth += randomHealValue;
            updatePlayerHealth();
            break;
        case (currentPlayerHealth + randomHealValue > chosenMaxLife):
            logMessage(`Вы полностью здоровы!`, 'DodgerBlue');
            writeToLog('player_healed_fully', currentPlayerHealth, currentMonsterHealth, -randomHealValue, 'none');
            increasePlayerHealth(chosenMaxLife - randomHealValue);
            currentPlayerHealth = chosenMaxLife;
            updatePlayerHealth();
            break;
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
}

function printLog() {
    for (const el of battleLog) {
        console.log(el);
    }
    showMessage("log printed in console");
}

function reset() {
    writeToLog('reset', currentPlayerHealth, currentMonsterHealth, 'none', 'none');
    logForm.style.height = initialHeight;
    logForm.style.height = 
    logCounter = 0;
    resetBasicStats();
    xpInput.value = chosenMaxLife;
    resetGame(chosenMaxLife);
    adjustHealthBars(chosenMaxLife);
    bonusLifeEl.style.display = '';

    strongAttackBtn.disabled = false;
    strongAttackBtn.style.backgroundColor = "#ff0062";
    healBtn.style.backgroundColor = "#ff0062";

    healBtn.disabled = false;
    heroImage.classList.remove('rotated');
    monsterImage.classList.remove('rotated');

    const logElements = logElement.querySelectorAll('li');
    logElements.forEach(element => element.parentNode.removeChild(element));
}

maxHealthForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const MaxLife = parseInt(xpInput.value); // Get the input value
    reset()
    showMessage(`Максимальное hp выставлено на: ${MaxLife} hp`, '', 'gray');
    currentMonsterHealth = MaxLife;
    currentPlayerHealth = MaxLife;
    
    resetGame(MaxLife)
    adjustHealthBars(MaxLife);
})

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
resetBtn.addEventListener('click', reset);
logBtn.addEventListener('click', printLog); 

window.addEventListener('resize', function() {
    const mediaQuery = window.matchMedia('(max-width: 969px)');
    if (mediaQuery.matches) {
        formHeightAfterMedia = 280;
        logFormHeight = formHeightAfterMedia + 'px';
        logForm.style.height = logFormHeight; // Перезапишите значение высоты
        const logElements = logElement.querySelectorAll('li');
        logElements.forEach(element => element.parentNode.removeChild(element));
    }
});

window.addEventListener('resize', function() {
    const mediaQuery = window.matchMedia('(min-width: 971px)');
    if (mediaQuery.matches) {
        formHeightAfterMedia = 300;
        logFormHeight = formHeightAfterMedia + 'px';
        logForm.style.height = logFormHeight; // Перезапишите значение высоты
        const logElements = logElement.querySelectorAll('li');
        logElements.forEach(element => element.parentNode.removeChild(element));
    }
});