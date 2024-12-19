const BASE_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

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

function encryptText() {
    const inputText = document.getElementById("inputText").value;
    let encryptKey = document.getElementById("encryptKey").value;
    encryptKey = encryptKey.repeat(
        Math.ceil(inputText.length / encryptKey.length)
    );

    document.getElementById(
        "encryptedKeyOutput"
    ).innerText = `Расширенный ключ: ${encryptKey}`;

    const encryptedText = textCrypt(inputText, encryptKey, true);
    document.getElementById(
        "encryptedOutput"
    ).innerText = `Зашифрованный текст: ${encryptedText}`;
    document.getElementById("decryptedOutput").innerText = ""; // Очищаем блок дешифрования
}

function decryptText() {
    const inputText = document.getElementById("inputText").value;
    let encryptKey = document.getElementById("encryptKey").value;
    encryptKey = encryptKey.repeat(
        Math.ceil(inputText.length / encryptKey.length)
    );

    document.getElementById(
        "encryptedKeyOutput"
    ).innerText = `Расширенный ключ: ${encryptKey}`;

    const decryptedText = textCrypt(inputText, encryptKey, false);
    document.getElementById(
        "decryptedOutput"
    ).innerText = `Дешифрованный текст: ${decryptedText}`;
    document.getElementById("encryptedOutput").innerText = ""; // Очищаем блок шифрования
}

// const BASE_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

const frequencyRU = {
    о: 0.1118,
    е: 0.0875,
    а: 0.0764,
    и: 0.0709,
    н: 0.0678,
    т: 0.0609,
    с: 0.0497,
    л: 0.0496,
    в: 0.0438,
    р: 0.0423,
    к: 0.033,
    м: 0.0317,
    д: 0.0309,
    п: 0.0247,
    ы: 0.0236,
    у: 0.0222,
    б: 0.0201,
    я: 0.0196,
    ь: 0.0184,
    г: 0.0172,
    з: 0.0148,
    ч: 0.014,
    й: 0.0121,
    ж: 0.0101,
    х: 0.0095,
    ш: 0.0072,
    ю: 0.0047,
    ц: 0.0039,
    э: 0.0036,
    щ: 0.003,
    ф: 0.0021,
    ё: 0.002,
    ъ: 0.0002,
};

// Функция для сдвига символа с учётом алфавита
function shiftSymbol(symbol, shift) {
    const num = BASE_ALPHABET.indexOf(symbol);
    const newNum = (num + shift + BASE_ALPHABET.length) % BASE_ALPHABET.length; // Добавлено для корректного сдвига
    return BASE_ALPHABET[newNum];
}

// Функция шифрования и дешифрования текста
function textCrypt(text, key, isEncrypt = false) {
    const mode = isEncrypt ? 1 : -1;
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const symbol = text[i];
        const shift = BASE_ALPHABET.indexOf(key[i % key.length]) + 1; // Обрабатываем ключ циклично
        result += shiftSymbol(symbol, mode * shift);
    }
    return result;
}

// Функция для частотного анализа
function frequency(message) {
    const frequencyMap = {};
    const length = message.length;

    for (const char of BASE_ALPHABET) {
        const count = message.split(char).length - 1;
        frequencyMap[char] = count / length;
    }

    return frequencyMap;
}

// Функция для подсчета количества каждого символа в сообщении
function lettersCount(message) {
    const countMap = {};

    for (const char of BASE_ALPHABET) {
        const count = message.split(char).length - 1;
        countMap[char] = count;
    }

    return countMap;
}

// Функция для расчета индекса совпадений
function indexCoincidence(message) {
    const lettersCountMap = lettersCount(message);
    const length = message.length;

    if (length <= 1) {
        return 0;
    }

    let coincidenceIndex = 0;
    for (const char of BASE_ALPHABET) {
        const count = lettersCountMap[char] || 0;
        coincidenceIndex += (count * (count - 1)) / (length * (length - 1));
    }

    return coincidenceIndex;
}

function columnRepresentation(message, step, start = 0) {
    let result = "";

    for (let i = start; i < message.length; i += step) {
        result += message[i];
    }

    console.log(`Столбец для сдвига ${start}: ${result}`); // Вывод столбца в консоль
    return result;
}

function findVigenereKeyLength(ciphertext, searchBorder = 0.5) {
    const shiftedCoincidence = shiftedIndexCoincidence(ciphertext);

    console.log("Индекс совпадений для различных сдвигов:", shiftedCoincidence);

    const keyLengths = Object.entries(shiftedCoincidence).filter(
        ([length, coincidence]) =>
            Math.abs(coincidence - 0.0533) < 0.0533 * searchBorder
    );

    console.log("Подходящие длины ключа:", keyLengths);

    if (keyLengths.length === 0) {
        console.error("Не удалось найти подходящие длины ключа.");
        return 0; // Возвращаем 0, если не нашли подходящих ключей
    }

    const probableLength = keyLengths.reduce((best, current) =>
        current[1] < best[1] ? current : best
    );

    return parseInt(probableLength[0]);
}

// Функция для восстановления ключа с помощью анализа на шифре Цезаря
function recoverVigenereKey(ciphertext, keyLength) {
    const result = [];

    for (let k = 0; k < keyLength; k++) {
        const msg = columnRepresentation(ciphertext, keyLength, k);
        const tmp = breakCaesar(msg);
        result.push(BASE_ALPHABET[tmp[0]]);
    }

    return result.join("");
}

// Функция для расшифровки текста с помощью шифра Цезаря
function breakCaesar(ciphertext) {
    const variants = [];

    for (let i = 0; i < BASE_ALPHABET.length; i++) {
        const decrypted = textCrypt(
            ciphertext,
            BASE_ALPHABET[i].repeat(ciphertext.length),
            false
        );

        const messageFrequency = frequency(decrypted);
        const correlation = alphabetCorrelation(messageFrequency);

        variants.push({ key: i, correlation });
    }

    return variants.reduce((best, current) =>
        current.correlation > best.correlation ? current : best
    );
}

function shiftedIndexCoincidence(message) {
    const result = {};

    // Перебираем все сдвиги от 1 до 25
    for (let i = 1; i <= 25; i++) {
        // Разбиваем текст на столбцы с шагом i
        const msg = columnRepresentation(message, i, 0);
        // Вычисляем индекс совпадений для этого столбца
        const coincidence = indexCoincidence(msg);
        result[i] = coincidence;
        console.log(`Сдвиг ${i}: Индекс совпадений = ${coincidence}`);
    }

    return result;
}

// Функция для вычисления корреляции частот
function alphabetCorrelation(messageFrequency) {
    let correlation = 0;

    for (const char of BASE_ALPHABET) {
        const englishFreq = frequencyRU[char] || 0;
        const msgFreq = messageFrequency[char] || 0;
        correlation += englishFreq * msgFreq;
    }

    return correlation;
}

// Основная функция для взлома шифра Виженера
function crackVigenereCipher() {
    const encryptedText = document.getElementById("inputText").value;
    const keyLength = findVigenereKeyLength(encryptedText, 0.5);
    const key = recoverVigenereKey(encryptedText, keyLength);

    document.getElementById(
        "hackedOutput"
    ).innerText = `Восстановленный ключ: ${key}`;

    const decryptedText = textCrypt(encryptedText, key, false);
    document.getElementById(
        "decryptedOutput"
    ).innerText = `Дешифрованный текст: ${decryptedText}`;
}
