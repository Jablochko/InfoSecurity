// const BASE_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя ";

// function shiftSymbol(symbol, shift) {
//     const num = BASE_ALPHABET.indexOf(symbol);
//     const difference = num + shift - BASE_ALPHABET.length;
//     if (shift > 0 && difference >= 0) {
//         return BASE_ALPHABET[difference];
//     }
//     if (shift < 0 && difference < -BASE_ALPHABET.length) {
//         return BASE_ALPHABET[BASE_ALPHABET.length + num + shift];
//     }
//     return BASE_ALPHABET[num + shift];
// }

// function textCrypt(text, key, isEncrypt = false) {
//     const mode = isEncrypt ? 1 : -1;
//     let result = "";
//     for (let i = 0; i < text.length; i++) {
//         const symbol = text[i];
//         const shift =
//             (BASE_ALPHABET.indexOf(key[i]) + 1) % BASE_ALPHABET.length;
//         result += shiftSymbol(symbol, mode * shift);
//     }
//     return result;
// }

// function handleCrypt() {
//     const inputText = document.getElementById("inputText").value;
//     let encryptKey = document.getElementById("encryptKey").value;
//     encryptKey = encryptKey.repeat(
//         Math.ceil(inputText.length / encryptKey.length)
//     );

//     document.getElementById("encryptedKeyOutput").innerText = `${encryptKey}`;

//     const encryptedText = textCrypt(inputText, encryptKey, true);
//     document.getElementById("encryptedOutput").innerText = `${encryptedText}`;

//     const decryptedText = textCrypt(encryptedText, encryptKey, false);
//     document.getElementById("decryptedOutput").innerText = `${decryptedText}`;
// }

// Функция для создания квадрата Виженера
function createVigenereSquare() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const square = [];

    for (let i = 0; i < alphabet.length; i++) {
        const row = alphabet.slice(i) + alphabet.slice(0, i);
        square.push(row);
    }

    return square;
}

// Функция для дешифровки текста с использованием квадрата Виженера
function decryptVigenereCipher(ciphertext, key) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const square = createVigenereSquare();
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, ""); // убираем все ненужные символы

    let decryptedText = "";
    let keyIndex = 0;

    for (let i = 0; i < ciphertext.length; i++) {
        const cipherChar = ciphertext[i];
        const keyChar = key[keyIndex % key.length];
        const cipherIndex = alphabet.indexOf(cipherChar);
        const keyIndexInSquare = alphabet.indexOf(keyChar);

        // Дешифруем символ
        decryptedText += square[keyIndexInSquare].charAt(cipherIndex);

        keyIndex++;
    }

    return decryptedText;
}

// Функция для нахождения возможного ключа с использованием частотного анализа
function breakVigenereSquare(ciphertext) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const square = createVigenereSquare();
    const possibleKeys = [];
    const cipherText = ciphertext.toUpperCase().replace(/[^A-Z]/g, ""); // убираем все ненужные символы

    for (let keyLength = 1; keyLength <= 10; keyLength++) {
        let key = "";
        for (let i = 0; i < keyLength; i++) {
            const substring = cipherText.substring(
                i,
                cipherText.length,
                keyLength
            );
            const frequencies = getFrequencyAnalysis(substring);
            const mostCommonChar = getMostCommonChar(frequencies);
            key += alphabet[mostCommonChar];
        }
        possibleKeys.push(key);
    }

    return possibleKeys;
}

// Частотный анализ для поиска наиболее встречающихся символов
function getFrequencyAnalysis(text) {
    const frequency = {};
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Считаем количество вхождений каждого символа
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (alphabet.includes(char)) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }

    // Сортируем по частоте
    const frequenciesArray = Object.entries(frequency).sort(
        (a, b) => b[1] - a[1]
    );

    return frequenciesArray;
}

// Функция для получения наиболее встречающегося символа
function getMostCommonChar(frequencies) {
    return frequencies[0][0];
}

// Пример использования
const ciphertext = "RIJVS";
const possibleKeys = breakVigenereSquare(ciphertext);

// Дешифровка с использованием одного из найденных ключей
const decryptedText = decryptVigenereCipher(ciphertext, possibleKeys[0]);
console.log(decryptedText);
