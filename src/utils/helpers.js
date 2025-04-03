// Utility functions for the AI Password Guesser application.

export function randomDigit() {
    return Math.floor(Math.random() * 10);
}

export function formatOutput(guess, isCorrect) {
    return isCorrect ? `Correct guess: ${guess}` : `Incorrect guess: ${guess}`;
}