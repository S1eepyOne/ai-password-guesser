// This file handles user interactions on the webpage for the AI-based password guesser.

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startGuessing');
    const stopButton = document.getElementById('stopGuessing');
    const inputField = document.getElementById('passwordInput');
    const output = document.getElementById('output');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progressText');
    const successPopup = document.getElementById('successPopup');
    const popupMessage = document.getElementById('popupMessage');
    const closePopup = document.getElementById('closePopup');
    const infoButton = document.getElementById('infoButton');
    const infoPopup = document.getElementById('infoPopup');
    const closeInfoPopup = document.getElementById('closeInfoPopup');

    let workers = [];
    let totalGuesses = 0;
    let completedGuesses = 0;

    function updateProgressBar() {
        if (totalGuesses === 0) {
            return;
        }

        const progressValue = (completedGuesses / totalGuesses) * 100;
        progressBar.style.width = `${progressValue}%`;
        progressText.textContent = `${Math.floor(progressValue)}%`;

        // Update background color immediately when reaching 100%
        if (progressValue >= 100) {
            progressBar.style.background = 'linear-gradient(90deg, #00ff00, #00ff00)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, var(--primary-color) 0%, #27ae60 100%)';
        }
    }

    function displayOutput(message, isSuccess) {
        output.textContent = message;
        output.style.color = isSuccess ? '#00ff00' : '#ff0000';
    }

    function showPopup(guess) {
        popupMessage.textContent = `The password "${guess}" has been successfully guessed after ${completedGuesses.toLocaleString()} attempts!`;
        successPopup.classList.add('active');
    }

    function hidePopup() {
        successPopup.classList.remove('active');
    }

    closePopup.addEventListener('click', hidePopup);

    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            hidePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successPopup.classList.contains('active')) {
            hidePopup();
        }
    });

    // Consolidated state reset function
    function resetState() {
        workers.forEach(worker => worker.terminate());
        workers = [];
        completedGuesses = 0;
        totalGuesses = 0;
        resetProgressBar();
        output.textContent = "";
        output.style.color = '#fff';
    }

    // Unified popup handler
    function handlePopupClick(popup, hideFunction) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hideFunction();
            }
        });
    }

    // Simplified progress bar reset
    function resetProgressBar() {
        progressBar.style.width = "0%";
        progressBar.style.display = "block";
        progressBar.style.background = "var(--gradient-primary)";
        progressText.textContent = "0%";
    }

    startButton.addEventListener('click', () => {
        resetState();
        
        // Ensure progress bar and container are visible
        document.getElementById('progressContainer').style.display = 'block';
        progressBar.style.display = 'block';
        output.textContent = "AI is guessing...";

        const password = inputField.value;
        const validCharacters = /^[a-zA-Z0-9!@#$%^&*()]+$/;
        if (password.length !== 5 || !validCharacters.test(password)) {
            alert("Please enter a valid 5-character password using letters, numbers, or symbols.");
            return;
        }

        const characterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const numWorkers = 4;
        const chunkSize = Math.ceil(characterSet.length / numWorkers);
        totalGuesses = Math.pow(characterSet.length, password.length);

        if (!characterSet || !password) {
            return;
        }

        let workerProgress = Array(numWorkers).fill(0);

        for (let i = 0; i < numWorkers; i++) {
            const worker = new Worker('scripts/worker.js');
            const chunk = characterSet.slice(i * chunkSize, (i + 1) * chunkSize);

            worker.postMessage({ password, characterSet: chunk });

            worker.onmessage = (event) => {
                const { progress, guess, found } = event.data;

                if (found) {
                    displayOutput(`Password guessed: ${guess}`, true);
                    showPopup(guess);
                    workers.forEach((w) => w.terminate());
                    workers = [];
                } else {
                    workerProgress[i] = progress; // Update progress for this worker
                    completedGuesses = workerProgress.reduce((sum, p) => 
                        sum + Math.floor((p / 100) * (totalGuesses / numWorkers)), 0);
                    requestAnimationFrame(updateProgressBar);
                }
            };

            worker.onerror = () => {
                displayOutput('An error occurred while guessing', false);
                workers.forEach((w) => w.terminate());
                workers = [];
            };

            workers.push(worker);
        }
    });

    stopButton.addEventListener('click', () => {
        resetState();
        displayOutput('Guessing stopped by the user.', false);
        
        // Ensure the progress bar container stays visible
        document.getElementById('progressContainer').style.display = 'block';
    });

    function showInfoPopup() {
        infoPopup.classList.add('active');
    }

    function hideInfoPopup() {
        infoPopup.classList.remove('active');
    }

    infoButton.addEventListener('click', showInfoPopup);
    closeInfoPopup.addEventListener('click', hideInfoPopup);

    // Unified popup handlers
    handlePopupClick(successPopup, hidePopup);
    handlePopupClick(infoPopup, hideInfoPopup);

    // Single keyboard event handler for all popups
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (successPopup.classList.contains('active')) hidePopup();
            if (infoPopup.classList.contains('active')) hideInfoPopup();
        }
    });
});

function* generatePasswords(characters, maxLength) {
    function* helper(prefix, length) {
        if (length === 0) {
            yield prefix;
            return;
        }
        for (const char of characters) {
            yield* helper(prefix + char, length - 1);
        }
    }
    for (let length = 1; length <= maxLength; length++) {
        yield* helper("", length);
    }
}

let guessingInterval;

// Create a Web Worker for parallelized guessing
function createWorker(charset, passwordInput, batchSize, onProgress, onSuccess, onFailure) {
    const worker = new Worker('scripts/worker.js');
    worker.postMessage({ charset, passwordInput, batchSize });

    worker.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'progress') {
            onProgress(data.progress);
        } else if (type === 'success') {
            onSuccess(data.guessedPassword);
            worker.terminate();
        } else if (type === 'failure') {
            onFailure();
            worker.terminate();
        }
    };

    return worker;
}