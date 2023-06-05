import * as CryptoJS from 'crypto-js';
const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
  btoa: (input = '') => {
    let str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};
export const settingsData = {
  region: '509d9045b4fdd573aaf47d40c7a430a4',
  AesSecretKey: '08277A08B0ABA70703E28A5FCED7396D',
  AesSecretIVKey: 'D9062EA86462F77E',
  accessKeyId2:
    '8c4059da16bfdad0fd64ccead0b12e182caabcfdf6e5cd758ca17049e7d7b996',
  secretAccessKey2:
    '59df944d745a5e62acdc5aadbf4ad1cac30a8b00a517ca665796235c3aee5a11fc68fd7e5d816ceae7f98f23fc896c07',
};
export const awsSettingsData =
  'a6dfdc616641b4e70c37e2011b06d0b9eea24d63286ae594685d0b6610c7056d89b1df1e32f8eb6cea4eecc99972482d60f08848c750b1215303db00937263d2e4520891843ee38b3231aebe033bc17d82ad1cf394b5af46627bfb5105e881ca1ed24b9bee98f2a306ac548f25943a2f3b73be9138e7ed2c7085306d14639f8b';

export function encryptUsingAES256(data) {
  if (typeof data === 'number') {
    var name = data.toString();
  } else if (typeof data === 'boolean') {
    var name = data.toString();
  } else {
    name = data;
  }
  const _key = CryptoJS.enc.Utf8.parse(settingsData.AesSecretKey);
  const _iv = CryptoJS.enc.Utf8.parse(settingsData.AesSecretIVKey);
  const encrypted = CryptoJS.AES.encrypt(name, _key, {
    keySize: 256 / 32,
    iv: _iv,
    mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7
  });
  let encryptedString = encrypted.toString();
  const encryptedData = base64toHEX(encryptedString);
  return encryptedData;
}
export function base64toHEX(base64) {
  const raw = Base64.atob(base64);
  let HEX = '';
  let i;
  for (i = 0; i < raw.length; i++) {
    let _hex = raw.charCodeAt(i).toString(16);
    HEX += _hex.length === 2 ? _hex : '0' + _hex;
  }
  return HEX;
}
export function decryptUsingAES256(encrypted) {
  let _key = CryptoJS.enc.Utf8.parse(settingsData.AesSecretKey);
  let _iv = CryptoJS.enc.Utf8.parse(settingsData.AesSecretIVKey);
  let base64String = Base64.btoa(
    encrypted
      .match(/\w{2}/g)
      .map((a) => {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join(''),
  );
  const decrypted = CryptoJS.AES.decrypt(base64String, _key, {
    keySize: 256 / 32,
    iv: _iv,
    mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
