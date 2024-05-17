const monsterHealthBar = document.getElementById('monster-health');
const playerHealthBar = document.getElementById('player-health');
const bonusLifeEl = document.getElementById('bonus-life');

const attackBtn = document.getElementById('attack-btn');
const strongAttackBtn = document.getElementById('strong-attack-btn');
const healBtn = document.getElementById('heal-btn');
const logBtn = document.getElementById('log-btn');

const resetBtn = document.getElementById('reset-btn');

const playerHealthNumber = document.getElementById('player-health-number');
const monsterHealthNumber = document.getElementById('monster-health-number');
const bonusPlayerHealth = document.getElementById('bonus-player-life');
const bonusMonsterHealth = document.getElementById('bonus-monster-life');

const heroImage = document.getElementById('hero-image');
const monsterImage = document.getElementById('monster-image');

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
  playerHealthNumber.value = value;
  playerHealthNumber.textContent = value;
  monsterHealthNumber.value = value;
  monsterHealthNumber.textContent = value;
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

function vibrateImage(duration = 300, amplitude = 20, frequency = 10) {
  const targetImage = currentMonsterHealth > currentPlayerHealth ? heroImage : monsterImage; // Ternary Operator value if true : value if false

  const vibrationDuration = duration; // Продолжительность вибрации в миллисекундах
  const vibrationAmplitude = amplitude; // Амплитуда вибрации в пикселях
  const interval = 1000 / frequency; // Интервал между вызовами функции в миллисекундах, рассчитанный из частоты

  const startTime = Date.now();

  // Запускаем интервал, который будет вызывать функцию через каждые 'interval' миллисекунд
  const intervalId = setInterval(() => {
    const elapsed = Date.now() - startTime; // Время, прошедшее с начала вибрации

    // Вычисляем случайное смещение в диапазоне от -vibrationAmplitude до +vibrationAmplitude
    const currentPosition = (Math.random() * 2 - 1) * vibrationAmplitude;
    // Применяем это смещение к изображению
    targetImage.style.transform = `translateX(${currentPosition}px)`;

    // Проверяем, прошло ли времени больше или равно vibrationDuration
    if (elapsed >= vibrationDuration) {
      clearInterval(intervalId); // Останавливаем интервал
      targetImage.style.transform = 'translateX(0)'; // Сбрасываем позицию изображения
    }
  }, interval); // Повторяем эту функцию каждые 'interval' миллисекунд
}
