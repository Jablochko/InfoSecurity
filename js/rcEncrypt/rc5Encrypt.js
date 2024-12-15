const RC5_CONST = {
    16: [0xb7e1n, 0x9e37n],
    32: [0xb7e15163n, 0x9e3779b9n],
    64: [0xb7e151628aed2a6bn, 0x9e3779b97f4a7c15n],
};

class RC5Cipher {
    constructor(w, r, key) {
        this.w = w;
        this.r = r;
        this.u = w / 8;
        this.b = key.length;
        this.key = key;
        this.L = [];
        this.S = [];

        this._keyAlign();
        this._keyExtend();
        this._mix();
    }

    _modularAdd(a, b) {
        return (a + b) % (1n << BigInt(this.w));
    }

    _modularSub(a, b) {
        return (a - b + (1n << BigInt(this.w))) % (1n << BigInt(this.w));
    }

    _leftRotate(x, n) {
        n = n % BigInt(this.w);
        return (
            ((x << n) | (x >> (BigInt(this.w) - n))) &
            ((1n << BigInt(this.w)) - 1n)
        );
    }

    _rightRotate(x, n) {
        n = n % BigInt(this.w);
        return (x >> n) | ((x & ((1n << n) - 1n)) << (BigInt(this.w) - n));
    }

    _keyAlign() {
        while (this.b % this.u) {
            this.key.push(0);
            this.b = this.key.length;
        }

        for (let i = 0; i < this.b; i += this.u) {
            this.L.push(
                this.key
                    .slice(i, i + this.u)
                    .reduce(
                        (acc, byte, idx) =>
                            acc + (BigInt(byte) << BigInt(8 * idx)),
                        0n
                    )
            );
        }
    }

    _keyExtend() {
        const [P, Q] = RC5_CONST[this.w];
        this.S[0] = P;
        for (let i = 1; i < 2 * this.r + 2; i++) {
            this.S[i] = this._modularAdd(this.S[i - 1], Q);
        }
    }

    _mix() {
        let i = 0,
            j = 0;
        let A = 0n,
            B = 0n;
        const t = Math.max(this.L.length, 2 * this.r + 2);

        for (let s = 0; s < 3 * t; s++) {
            A = this.S[i] = this._leftRotate(
                this._modularAdd(this.S[i], A + B),
                3n
            );
            B = this.L[j] = this._leftRotate(
                this._modularAdd(this.L[j], A + B),
                A + B
            );
            i = (i + 1) % (2 * this.r + 2);
            j = (j + 1) % this.L.length;
        }
    }

    encryptBlock(message) {
        let A = message >> BigInt(this.w);
        let B = message & ((1n << BigInt(this.w)) - 1n);

        A = this._modularAdd(A, this.S[0]);
        B = this._modularAdd(B, this.S[1]);

        for (let i = 1; i <= this.r; i++) {
            A = this._modularAdd(this._leftRotate(A ^ B, B), this.S[2 * i]);
            B = this._modularAdd(this._leftRotate(B ^ A, A), this.S[2 * i + 1]);
        }

        return (A << BigInt(this.w)) | B;
    }

    decryptBlock(message) {
        let A = message >> BigInt(this.w);
        let B = message & ((1n << BigInt(this.w)) - 1n);

        for (let i = this.r; i >= 1; i--) {
            B =
                this._rightRotate(this._modularSub(B, this.S[2 * i + 1]), A) ^
                A;
            A = this._rightRotate(this._modularSub(A, this.S[2 * i]), B) ^ B;
        }

        A = this._modularSub(A, this.S[0]);
        B = this._modularSub(B, this.S[1]);

        return (A << BigInt(this.w)) | B;
    }
}

function stringToByteArray(str) {
    return new TextEncoder().encode(str);
}

function byteArrayToString(byteArray) {
    return new TextDecoder().decode(byteArray);
}

function byteArrayToBigInt(byteArray) {
    let result = 0n;
    for (let byte of byteArray) {
        result = (result << BigInt(8)) | BigInt(byte);
    }
    return result;
}

function bigIntToByteArray(bigInt) {
    const byteArray = [];
    while (bigInt > 0) {
        byteArray.push(Number(bigInt & 0xffn));
        bigInt >>= 8n;
    }
    return byteArray.reverse();
}

function byteArrayToBase64(byteArray) {
    return btoa(String.fromCharCode(...byteArray));
}

function base64ToByteArray(base64) {
    return new Uint8Array(
        atob(base64)
            .split("")
            .map((char) => char.charCodeAt(0))
    );
}

const key = 123456789;
const rc5 = new RC5Cipher(
    32,
    12,
    new Uint8Array(new Uint32Array([key]).buffer)
);

let message = prompt("Введите сообщение для шифрования:");

const byteArrayMessage = stringToByteArray(message);

const blockSize = 8;
const paddedLength = Math.ceil(byteArrayMessage.length / blockSize) * blockSize;
const paddedMessage = new Uint8Array(paddedLength);
paddedMessage.set(byteArrayMessage);
for (let i = byteArrayMessage.length; i < paddedLength; i++) {
    paddedMessage[i] = 0;
}

const encryptedBlocks = [];
for (let i = 0; i < paddedMessage.length; i += blockSize) {
    const block = paddedMessage.slice(i, i + blockSize);
    const encryptedBlock = rc5.encryptBlock(byteArrayToBigInt(block));

    const encryptedBytes = bigIntToByteArray(encryptedBlock);
    encryptedBlocks.push(...encryptedBytes);
}

const encryptedBase64 = byteArrayToBase64(encryptedBlocks);

const decryptedBlocks = [];
for (let i = 0; i < encryptedBlocks.length; i += blockSize) {
    const block = encryptedBlocks.slice(i, i + blockSize);
    const decryptedBlock = rc5.decryptBlock(byteArrayToBigInt(block));
    decryptedBlocks.push(decryptedBlock);
}

const decryptedByteArray = new Uint8Array(decryptedBlocks.length * blockSize);
for (let i = 0; i < decryptedBlocks.length; i++) {
    const block = bigIntToByteArray(decryptedBlocks[i]);
    decryptedByteArray.set(block, i * blockSize);
}

const decryptedMessage = byteArrayToString(decryptedByteArray).replace(
    /\0/g,
    ""
);

console.log(`Key: ${key}`);
console.log(`Encrypted (Base64): ${encryptedBase64}`);
console.log(`Decrypted: ${decryptedMessage}`);
