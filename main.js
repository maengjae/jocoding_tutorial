const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const generateBtn = document.getElementById('generate-btn');

function generateLottoNumbers() {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 49) + 1);
    }

    for (const number of numbers) {
        const lottoNumber = document.createElement('div');
        lottoNumber.classList.add('lotto-number');
        lottoNumber.textContent = number;
        lottoNumbersContainer.appendChild(lottoNumber);
    }
}

generateBtn.addEventListener('click', generateLottoNumbers);

generateLottoNumbers();
