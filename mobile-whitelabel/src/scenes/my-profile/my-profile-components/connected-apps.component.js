// import React from 'react';
// import { View, Text, FlatList, Image } from 'react-native';
// import { Button, WhiteSpace } from 'antd-mobile-rn';
// import { styles } from '../my-profile.styles';

// const {
//   BtnStyles,
//   StatusContainerStyles,
//   StatusTextStyles,
//   BtnTextStyles,
//   JobItemText,
//   ConnectedAppLogo,
//   ConnectedAppName,
//   ConnectedAppListItemContainer,
//   ConnectedAppNameContainer,
//   ConnectedAppListContainer,
// } = styles;

// const linkedIn = require('../../../_shared/assets/linkedin.png');
// const gmail = require('../../../_shared/assets/gmail.png');
// const outlook = require('../../../_shared/assets/outlook.png');
// const twitter = require('../../../_shared/assets/twitter.png');
// const facebook = require('../../../_shared/assets/facebook.png');

// class ConnectedApps extends React.Component {
//   //render avatar based on account type
//   renderAvatar = type => {
//     const avatar =
//       type === 'linked-in'
//         ? linkedIn
//         : type === 'gmail'
//         ? gmail
//         : type === 'outlook'
//         ? outlook
//         : type === 'facebook'
//         ? facebook
//         : twitter;
//     return <Image style={ConnectedAppLogo} source={avatar} />;
//   };

//   //render name based on account type
//   renderName = type => {
//     const name =
//       type === 'linked-in'
//         ? 'LinkedIn'
//         : type === 'gmail'
//         ? 'Google'
//         : type === 'outlook'
//         ? 'Outlook'
//         : type === 'facebook'
//         ? 'Facebook'
//         : 'Twitter';
//     return <Text style={ConnectedAppName}>{name}</Text>;
//   };

//   // render button based on account type and whether user has previously synced that account
//   renderButton = (synced, type) => {
//     const connect = () => {
//       return type === 'linked-in'
//         ? this.linkedInSync()
//         : type === 'gmail'
//         ? this.googleSync()
//         : type === 'outlook'
//         ? this.outlookSync()
//         : type === 'facebook'
//         ? this.facebookSync()
//         : this.twitterSync();
//     };
//     return !synced ? (
//       <Button style={BtnStyles} onClick={connect}>
//         <Text style={BtnTextStyles}>Connect</Text>
//       </Button>
//     ) : synced && type === 'linked-in' ? (
//       <Button style={[BtnStyles, StatusContainerStyles]} disabled>
//         <Text style={[BtnTextStyles, StatusTextStyles]}>Imported</Text>
//       </Button>
//     ) : (
//       <Button style={[BtnStyles, StatusContainerStyles]} disabled>
//         <Text style={[BtnTextStyles, StatusTextStyles]}>Connected</Text>
//       </Button>
//     );
//   };

//   linkedInSync = () => {
//     // console.log('Linked In');
//   };

//   googleSync = () => {
//     // console.log('Google');
//   };

//   outlookSync = () => {
//     // console.log('Outlook');
//   };

//   twitterSync = () => {
//     // console.log('Twitter');
//   };

//   facebookSync = () => {
//     // console.log('Facebook');
//   };

//   renderItem(item) {
//     return (
//       <View style={ConnectedAppListItemContainer}>
//         {this.renderAvatar(item.type)}
//         <View style={ConnectedAppNameContainer}>{this.renderName(item.type)}</View>
//         {this.renderButton(item.synced, item.type)}
//       </View>
//     );
//   }

//   render() {
//     const { connectedApps } = this.props;
//     let initialConnectedApps = connectedApps;
//     if (!connectedApps) {
//       initialConnectedApps = [
//         {
//           type: 'gmail',
//           account: null,
//           synced: false,
//           dateSynced: null,
//         },
//         {
//           type: 'outlook',
//           account: null,
//           synced: false,
//           dateSynced: null,
//         },
//       ];
//     }

//     return (
//       <View style={ConnectedAppListContainer}>
//         <Text style={JobItemText}>Connections</Text>
//         <FlatList
//           data={initialConnectedApps}
//           keyExtractor={item => item.type}
//           renderItem={({ item }) => this.renderItem(item)}
//           showsVerticalScrollIndicator={false}
//         />
//         <WhiteSpace />
//       </View>
//     );
//   }
// }

// export default ConnectedApps;
