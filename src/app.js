import PasswordGuesser from './ai/passwordGuesser';
const { formatOutput } = require('./utils/helpers');

const targetPassword = '1234'; // Example target password
const passwordGuesser = new PasswordGuesser(targetPassword);

document.addEventListener('DOMContentLoaded', () => {
    const guessButton = document.getElementById('guess-button');
    const guessInput = document.getElementById('guess-input');
    const resultDisplay = document.getElementById('result-display');

    guessButton.addEventListener('click', () => {
        const guess = guessInput.value;
        const result = passwordGuesser.evaluateGuess(guess);
        resultDisplay.textContent = formatOutput(result);
    });
});