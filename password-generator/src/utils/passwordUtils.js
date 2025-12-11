// utilities to generate passwords & estimate entropy
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?|";



export function generatePassword({ length = 16, useUpper = true, useLower = true, useNumbers = true, useSymbols = false } = {}) {
    let charset = "";
    if (useUpper) charset += UPPER;
    if (useLower) charset += LOWER;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    if (!charset) {
        // fallback to lowercase if nothing selected
        charset = LOWER;
    }

    // ensure at least one of each selected category appears
    const required = [];
    if (useUpper) required.push(randomChar(UPPER));
    if (useLower) required.push(randomChar(LOWER));
    if (useNumbers) required.push(randomChar(NUMBERS));
    if (useSymbols) required.push(randomChar(SYMBOLS));

    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(randomChar(charset));
    }

    // replace the first N chars with required characters to ensure presence
    for (let i = 0; i < required.length && i < result.length; i++) {
        result[i] = required[i];
    }

    // shuffle
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join("");
}

function randomChar(str) {
    const idx = Math.floor(Math.random() * str.length);
    return str[idx];
}

export function calculateEntropy(password = "", { useUpper = true, useLower = true, useNumbers = true, useSymbols = false } = {}) {
    // approximate entropy: log2(charset_size^length) = length * log2(charset_size)
    let charsetSize = 0;
    if (useUpper) charsetSize += UPPER.length;
    if (useLower) charsetSize += LOWER.length;
    if (useNumbers) charsetSize += NUMBERS.length;
    if (useSymbols) charsetSize += SYMBOLS.length;
    if (charsetSize === 0) charsetSize = LOWER.length;
    const entropy = password.length * Math.log2(charsetSize || 1);
    return entropy;
}
