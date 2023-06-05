const AWS = require('aws-sdk');
// import * as CryptoJS from 'crypto-js';
import { decryptUsingAES256 } from './settings';
let dev = {
    SecretName: 'DevCognitoUserPoolAuthEncrypted',
    AWSSecretRegion: 'us-east-2',
};
let prod = {
    SecretName: 'ProdCognitoUserPoolAuthEncrypted',
    AWSSecretRegion: 'us-east-2',
};
let env = 'prod';
export function GetAWSSecrets(awsRegion, secretName) {
    secretName = env === 'prod' ? prod.SecretName : dev.SecretName;
    awsRegion = env === 'prod' ? prod.AWSSecretRegion : dev.AWSSecretRegion;

    return new Promise((resolve, reject) => {
        try {
            let url = `https://i81om4wybf.execute-api.us-east-2.amazonaws.com/default/settings`;
            fetch(url, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((res) => {
                    AWS.config.update({
                        region: decryptUsingAES256(res.region),
                        accessKeyId: decryptUsingAES256(res.accessKeyId),
                        secretAccessKey: decryptUsingAES256(res.secretAccessKey),
                    });

                    let secret = null,
                        decodedBinarySecret = null,
                        jsonResult = null;
                    // Create a Secrets Manager client
                    let client = new AWS.SecretsManager({
                        region: awsRegion,
                    });

                    // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
                    // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
                    // We rethrow the exception by default.
                    var params = {
                        SecretId: secretName,
                    };
                    client.getSecretValue(params, function (err, data) {
                        // console.log('secret data', data);
                        if (err) {
                            if (err.code === 'DecryptionFailureException')
                                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                                // Deal with the exception here, and/or rethrow at your discretion.
                                throw err;
                            else if (err.code === 'InternalServiceErrorException')
                                // An error occurred on the server side.
                                // Deal with the exception here, and/or rethrow at your discretion.
                                throw err;
                            else if (err.code === 'InvalidParameterException')
                                // You provided an invalid value for a parameter.
                                // Deal with the exception here, and/or rethrow at your discretion.
                                throw err;
                            else if (err.code === 'InvalidRequestException')
                                // You provided a parameter value that is not valid for the current state of the resource.
                                // Deal with the exception here, and/or rethrow at your discretion.
                                throw err;
                            else if (err.code === 'ResourceNotFoundException')
                                // We can't find the resource that you asked for.
                                // Deal with the exception here, and/or rethrow at your discretion.
                                throw err;
                        } else {
                            // Decrypts secret using the associated KMS CMK.
                            // Depending on whether the secret is a string or binary, one of these fields will be populated.

                            if ('SecretString' in data) {
                                secret = data.SecretString;
                                jsonResult =
                                    secret && typeof secret == 'string'
                                        ? JSON.parse(secret)
                                        : secret;
                            } else {
                                let buff = new Buffer(data.SecretBinary, 'base64');
                                decodedBinarySecret = buff.toString('ascii');
                                jsonResult =
                                    decodedBinarySecret && typeof decodedBinarySecret == 'string'
                                        ? JSON.parse(decodedBinarySecret)
                                        : decodedBinarySecret;
                            }
                        }
                        jsonResult = JSON.parse(JSON.stringify(jsonResult));
                        let finalResult = {};
                        finalResult = {
                            jsonResult,
                            AesSecretKey: res.AesSecretKey,
                            AesSecretIVKey: res.AesSecretIVKey,
                        };
                        //console.log('final result', finalResult)
                        resolve(finalResult);
                        // Your code goes here.
                    });
                });
        } catch (error) {
            reject(error);
        }
    });
}

export default GetAWSSecrets;

// export function encryptUsingAES256(data) {
//   if (typeof (data) === 'number') {
//     var name = data.toString();
//   }
//   else if (typeof (data) === 'boolean') {
//     var name = data.toString();
//   } else {
//     name = data;

//   }
//   const _key = CryptoJS.enc.Utf8.parse(settingsData.AesSecretKey);
//   const _iv = CryptoJS.enc.Utf8.parse(settingsData.AesSecretIVKey);
//   const encrypted = CryptoJS.AES.encrypt((name), _key, {
//     keySize: 256 / 32,
//     iv: _iv,
//     mode: CryptoJS.mode.CBC,
//     // padding: CryptoJS.pad.Pkcs7
//   });
//   let encryptedString = encrypted.toString();
//   const encryptedData = base64toHEX(encryptedString);
//   return encryptedData;
// }

// export function base64toHEX(base64) {
//   const raw = atob(base64);
//   let HEX = '';
//   let i;
//   for (i = 0; i < raw.length; i++) {
//     let _hex = raw.charCodeAt(i).toString(16);
//     HEX += (_hex.length === 2 ? _hex : '0' + _hex);
//   }
//   return HEX;
// }

// export function decryptUsingAES256(encrypted) {
//   let _key = CryptoJS.enc.Utf8.parse(settingsData.AesSecretKey);
//   let _iv = CryptoJS.enc.Utf8.parse(settingsData.AesSecretIVKey);
//   let base64String = btoa(encrypted.match(/\w{2}/g).map(a => { return String.fromCharCode(parseInt(a, 16)); }).join(''));
//   const decrypted = CryptoJS.AES.decrypt(
//     base64String, _key, {
//     keySize: 256 / 32,
//     iv: _iv,
//     mode: CryptoJS.mode.CBC,
//     // padding: CryptoJS.pad.Pkcs7
//   }).toString(CryptoJS.enc.Utf8);
//   return decrypted;
// }
