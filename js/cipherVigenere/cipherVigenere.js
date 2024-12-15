const BASE_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя ";

function shiftSymbol(symbol, shift) {
    const num = BASE_ALPHABET.indexOf(symbol);
    const difference = num + shift - BASE_ALPHABET.length;
    if (shift > 0 && difference >= 0) {
        return BASE_ALPHABET[difference];
    }
    if (shift < 0 && difference < -BASE_ALPHABET.length) {
        return BASE_ALPHABET[BASE_ALPHABET.length + num + shift];
    }
    return BASE_ALPHABET[num + shift];
}

function textCrypt(text, key, isEncrypt = false) {
    const mode = isEncrypt ? 1 : -1;
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const symbol = text[i];
        const shift =
            (BASE_ALPHABET.indexOf(key[i]) + 1) % BASE_ALPHABET.length;
        result += shiftSymbol(symbol, mode * shift);
    }
    return result;
}

function handleCrypt() {
    const inputText = document.getElementById("inputText").value;
    let encryptKey = document.getElementById("encryptKey").value;
    encryptKey = encryptKey.repeat(
        Math.ceil(inputText.length / encryptKey.length)
    );

    document.getElementById("encryptedKeyOutput").innerText = `${encryptKey}`;

    const encryptedText = textCrypt(inputText, encryptKey, true);
    document.getElementById("encryptedOutput").innerText = `${encryptedText}`;

    const decryptedText = textCrypt(encryptedText, encryptKey, false);
    document.getElementById("decryptedOutput").innerText = `${decryptedText}`;
}
