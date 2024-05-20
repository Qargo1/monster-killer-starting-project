const logElement = document.getElementById('game-log');
const logForm = document.querySelector('.first-column-down');
const initialHeight = logForm.offsetHeight;
let logCounter = 0;


const alertMessage = document.getElementById('alert-message-popup');
const messageText = document.getElementById('game-message');
const closeButton = document.querySelector('.close-button');

function logMessage(message, color = 'black', fontSize = '1.2rem') {
    const newLine = document.createElement('li');
    newLine.textContent = message;
    newLine.style.color = color;
    newLine.style.fontSize = fontSize;
    const currentHeight = logForm.offsetHeight;

    if (currentHeight <= 280 && logCounter >= 4) {
        logElement.removeChild(logElement.firstChild);
        logCounter++;
        logElement.appendChild(newLine);
        return;
    } else if (logCounter < 10 && currentHeight >= 300 && currentHeight < 380) {
        const newHeight = currentHeight + 10;
        logForm.style.height = newHeight + 'px';
    } else if (logCounter >= 10 && currentHeight >= 350) {
        logElement.removeChild(logElement.firstChild);
    }
    logCounter++;
    logElement.appendChild(newLine);
}

function showMessage(messageThisColor, messageThisOutColor, color = 'black') {
    const fullMessage = `<span style="color:${color}">${messageThisColor}</span>${messageThisOutColor}`;
    messageText.innerHTML = fullMessage;
    alertMessage.style.display = 'flex';
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