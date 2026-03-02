document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers-container');
    const generateBtn = document.getElementById('generate-btn');

    const getNumberColor = (number) => {
        if (number <= 10) return '#fbc400'; // 노란색
        if (number <= 20) return '#69c8f2'; // 파란색
        if (number <= 30) return '#ff7272'; // 빨간색
        if (number <= 40) return '#aaa'; // 회색
        return '#b0d840'; // 녹색
    };

    const generateNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    };

    const displayNumbers = (numbers) => {
        numbersContainer.innerHTML = '';
        numbers.forEach((number, index) => {
            setTimeout(() => {
                const circle = document.createElement('div');
                circle.classList.add('number-circle');
                circle.textContent = number;
                circle.style.backgroundColor = getNumberColor(number);
                circle.style.animation = `fadeIn 0.5s ease-in-out`;
                numbersContainer.appendChild(circle);
            }, index * 200); // 번호가 순차적으로 나타나도록 지연 추가
        });
    };

    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateNumbers();
        displayNumbers(lottoNumbers);
    });

    // 초기 로드 시 번호 생성
    displayNumbers(generateNumbers());
});
