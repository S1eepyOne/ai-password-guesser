import { CHARACTER_SET, PASSWORD_LENGTH } from './config.js';

onmessage = (e) => {
    const { password, characterSet = CHARACTER_SET, batchSize, progressUpdateInterval } = e.data;

    if (!characterSet || !password) {
        postMessage({ progress: 100, found: false });
        return;
    }

    const totalGuesses = Math.pow(CHARACTER_SET.length, PASSWORD_LENGTH - 1) * characterSet.length;
    let currentGuessCount = 0;

    function* generateGuesses(firstChars, restChars, length) {
        if (!firstChars || !restChars || length === 0) {
            return;
        }

        const indices = new Array(length).fill(0);

        for (const firstChar of firstChars) {
            indices[0] = -1;

            while (true) {
                const guess = firstChar + indices.slice(1).map(i => restChars[i]).join('');
                yield guess;

                let pos = length - 1;
                while (pos >= 1 && ++indices[pos] === restChars.length) {
                    indices[pos] = 0;
                    pos--;
                }
                if (pos === 0) break;
            }
        }
    }

    const generator = generateGuesses(characterSet, CHARACTER_SET, PASSWORD_LENGTH);

    for (const guess of generator) {
        currentGuessCount++;

        if (guess === password) {
            postMessage({ progress: 100, guess, found: true });
            return;
        }

        if (currentGuessCount % batchSize === 0) {
            const progress = (currentGuessCount / totalGuesses) * 100;

            if (currentGuessCount % progressUpdateInterval === 0) {
                postMessage({ progress, guess, found: false });
            }
        }
    }

    postMessage({ progress: 100, found: false });
};
