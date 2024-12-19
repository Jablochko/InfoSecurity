function caesarCipher(text, shift, encrypt = true) {
    const alphabetRU = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const alphabetEN = "abcdefghijklmnopqrstuvwxyz";
    const shiftSign = encrypt ? 1 : -1;

    return [...text]
        .map((char) => {
            const lowerChar = char.toLowerCase();
            const isUpper = char !== lowerChar;

            const alphabet = alphabetRU.includes(lowerChar)
                ? alphabetRU
                : alphabetEN.includes(lowerChar)
                ? alphabetEN
                : null;

            if (!alphabet) return char; // Если символ не из алфавита

            const shiftedIndex =
                (alphabet.indexOf(lowerChar) +
                    shiftSign * shift +
                    alphabet.length) %
                alphabet.length;

            const resultChar = alphabet[shiftedIndex];
            return isUpper ? resultChar.toUpperCase() : resultChar;
        })
        .join("");
}

function encryptText() {
    const text = document.getElementById("textInput").value;
    const shift = parseInt(document.getElementById("shiftInput").value, 10);

    if (isNaN(shift)) {
        alert("Введите корректное число для сдвига.");
        return;
    }

    const encrypted = caesarCipher(text, shift, true);
    document.getElementById(
        "resultOutput"
    ).textContent = `Зашифрованное сообщение: ${encrypted}`;
}

function decryptText() {
    const text = document.getElementById("textInput").value;
    const shift = parseInt(document.getElementById("shiftInput").value, 10);

    if (isNaN(shift)) {
        alert("Введите корректное число для сдвига.");
        return;
    }

    const decrypted = caesarCipher(text, shift, false);
    document.getElementById(
        "resultOutput"
    ).textContent = `Дешифрованное сообщение: ${decrypted}`;
}

function crackCipherWithFrequency() {
    const text = document.getElementById("textInput").value.toLowerCase();
    const alphabetRU = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const alphabetEN = "abcdefghijklmnopqrstuvwxyz";

    // Частотное распределение букв для русского и английского языков
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

    const frequencyEN = {
        e: 0.12702,
        t: 0.09056,
        a: 0.08167,
        o: 0.07507,
        i: 0.06966,
        n: 0.06749,
        s: 0.06327,
        h: 0.06094,
        r: 0.05987,
        d: 0.04253,
        l: 0.04025,
        c: 0.02782,
        u: 0.02758,
        m: 0.02406,
        w: 0.0236,
        f: 0.02228,
        g: 0.02015,
        y: 0.01974,
        p: 0.01929,
        b: 0.01492,
        v: 0.00978,
        k: 0.00772,
        j: 0.00153,
        x: 0.0015,
        q: 0.00095,
        z: 0.00074,
    };

    const isRussian = alphabetRU.includes(text[0]);
    const isEnglish = alphabetEN.includes(text[0]);

    if (!isRussian && !isEnglish) {
        alert("Введите текст на русском или английском языке.");
        return;
    }

    const alphabet = isRussian ? alphabetRU : alphabetEN;
    const frequencyMap = isRussian ? frequencyRU : frequencyEN;

    let bestShift = null;
    let bestDecrypted = null;
    let bestCorrelation = -Infinity;

    // Функция для подсчета частоты символов в тексте
    function calculateFrequency(message, alphabet) {
        const counts = {};
        const totalLetters = message.length;

        for (const char of message) {
            if (alphabet.includes(char)) {
                counts[char] = (counts[char] || 0) + 1;
            }
        }

        return Object.keys(counts).reduce((acc, char) => {
            acc[char] = counts[char] / totalLetters;
            return acc;
        }, {});
    }

    // Перебираем все возможные сдвиги
    for (let shift = 0; shift < alphabet.length; shift++) {
        const decrypted = caesarCipher(text, shift, false);
        const messageFrequency = calculateFrequency(decrypted, alphabet);

        // Считаем корреляцию частот
        const correlation = Object.keys(messageFrequency).reduce(
            (sum, char) => {
                return sum + (frequencyMap[char] || 0) * messageFrequency[char];
            },
            0
        );

        // Обновляем лучший результат
        if (correlation > bestCorrelation) {
            bestCorrelation = correlation;
            bestShift = shift;
            bestDecrypted = decrypted;
        }
    }

    // Выводим лучший результат
    if (bestDecrypted) {
        document.getElementById(
            "resultOutput"
        ).textContent = `Взломано: ${bestDecrypted} (сдвиг: ${bestShift})`;
    } else {
        document.getElementById("resultOutput").textContent =
            "Не удалось найти подходящий сдвиг.";
    }
}
