// This file handles the password guessing logic in a separate thread using Web Workers.

onmessage = (e) => {
    const { password, characterSet } = e.data;

    if (!characterSet || !password) {
        postMessage({ progress: 100, found: false });
        return;
    }

    // Ensure we're using the full character set for each position except the first
    const fullCharSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const totalGuesses = Math.pow(fullCharSet.length, password.length - 1) * characterSet.length;
    let currentGuessCount = 0;

    function* generateGuesses(firstChars, restChars, length) {
        if (!firstChars || !restChars || length === 0) {
            return;
        }

        const indices = new Array(length).fill(0);
        
        // For each character in our assigned subset
        for (const firstChar of firstChars) {
            indices[0] = -1; // Will be incremented to 0 in the main loop
            
            while (true) {
                // Generate the current guess
                const guess = firstChar + indices.slice(1).map(i => restChars[i]).join('');
                yield guess;

                // Move to next combination
                let pos = length - 1;
                while (pos >= 1 && ++indices[pos] === restChars.length) {
                    indices[pos] = 0;
                    pos--;
                }
                if (pos === 0) break;
            }
        }
    }

    const generator = generateGuesses(characterSet, fullCharSet, password.length);

    for (const guess of generator) {
        currentGuessCount++;
        const progress = (currentGuessCount / totalGuesses) * 100;

        if (guess === password) {
            postMessage({ progress: 100, guess, found: true });
            return;
        }

        // Send progress updates every 10,000 guesses to reduce overhead
        if (currentGuessCount % 10000 === 0) {
            postMessage({ progress, guess, found: false });
        }
    }

    postMessage({ progress: 100, found: false });
};
