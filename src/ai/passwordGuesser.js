class PasswordGuesser {
    constructor(targetPassword) {
        this.targetPassword = targetPassword;
        this.attempts = 0;
    }

    generateGuess() {
        let guess = '';
        for (let i = 0; i < 5; i++) { // Updated to 5 characters
            guess += Math.floor(Math.random() * 10).toString();
        }
        this.attempts++;
        return guess;
    }

    evaluateGuess(guess) {
        return guess === this.targetPassword;
    }

    getAttempts() {
        return this.attempts;
    }
}

export default PasswordGuesser;