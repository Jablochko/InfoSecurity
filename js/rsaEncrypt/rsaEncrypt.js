// function getGcd(a, b) {
//     return b === 0n ? a : getGcd(b, a % b);
// }

// function modInverse(a, m) {
//     let m0 = m,
//         x0 = 0n,
//         x1 = 1n;

//     if (m === 1n) return 0n;

//     while (a > 1n) {
//         if (m === 0n) {
//             throw new Error("Division by zero in modInverse");
//         }

//         let q = a / m;
//         let temp = m;

//         m = a % m;
//         a = temp;

//         temp = x0;
//         x0 = x1 - q * x0;
//         x1 = temp;
//     }

//     if (x1 < 0n) {
//         x1 += m0;
//     }

//     return x1;
// }

// function isPrime(n) {
//     if (n < 2) {
//         return false;
//     } else if (n === 2) {
//         return true;
//     } else if (n % 2 === 0) {
//         return false;
//     } else {
//         for (let i = 3; i <= Math.sqrt(n); i += 2) {
//             if (n % i === 0) {
//                 return false;
//             }
//         }
//     }
//     return true;
// }

// function generateKeypair(p, q, keySize) {
//     const nMin = 1n << BigInt(keySize - 1);
//     const nMax = (1n << BigInt(keySize)) - 1n;
//     let primes = [2n];
//     const start = 1n << BigInt(Math.floor(keySize / 2) - 1);
//     const stop = 1n << BigInt(Math.floor(keySize / 2) + 1);

//     if (start >= stop) {
//         return [];
//     }

//     for (let i = 3n; i <= stop; i += 2n) {
//         let isPrime = true;
//         for (const prime of primes) {
//             if (i % prime === 0n) {
//                 isPrime = false;
//                 break;
//             }
//         }
//         if (isPrime) {
//             primes.push(i);
//         }
//     }

//     primes = primes.filter((prime) => prime >= start);

//     while (primes.length > 0) {
//         p = primes.splice(Math.floor(Math.random() * primes.length), 1)[0];
//         const qValues = primes.filter((q) => nMin <= p * q && p * q <= nMax);
//         if (qValues.length > 0) {
//             q = qValues[Math.floor(Math.random() * qValues.length)];
//             break;
//         }
//     }

//     const n = p * q;
//     const phi = (p - 1n) * (q - 1n);

//     let e, d, g;
//     do {
//         e = BigInt(Math.floor(Math.random() * Number(phi - 1n)) + 1);
//         g = getGcd(e, phi);
//         try {
//             d = modInverse(e, phi);
//         } catch (error) {
//             continue;
//         }
//     } while (g !== 1n || e === d);

//     return { publicKey: [e, n], privateKey: [d, n] };
// }

// function modExp(base, exp, mod) {
//     let result = 1n;
//     base = base % mod;
//     while (exp > 0n) {
//         if (exp % 2n === 1n) {
//             result = (result * base) % mod;
//         }
//         base = (base * base) % mod;
//         exp = exp / 2n;
//     }
//     return result;
// }

// function encryptMessage(message, package) {
//     const [e, n] = package;
//     let msgCipherText = [];
//     for (let char of message) {
//         let charCode = BigInt(char.charCodeAt(0));
//         let encryptedChar = modExp(charCode, e, n);
//         msgCipherText.push(encryptedChar.toString());
//     }
//     return msgCipherText.join(" ");
// }

// function decryptMessage(message, package) {
//     const [d, n] = package;
//     let msgPlainText = [];
//     let encryptedChars = message.split(" ");
//     for (let encryptedChar of encryptedChars) {
//         let decryptedCharCode = modExp(
//             BigInt(encryptedChar),
//             BigInt(d),
//             BigInt(n)
//         ); // Преобразуем в BigInt
//         msgPlainText.push(String.fromCharCode(Number(decryptedCharCode)));
//     }
//     return msgPlainText.join("");
// }

// const def_bit_length = 4;
// console.log("Шифр RSA");
// console.log(`Количество бит: ${def_bit_length}`);

// const p = 61n;
// const q = 53n;

// const { publicKey, privateKey } = generateKeypair(p, q, 2 ** def_bit_length);

// console.log(`Ваш публичный ключ: ${publicKey}`);
// console.log(`Ваш приватный ключ: ${privateKey}`);
// console.log("==========");

// let message = prompt("Введите сообщение для шифрования:");

// if (message) {
//     console.log(
//         "Сообщение (в кодах символов):",
//         Array.from(message)
//             .map((c) => c.charCodeAt(0))
//             .join(" ")
//     );

//     const encryptedMsg = encryptMessage(message, publicKey);
//     console.log("Результат работы шифра:");
//     console.log(encryptedMsg);

//     const decryptedMsg = decryptMessage(encryptedMsg, privateKey);
//     console.log("Результат дешифровки:");
//     console.log(decryptedMsg);
// } else {
//     console.log("Сообщение не было введено!");
// }

function getGcd(a, b) {
    return b === 0n ? a : getGcd(b, a % b);
}

function modInverse(a, m) {
    let m0 = m,
        x0 = 0n,
        x1 = 1n;

    if (m === 1n) return 0n;

    while (a > 1n) {
        if (m === 0n) {
            throw new Error("Division by zero in modInverse");
        }

        let q = a / m;
        let temp = m;

        m = a % m;
        a = temp;

        temp = x0;
        x0 = x1 - q * x0;
        x1 = temp;
    }

    if (x1 < 0n) {
        x1 += m0;
    }

    return x1;
}

function isPrime(n) {
    if (n < 2) {
        return false;
    } else if (n === 2) {
        return true;
    } else if (n % 2 === 0) {
        return false;
    } else {
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            if (n % i === 0) {
                return false;
            }
        }
    }
    return true;
}

function generateKeypair(p, q, keySize) {
    const nMin = 1n << BigInt(keySize - 1);
    const nMax = (1n << BigInt(keySize)) - 1n;
    let primes = [2n];
    const start = 1n << BigInt(Math.floor(keySize / 2) - 1);
    const stop = 1n << BigInt(Math.floor(keySize / 2) + 1);

    if (start >= stop) {
        return [];
    }

    for (let i = 3n; i <= stop; i += 2n) {
        let isPrime = true;
        for (const prime of primes) {
            if (i % prime === 0n) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
    }

    primes = primes.filter((prime) => prime >= start);

    while (primes.length > 0) {
        p = primes.splice(Math.floor(Math.random() * primes.length), 1)[0];
        const qValues = primes.filter((q) => nMin <= p * q && p * q <= nMax);
        if (qValues.length > 0) {
            q = qValues[Math.floor(Math.random() * qValues.length)];
            break;
        }
    }

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    let e, d, g;
    do {
        e = BigInt(Math.floor(Math.random() * Number(phi - 1n)) + 1);
        g = getGcd(e, phi);
        try {
            d = modInverse(e, phi);
        } catch (error) {
            continue;
        }
    } while (g !== 1n || e === d);

    return { publicKey: [e, n], privateKey: [d, n] };
}

function modExp(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

function encryptMessage(message, package) {
    const [e, n] = package;
    let msgCipherText = [];
    for (let char of message) {
        let charCode = BigInt(char.charCodeAt(0));
        let encryptedChar = modExp(charCode, e, n);
        msgCipherText.push(encryptedChar.toString());
    }
    return msgCipherText.join(" ");
}

function decryptMessage(message, package) {
    const [d, n] = package;
    let msgPlainText = [];
    let encryptedChars = message.split(" ");
    for (let encryptedChar of encryptedChars) {
        let decryptedCharCode = modExp(
            BigInt(encryptedChar),
            BigInt(d),
            BigInt(n)
        );
        msgPlainText.push(String.fromCharCode(Number(decryptedCharCode)));
    }
    return msgPlainText.join("");
}

function startEncryption() {
    const def_bit_length = 4;
    const p = 61n;
    const q = 53n;

    const { publicKey, privateKey } = generateKeypair(
        p,
        q,
        2 ** def_bit_length
    );

    // Display public and private keys
    document.getElementById(
        "publicKey"
    ).textContent = `(${publicKey[0]}, ${publicKey[1]})`;
    document.getElementById(
        "privateKey"
    ).textContent = `(${privateKey[0]}, ${privateKey[1]})`;

    // Get the message input by the user
    let message = document.getElementById("message").value;

    if (message) {
        // Encrypt the message
        const encryptedMsg = encryptMessage(message, publicKey);
        document.getElementById("encryptedMessage").textContent = encryptedMsg;

        // Decrypt the message
        const decryptedMsg = decryptMessage(encryptedMsg, privateKey);
        document.getElementById("decryptedMessage").textContent = decryptedMsg;
    } else {
        alert("Please enter a message to encrypt!");
    }
}
