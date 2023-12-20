const crypto = require('crypto');

const jose = require('jose');
const xid = require('xid-js');


export default async function genJWT(data, username, key, kid, exp) {
const alg = 'EdDSA'

console.log("key=============", key)
const privateKey = await jose.importPKCS8(key, alg)

exp = exp? exp+'h' : '2h'

const jwt = await new jose.SignJWT(data)
  .setProtectedHeader({ alg, kid: kid })
  .setJti("filash_" +xid.next())
  .setIssuedAt()
  .setIssuer(username)
  .setExpirationTime(exp)
  .sign(privateKey)

console.log(jwt)
return jwt
}
