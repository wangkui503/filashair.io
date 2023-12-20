const crypto = require("crypto");
export function generatePassword() {
    return Array(12)
        .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
        .map(function (x) {
            return x[crypto.randomInt(0, 10_000) % x.length];
        })
        .join("");
}
