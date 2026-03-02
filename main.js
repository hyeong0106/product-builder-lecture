document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers-container');
    const generateBtn = document.getElementById('generate-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // --- Lotto Logic ---
    if (numbersContainer && generateBtn) {
        const getNumberColor = (number) => {
            if (number <= 10) return '#fbc400';
            if (number <= 20) return '#69c8f2';
            if (number <= 30) return '#ff7272';
            if (number <= 40) return '#aaa';
            return '#b0d840';
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
            displayNumbers(generateNumbers());
        });

        displayNumbers(generateNumbers());
    }

    // --- Disqus Logic ---
    const disqusThread = document.getElementById('disqus_thread');
    if (disqusThread) {
        const loadDisqus = () => {
            var disqus_config = function () {
                this.page.url = window.location.href;
                this.page.identifier = window.location.pathname;
            };
            (function() {
                var d = document, s = d.createElement('script');
                s.src = 'https://productbuilder-7xuyaqptkc.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            })();
        };
        loadDisqus();
    }

    // --- Animal Face Test Logic ---
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
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
                alert("웹캠 시작 불가");
                resetWebcamUI();
            }
        }

        function stopWebcam() {
            if (webcam) { webcam.stop(); webcam = null; }
            if (animationId) cancelAnimationFrame(animationId);
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
                        predictionResult.textContent = `${topResult.className}상 (${probability}%)`;
                        labelContainer.innerHTML = '';
                        prediction.forEach(p => {
                            const div = document.createElement('div');
                            div.innerHTML = `<span>${p.className}</span><span>${Math.round(p.probability * 100)}%</span>`;
                            labelContainer.appendChild(div);
                        });
                        spinner.classList.add('hidden');
                        resultArea.classList.remove('hidden');
                    };
                } catch (error) { resetTest(); }
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
    }
});
