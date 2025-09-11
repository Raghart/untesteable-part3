export const diceRoll = () => Math.floor(Math.random() * 6) + 1;
export const handleDiceValue = (diceValue1, diceValue2) => {
    if (typeof diceValue1 !== "number" || typeof diceValue2 !== "number") throw new Error("dice values must be numbers"); 
    if (diceValue1 === diceValue2) return 100 + diceValue1;
    return Math.max(diceValue1, diceValue2);
};