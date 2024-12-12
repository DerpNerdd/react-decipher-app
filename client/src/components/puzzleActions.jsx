export function skipPuzzle(setLevel, startNewPuzzle, setPuzzleSolved, setFeedback) {
    setPuzzleSolved(true);
    setFeedback("Skipped! Moving to next puzzle...");
    setTimeout(() => {
        setLevel(prev => prev + 1);
        startNewPuzzle();  
    }, 1000);
}

export function giveHint(originalWord, guess, usedHintPositions) {
    const cleanedOriginal = originalWord.replace(/\s+/g, '').toUpperCase();
    const currentGuess = guess.toUpperCase();
    
    // Identify positions where user might not know the letter
    const unrevealedPositions = [];
    for (let i = 0; i < cleanedOriginal.length; i++) {
        const originalChar = cleanedOriginal[i];
        const guessChar = currentGuess[i] || ' ';
        // If guessChar matches originalChar, no need for a hint
        // Also ensure we haven't used a hint for this position before
        if (guessChar !== originalChar && !usedHintPositions.has(i)) {
            unrevealedPositions.push(i);
        }
    }

    if (unrevealedPositions.length === 0) {
        return null;
    }

    // Pick a random position to reveal
    const randomPos = unrevealedPositions[Math.floor(Math.random() * unrevealedPositions.length)];
    const revealedChar = cleanedOriginal[randomPos];
    const letterPosition = randomPos + 1; 
    
    return { position: letterPosition, char: revealedChar, index: randomPos };
}
