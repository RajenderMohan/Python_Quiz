document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const questionNumberElement = document.getElementById('question-number');
    const totalQuestionsElement = document.getElementById('total-questions');
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const progressBar = document.getElementById('progress-bar');

    // Audio Elements
    const audioElements = {
        correct: document.getElementById('correct-sound'),
        incorrect: document.getElementById('incorrect-sound'),
        warning: document.getElementById('warning-sound')
    };

    // Verify audio elements
    Object.entries(audioElements).forEach(([type, element]) => {
        if (!element) {
            console.error(`${type} sound element not found`);
        } else {
            element.volume = 0.7;
            element.load(); // Force load audio
        }
    });

    // Quiz State
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let selectedOption = null;
    let timer;
    const questionTime = 30; // 30 seconds per question
    const warningTime = 10; // Warn at 10 seconds

    // Audio Functions
    function playSound(type) {
        const sound = audioElements[type];
        if (!sound) {
            console.error(`Audio element for ${type} not found`);
            return;
        }

        sound.currentTime = 0; // Reset to start
        sound.play().catch(e => console.error(`Failed to play ${type} sound:`, e));
    }

    // Timer Functions
    function startTimer() {
        clearInterval(timer);
        let timeLeft = questionTime;
        updateTimerDisplay(timeLeft);

        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            if (timeLeft === warningTime) {
                playSound('warning');
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                if (selectedOption === null) {
                    document.querySelector('#options button')?.click();
                }
            }
        }, 1000);
    }

    function updateTimerDisplay(seconds) {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${seconds}s`;
            timerElement.classList.toggle('text-red-500', seconds <= warningTime);
        }
    }

    function resetTimer() {
        clearInterval(timer);
        updateTimerDisplay(questionTime);
    }

    // Quiz Functions
    function showQuestion() {
        resetTimer();
        const question = questions[currentQuestionIndex];

        // Update UI
        questionElement.textContent = question.question;
        questionNumberElement.textContent = currentQuestionIndex + 1;
        totalQuestionsElement.textContent = questions.length;
        scoreElement.textContent = score;
        feedbackElement.classList.add('hidden');
        selectedOption = null;

        // Update progress
        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

        // Create options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn w-full p-4 mb-3 text-left rounded-lg border border-gray-300 hover:border-blue-400 transition';
            button.innerHTML = `
                <span class="text-blue-600 font-medium mr-3">${String.fromCharCode(65 + index)}.</span>
                <span>${option}</span>
            `;
            button.addEventListener('click', () => selectAnswer(index));
            optionsContainer.appendChild(button);
        });

        // Update navigation
        prevButton.classList.toggle('hidden', currentQuestionIndex === 0);
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
        nextButton.disabled = true;

        startTimer();
    }

    function selectAnswer(selectedIndex) {
        if (selectedOption !== null) return;

        selectedOption = selectedIndex;
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === question.answer;

        // Play feedback sound
        playSound(isCorrect ? 'correct' : 'incorrect');

        // Update score
        if (isCorrect) {
            score++;
            scoreElement.textContent = score;
        }

        // Visual feedback
        const options = optionsContainer.querySelectorAll('.option-btn');
        options.forEach((option, index) => {
            if (index === question.answer) {
                option.classList.add('bg-green-100', 'border-green-400');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('bg-red-100', 'border-red-400');
            }
            option.disabled = true;
        });

        // Show explanation
        feedbackElement.textContent = question.explanation;
        feedbackElement.className = isCorrect ?
            'p-4 mb-6 rounded-lg border-l-4 border-green-500 bg-green-50' :
            'p-4 mb-6 rounded-lg border-l-4 border-red-500 bg-red-50';
        feedbackElement.classList.remove('hidden');

        // Enable next button
        nextButton.disabled = false;
        clearInterval(timer);
    }

    // Navigation
    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResults();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    // Load questions
    fetch('assets/data/questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            showQuestion();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            feedbackElement.textContent = 'Failed to load questions. Please try again.';
            feedbackElement.classList.remove('hidden');
        });

    function showResults() {
        quizContainer.innerHTML = `
            <div class="text-center p-8">
                <h2 class="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <div class="text-4xl font-bold text-blue-600 mb-6">${score}/${questions.length}</div>
                <p class="text-gray-600 mb-6">${getPerformanceMessage()}</p>
                <button onclick="location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                    Try Again
                </button>
            </div>
        `;
    }

    function getPerformanceMessage() {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 90) return 'Excellent work! You really know your stuff.';
        if (percentage >= 70) return 'Good job! You have solid understanding.';
        if (percentage >= 50) return 'Not bad! Keep practicing to improve.';
        return 'Keep learning! Review the material and try again.';
    }
});