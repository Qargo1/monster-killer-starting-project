const logElement = document.getElementById('game-log');
const currentHeight = logElement.offsetHeight;


const alertMessage = document.getElementById('alert-message-popup');
const messageText = document.getElementById('game-message');
const closeButton = document.querySelector('.close-button');

function logMessage(message) {
    const newLine = document.createElement('li');
    newLine.textContent = message;
    if (logElement.offsetHeight < 700) {
        const currentHeight = logElement.offsetHeight;
        const newHeight = currentHeight + 5;
        logElement.style.height = newHeight + 'px';
    } else {
        logElement.removeChild(logElement.firstChild);
    }

    logElement.appendChild(newLine);
}

function showMessage(message) {
    messageText.innerHTML = message;
    alertMessage.style.display = 'block';
}

const hitSound = new Audio('../assets/sound/hit.mp3');
const healSound = new Audio('../assets/sound/heal.mp3');
const winSound = new Audio('../assets/sound/win.mp3');
const lostSound = new Audio('../assets/sound/lost.mp3');
/*
Пример использования
hitSound.play(); // Проиграть звук удара
healSound.play(); // Проиграть звук исцеления
winSound.play(); // Проиграть звук победы
*/

closeButton.addEventListener('click', function() {
    alertMessage.style.display = 'none';
});