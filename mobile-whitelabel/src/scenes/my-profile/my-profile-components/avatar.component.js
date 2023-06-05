import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TouchableHighlight,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {styles} from '../my-profile.styles';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import aws from 'aws-sdk';
import S3 from 'aws-s3';
import {COLORS} from '../../../_shared/styles/colors';
import {downloadFromS3} from '../../../common'

const {FlexContainer, AvatarStyles, NoPicture, NoPictureText} = styles;

class Avatar extends Component {
  state = {
    localImage: null,
    imageUploading: false,
  };
  uploadAvatarFile = (files) => {
    this.setState({imageUploading: true});
    let file = this.state.localImage;
    if (Platform.OS === 'ios') {
      file = {
        name: file.filename.split('.')[0],
        size: file.size,
        type: file.mime,
        uri: file.sourceURL,
      };
    } else {
      file = {
        name: file.path.split('/')[file.path.split('/').length - 1],
        size: file.size,
        type: file.mime,
        uri: file.path,
      };
    }
    const config = {
      bucketName: 'erin-avatars',
      dirName: 'user-pic' /* optional */,
      region: 'us-east-2',
      accessKeyId: 'AKIAQJFIAVGJWWIVRL5C',
      secretAccessKey: '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',
      //s3Url: 'https://my-s3-url.com/' /* optional */,
    };
    const S3Client = new S3(config);
    const newFileName = file.name;
    S3Client.uploadFile(file, newFileName)
      .then((data) => {
        this.setState({imageUploading: false});

        const addToList = {
          bucket: 'erin-avatars',
          key: data.key,
          region: 'us-east-2',
        };
        this.props.toDoAvatar(addToList);
      })
      .catch((err) => console.error(err));
    // let name = file.path.split('/')[file.path.split('/').length - 1];
    // aws.config.update({
    //   region: 'us-east-2',
    //   accessKeyId: 'AKIAQJFIAVGJWWIVRL5C',
    //   secretAccessKey: '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',
    // });

    // var s3 = new aws.S3();
    // var params = {
    //   Bucket: 'erin-avatars',
    //   Key: `user-pic/${name}`,
    //   ContentType: file.mime,
    // };

    // s3.getSignedUrl('putObject', params, function (err, signedUrl) {
    //   if (err) {
    //     return err;
    //   } else {
    //     var instance = axios.create();
    //     instance.put(signedUrl, file, {
    //       headers: {'Content-Type': file.mime},
    //     });
    //   }
    //   console.log('SIGNEDURL HERE', signedUrl);
    //   return signedUrl;
    // });
    // this.setState({
    //   avatarFile: file,
    // });
    // const addToList = {
    //   bucket: 'erin-avatars',
    //   key: `user-pic/${name}`,
    //   region: 'us-east-2',
    // };
    // setTimeout(() => {
    //   this.setState({uploadedAvatar: addToList});
    //   this.props.toDoAvatar(addToList);

    // }, 700);
  };
  render() {
    const {firstName, lastName, avatar} = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          return this.props.edit
            ? ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: false,
              }).then((image) => {
                this.setState({localImage: image}, () => {
                  this.uploadAvatarFile();
                });
              })
            : () => {};
        }}>
        <View style={FlexContainer}>
          {!this.state.localImage &&
          (!avatar || !Object.keys(avatar).length) ? (
            <View style={NoPicture}>
              <Text style={NoPictureText}>
                {firstName[0]} {lastName[0]}
              </Text>
            </View>
          ) : (
            <Image
              style={AvatarStyles}
              source={{
                uri: this.state.localImage
                  ? this.state.localImage.path
                  : downloadFromS3(avatar.key),
              }}
              alt={`${firstName} ${lastName}`}
            />
          )}
          {this.state.imageUploading && (
            <View
              style={{
                position: 'absolute',
                height: 100,
                width: 100,
                left: 0,
                backgroundColor: COLORS.whiteTransparent,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color={COLORS.dashboardBlue} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export default Avatar;
