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
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let workers = [];
    let totalGuesses = 0;
    let completedGuesses = 0;
    let lastProgressValue = 0;
    let lastUpdate = 0;

    function updateProgressBar() {
        const progressValue = (completedGuesses / totalGuesses) * 100;

        if (Math.abs(progressValue - lastProgressValue) >= 1) {
            progressBar.style.width = `${progressValue}%`;
            progressText.textContent = `${Math.floor(progressValue)}%`;
            lastProgressValue = progressValue;
            lastUpdate = Date.now();
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
        terminateWorkers();
        completedGuesses = 0;
        totalGuesses = 0;
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

    function setInputFieldState(isDisabled) {
        inputField.disabled = isDisabled;
    }

    function terminateWorkers() {
        workers.forEach((w) => w.terminate());
        workers = [];
    }

    function isValidPassword(password) {
        const validCharacters = /^[a-zA-Z0-9!@#$%^&*()]+$/;
        return password.length === 5 && validCharacters.test(password);
    }

    startButton.addEventListener('click', () => {
        resetState();

        // Disable the password input field when guessing starts
        setInputFieldState(true);

        // Ensure progress bar and container are visible
        document.getElementById('progressContainer').style.display = 'block';
        progressBar.style.display = 'block';
        output.textContent = "AI is guessing...";

        const password = inputField.value;
        if (!isValidPassword(password)) {
            alert("Please enter a valid 5-character password using letters, numbers, or symbols.");
            setInputFieldState(false); // Re-enable the input field if validation fails
            return;
        }

        const characterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const numWorkers = 4;
        const chunkSize = Math.ceil(characterSet.length / numWorkers);
        totalGuesses = Math.pow(characterSet.length, password.length);

        if (!characterSet || !password) {
            setInputFieldState(false); // Re-enable the input field if no password is provided
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
                    terminateWorkers();
                    setInputFieldState(false); // Re-enable the input field when guessing is complete
                } else {
                    workerProgress[i] = progress; // Update progress for this worker
                    completedGuesses = workerProgress.reduce((sum, p) => 
                        sum + Math.floor((p / 100) * (totalGuesses / numWorkers)), 0);
                    
                    // Throttle updates to every 100ms
                    if (Date.now() - lastUpdate > 100) {
                        requestAnimationFrame(updateProgressBar);
                    }
                }
            };

            worker.onerror = () => {
                displayOutput('An error occurred while guessing', false);
                terminateWorkers();
                setInputFieldState(false); // Re-enable the input field if an error occurs
            };

            workers.push(worker);
        }
    });

    stopButton.addEventListener('click', () => {
        resetState();
        displayOutput('Guessing stopped by the user.', false);

        // Re-enable the password input field when guessing stops
        setInputFieldState(false);

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

    inputField.addEventListener('input', () => {
        updateStrengthMeter(inputField.value);
    });

    function calculateStrength(password) {
        let score = 0;

        // Check for length
        if (password.length >= 5) score += 1;

        // Check for lowercase and uppercase letters
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;

        // Check for numbers
        if (/\d/.test(password)) score += 1;

        // Check for special characters
        if (/[@#$%^&*()!]/.test(password)) score += 1;

        // Determine strength level
        switch (score) {
            case 1:
                return { percent: 20, color: 'red', label: 'Very Weak' };
            case 2:
                return { percent: 40, color: 'orange', label: 'Weak' };
            case 3:
                return { percent: 60, color: 'yellow', label: 'Moderate' };
            case 4:
                return { percent: 80, color: 'lightgreen', label: 'Strong' };
            case 5:
                return { percent: 100, color: 'green', label: 'Very Strong' };
            default:
                return { percent: 0, color: 'red', label: 'N/A' };
        }
    }

    function updateStrengthMeter(password) {
        const strength = calculateStrength(password);
        strengthBar.style.width = `${strength.percent}%`;
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = `Strength: ${strength.label}`;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (successPopup.classList.contains('active')) hidePopup();
        if (infoPopup.classList.contains('active')) hideInfoPopup();
    }
});
