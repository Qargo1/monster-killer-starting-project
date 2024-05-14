const monsterHealthBar = document.getElementById('monster-health');
const playerHealthBar = document.getElementById('player-health');
const bonusLifeEl = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');
const logBtn = document.getElementById('log-btn');

const playerHealthNumber = document.getElementById('player-health-number');
const monsterHealthNumber = document.getElementById('monster-health-number');
const bonusPlayerHealth = document.getElementById('bonus-player-life');
const bonusMonsterHealth = document.getElementById('bonus-monster-life');

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealDamage(target, damage) {
  const dealtDamage = Math.random() * damage;
  if (target === 'monster') {
    monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  } else if (target === 'player') {
    playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  }
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

function removeBonusLife() {
  bonusLifeEl.parentNode.removeChild(bonusLifeEl);
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}

function updatePlayerHealth() {
  // Преобразовать currentPlayerHealth в строку с двумя знаками после запятой
  const formattedHealth = currentPlayerHealth.toFixed(2);
  playerHealthNumber.value = formattedHealth;
  playerHealthNumber.textContent = formattedHealth;
  bonusPlayerHealth.textContent = formattedHealth; // Добавьте отображение бонусных жизней
}

function updateMonsterHealth() {
  const formattedHealth = currentMonsterHealth.toFixed(2);
  monsterHealthNumber.value = formattedHealth;
  monsterHealthNumber.textContent = formattedHealth;
  bonusMonsterHealth.textContent = formattedHealth; // Добавьте отображение бонусных жизней
}

