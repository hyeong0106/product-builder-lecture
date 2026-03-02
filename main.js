document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers-container');
    const generateBtn = document.getElementById('generate-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // --- Lotto Logic ---
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
            }, index * 150);
        });
    };

    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateNumbers();
        displayNumbers(lottoNumbers);
    });

    // Initial generation
    displayNumbers(generateNumbers());
});
