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
    let model, webcam, labelContainer, maxPredictions;
    let isWebcamMode = false;
    let animationId;

    const modeUploadBtn = document.getElementById('mode-upload-btn');
    const modeWebcamBtn = document.getElementById('mode-webcam-btn');
    const uploadMode = document.getElementById('upload-mode');
    const webcamMode = document.getElementById('webcam-mode');
    const webcamContainer = document.getElementById('webcam-container');
    const startWebcamBtn = document.getElementById('start-webcam-btn');
    const stopWebcamBtn = document.getElementById('stop-webcam-btn');
    
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const resultArea = document.getElementById('result-area');
    const previewImage = document.getElementById('preview-image');
    const predictionResult = document.getElementById('prediction-result');
    const retryBtn = document.getElementById('retry-btn');
    const spinner = document.getElementById('loading-spinner');
    labelContainer = document.getElementById('label-container');

    // Mode Toggling
    modeUploadBtn.addEventListener('click', () => {
        isWebcamMode = false;
        modeUploadBtn.classList.add('active');
        modeWebcamBtn.classList.remove('active');
        uploadMode.classList.remove('hidden');
        webcamMode.classList.add('hidden');
        stopWebcam();
        resetTest();
    });

    modeWebcamBtn.addEventListener('click', () => {
        isWebcamMode = true;
        modeWebcamBtn.classList.add('active');
        modeUploadBtn.classList.remove('active');
        webcamMode.classList.remove('hidden');
        uploadMode.classList.add('hidden');
        resetTest();
    });

    async function initModel() {
        if (model) return;
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }

    // --- Webcam Logic ---
    async function startWebcam() {
        startWebcamBtn.classList.add('hidden');
        spinner.classList.remove('hidden');
        
        try {
            await initModel();
            
            const flip = true;
            webcam = new tmImage.Webcam(300, 300, flip);
            await webcam.setup();
            await webcam.play();
            
            spinner.classList.add('hidden');
            stopWebcamBtn.classList.remove('hidden');
            webcamContainer.appendChild(webcam.canvas);
            
            labelContainer.innerHTML = '';
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }
            
            loop();
        } catch (error) {
            console.error("Webcam init failed:", error);
            alert("웹캠을 시작할 수 없습니다. 권한을 확인해주세요.");
            resetWebcamUI();
        }
    }

    function stopWebcam() {
        if (webcam) {
            webcam.stop();
            webcam = null;
        }
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        webcamContainer.innerHTML = '';
        labelContainer.innerHTML = '';
        resetWebcamUI();
    }

    function resetWebcamUI() {
        startWebcamBtn.classList.remove('hidden');
        stopWebcamBtn.classList.add('hidden');
        spinner.classList.add('hidden');
    }

    async function loop() {
        if (webcam && webcam.canvas) {
            webcam.update();
            await predictWebcam();
            animationId = window.requestAnimationFrame(loop);
        }
    }

    async function predictWebcam() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const className = prediction[i].className;
            const prob = prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = `<span>${className}</span><span>${Math.round(prob * 100)}%</span>`;
        }
    }

    startWebcamBtn.addEventListener('click', startWebcam);
    stopWebcamBtn.addEventListener('click', stopWebcam);

    // --- Image Upload Logic ---
    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        uploadArea.classList.add('hidden');
        spinner.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = async (event) => {
            previewImage.src = event.target.result;
            
            try {
                await initModel();
                const img = new Image();
                img.src = event.target.result;
                img.onload = async () => {
                    const prediction = await model.predict(img);
                    prediction.sort((a, b) => b.probability - a.probability);
                    
                    const topResult = prediction[0];
                    const probability = Math.round(topResult.probability * 100);
                    
                    let resultText = "";
                    if (topResult.className === "강아지") resultText = `🐶 강아지상 (${probability}%)`;
                    else if (topResult.className === "고양이") resultText = `🐱 고양이상 (${probability}%)`;
                    else resultText = `🤔 ${topResult.className}상 (${probability}%)`;

                    predictionResult.textContent = resultText;
                    
                    // Show detailed labels even for upload
                    labelContainer.innerHTML = '';
                    prediction.forEach(p => {
                        const div = document.createElement('div');
                        div.innerHTML = `<span>${p.className}</span><span>${Math.round(p.probability * 100)}%</span>`;
                        labelContainer.appendChild(div);
                    });

                    spinner.classList.add('hidden');
                    resultArea.classList.remove('hidden');
                };
            } catch (error) {
                console.error("Prediction failed:", error);
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
        predictionResult.textContent = "";
        labelContainer.innerHTML = '';
    }

    retryBtn.addEventListener('click', resetTest);
});
