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
        (alphabet.indexOf(lowerChar) + shiftSign * shift + alphabet.length) %
        alphabet.length;

      const resultChar = alphabet[shiftedIndex];
      return isUpper ? resultChar.toUpperCase() : resultChar;
    })
    .join("");
}

function processCipher() {
  const textInput = document.getElementById("textInput").value;
  const shiftInput = parseInt(document.getElementById("shiftInput").value, 10);
  if (isNaN(shiftInput)) {
    alert("Введите корректное число для сдвига.");
    return;
  }

  const encrypted = caesarCipher(textInput, shiftInput, true);
  const decrypted = caesarCipher(encrypted, shiftInput, false);

  document.getElementById("encryptedOutput").textContent = encrypted;
  document.getElementById("decryptedOutput").textContent = decrypted;
}
