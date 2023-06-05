import aws from 'aws-sdk';
import {settingsData, awsSettingsData, decryptUsingAES256} from './settings';
import axios from 'axios';
export const downloadFromS3 = (key, bucket) => {
  const key1 = '08277A08B0ABA70703E28A5FCED7396D';
  const key2 = 'D9062EA86462F77E';
  const config = decryptUsingAES256(awsSettingsData, key1, key2);
  aws.config.update(config);
  //   aws.config.update({
  //     region: decryptUsingAES256(settingsData.region, key1, key2),
  //     accessKeyId: decryptUsingAES256(settingsData.accessKeyId2, key1, key2),
  //     secretAccessKey: decryptUsingAES256(awsSettingsData, key1, key2),
  //   });
  var s3 = new aws.S3();
  var params = {
    Bucket: bucket ? bucket : 'erin-avatars',
    Key: `${key}`,
    Expires: 3 * 24 * 60 * 60,
  };
  var s3url = s3.getSignedUrl('getObject', params);
  return s3url;
};

export const uploadToS3 = (file, {bucket, key}) => {
  try {
    fetch(
      'https://i81om4wybf.execute-api.us-east-2.amazonaws.com/default/settings',
      {
        method: 'GET',
      },
    )
      .then((response) => response.json())
      .then((res) => {
        aws.config.update({
          region: decryptUsingAES256(
            settingsData.region,
            res.AesSecretKey,
            res.AesSecretIVKey,
          ),
          accessKeyId: decryptUsingAES256(
            settingsData.accessKeyId2,
            res.AesSecretKey,
            res.AesSecretIVKey,
          ),
          secretAccessKey: decryptUsingAES256(
            settingsData.secretAccessKey2,
            res.AesSecretKey,
            res.AesSecretIVKey,
          ),
        });

        var s3 = new aws.S3();

        return new Promise((resolve, reject) => {
          s3.getSignedUrl(
            'putObject',
            {
              Bucket: bucket,
              Key: key,
              ContentType: file.type,
            },
            function (err, signedUrl) {
              if (err) {
                reject(err);
              } else {
                var instance = axios.create();
                resolve(
                  instance
                    .put(signedUrl, file, {
                      headers: {'Content-Type': file.type},
                    })
                    .then((res) => console.log('sdldl', res)),
                );
              }
            },
          );
        });
      });
  } catch (e) {
    console.log(e);
  }
};
