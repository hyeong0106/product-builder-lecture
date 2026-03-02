document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers-container');
    const generateBtn = document.getElementById('generate-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // --- Contact Form Logic ---
    const toggleContactBtn = document.getElementById('toggle-contact-btn');
    const contactFormContainer = document.getElementById('contact-form-container');

    toggleContactBtn.addEventListener('click', () => {
        contactFormContainer.classList.toggle('hidden');
        toggleContactBtn.textContent = contactFormContainer.classList.contains('hidden') 
            ? '제휴 문의하기' 
            : '문의 창 닫기';
    });

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

    // --- Disqus Logic ---
    const loadDisqus = () => {
        /**
         *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
         *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
         */
        
        var disqus_config = function () {
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = 'lotto-generator-index'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        
        (function() { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            // IMPORTANT: Replace 'productbuilder-7xuyaqptkc' with your own Disqus shortname.
            s.src = 'https://productbuilder-7xuyaqptkc.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    };

    // Initial generation and load disqus
    displayNumbers(generateNumbers());
    loadDisqus();

    // --- Animal Face Test Logic ---
    const URL = "https://teachablemachine.withgoogle.com/models/w4SCtq2nK/";
    let model, maxPredictions;

    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const resultArea = document.getElementById('result-area');
    const previewImage = document.getElementById('preview-image');
    const predictionResult = document.getElementById('prediction-result');
    const retryBtn = document.getElementById('retry-btn');
    const spinner = document.getElementById('loading-spinner');

    async function initModel() {
        if (model) return;
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show spinner and hide upload area
        uploadArea.classList.add('hidden');
        spinner.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = async (event) => {
            previewImage.src = event.target.result;
            
            try {
                await initModel();
                
                // Create a temporary image element to predict
                const img = new Image();
                img.src = event.target.result;
                img.onload = async () => {
                    const prediction = await model.predict(img);
                    
                    // Sort predictions to get the highest one
                    prediction.sort((a, b) => b.probability - a.probability);
                    
                    const topResult = prediction[0];
                    const probability = Math.round(topResult.probability * 100);
                    
                    let resultText = "";
                    if (topResult.className === "강아지") {
                        resultText = `🐶 당신은 ${probability}% 확률로 강아지상입니다!`;
                    } else if (topResult.className === "고양이") {
                        resultText = `🐱 당신은 ${probability}% 확률로 고양이상입니다!`;
                    } else {
                        resultText = `🤔 당신은 ${probability}% 확률로 ${topResult.className}상입니다!`;
                    }

                    predictionResult.textContent = resultText;
                    spinner.classList.add('hidden');
                    resultArea.classList.remove('hidden');
                };
            } catch (error) {
                console.error("Model prediction failed:", error);
                alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
                resetTest();
            }
        };
        reader.readAsDataURL(file);
    });

    function resetTest() {
        uploadArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        spinner.classList.add('hidden');
        imageUpload.value = "";
    }

    retryBtn.addEventListener('click', resetTest);
});
