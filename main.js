const drawButton = document.getElementById('draw-button');
const resultsDiv = document.getElementById('results');
const numbersDiv = document.querySelector('.numbers');
const bonusDiv = document.querySelector('.bonus-number');

drawButton.addEventListener('click', () => {
    resultsDiv.style.display = 'block';
    drawNumbers();
});

function drawNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const bonus = Math.floor(Math.random() * 45) + 1;

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    displayNumbers(sortedNumbers, bonus);
}

function displayNumbers(numbers, bonus) {
    numbersDiv.innerHTML = '';
    for (const number of numbers) {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'number';
        numberDiv.textContent = number;
        numbersDiv.appendChild(numberDiv);
    }

    bonusDiv.innerHTML = '';
    const bonusNumberDiv = document.createElement('div');
    bonusNumberDiv.className = 'bonus';
    bonusNumberDiv.textContent = bonus;
    bonusDiv.appendChild(bonusNumberDiv);
}