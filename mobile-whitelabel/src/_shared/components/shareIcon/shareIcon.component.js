import React, { useRef, useState } from 'react';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../services/language-manager';
import { TouchableOpacity, Image, Share, Modal, View, Text } from 'react-native';
import { updateUserQuery } from '../../../scenes/my-profile/profile.graphql';
import gql from 'graphql-tag';

import { withApollo } from 'react-apollo';
import { getDomain, getWhiteLogo } from '../../../WhiteLabelConfig';

import { queryUserJobShareByUserIdIndex } from '../../../_store/_shared/api/graphql/custom/jobs/user-jobshare-by-user-id.graphql';
import { updateJob } from '../../../_store/_shared/api/graphql/custom/jobs/update-job.graphql';
import { withUpdateJob } from './with-update-job.provider';
import QRCode from 'react-native-qrcode-svg';

let ErinLogo = getWhiteLogo();
const managePointsLog = gql`
  mutation managePointsLog($input: ManagePointsLogInput!) {
    managePointsLog(input: $input) {
      id
      companyId
      userId
      event
      note
      operation
      points
    }
  }
`;

const ShareIcon = ({ currentUser, job, client, setCurrentUser, onUpdateJob, onCreateUserJobShare, onUpdateUserJobShare, props }) => {

    const [userAllJobShares, setuserAllJobShares] = useState([]);
    const [QRCodeVisible, setQRCode] = useState(false);
    const [codelink, setCodeLink] = useState('');
    // console.log("ssd", currentUser.company.pointsSettings);
    //console.log("props", onUpdateJob);
    const viewShot = useRef(null);
    const [savereference, setReference] = useState();
    const showQRCode = () => {
        console.log("clicked the share ")
        Share.share(
            {
                message: `https://${getDomain()}/.netlify/functions/share-preview?referredBy=${currentUser.id
                    }&jobId=${job.id}&languageCode=EN`,
                title: customTranslate('ml_ShareThisJob'),
            },
            {
                dialogTitle: customTranslate('ml_ShareThisJob'),
                excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
            },
        ).then((res) => {

            if (res.action == Share.sharedAction) {
                // getUserJobShares()
                //  updateShareCount()
                // console.log("share action", res);
                // updatePointLog();
            }
        }
        );
        // return (
        //     <Modal visible={true} style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, width: '100%', height: '100%' }}>
        //         <View style={{ height: 100, width: '90%', borderWidth: 1 }}>

        //         </View>
        //     </Modal>
        // )
    }
    const checkShare = () => {
        console.log("view shot is here", savereference);
        var sharableQR = '';
        if (savereference) {
            savereference.toDataURL((data) => {
                sharableQR = 'data:image/png;base64,' + data
                //console.log("data is here", 'data:image/png;base64,' + data)
                // Share.share({
                //     message: 'test',
                //     title: 'jjf'
                // },
                //     {
                //         url: sharableQR
                //     }
                // )

                // Share.share({
                //     dialogTitle: "test",
                //     title: customTranslate('ml_ShareThisJob'),
                //     url: sharableQR,
                //     message: sharableQR,

                // })
            })
        }

    }
    const onShare = () =>

        Share.share(
            {
                message: `https://${getDomain()}/.netlify/functions/share-preview?referredBy=${currentUser.id
                    }&jobId=${job.id}&languageCode=EN`,
                title: customTranslate('ml_ShareThisJob'),
            },
            {
                dialogTitle: customTranslate('ml_ShareThisJob'),
                excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
            },
        ).then((res) => {

            if (res.action == Share.sharedAction) {
                getUserJobShares()
                //  updateShareCount()
                // console.log("share action", res);
                // updatePointLog();
            }
        }
        );
    const updatePointLog = () => {
        let { pointsSettings } = currentUser.company;
        if (!pointsSettings) {
            return;
        }
        pointsSettings = JSON.parse(pointsSettings);
        if (!pointsSettings.enabled) {
            return;
        }
        client
            .mutate({
                mutation: managePointsLog,
                variables: {
                    input: {
                        companyId: currentUser.company.id,
                        userId: currentUser.id,
                        event: 'socialMediaShare',
                        note: 'sharing on social media',
                        points: pointsSettings.socialMediaShare,
                        operation: 'add',
                    },
                },
            })
            .then((res) => {
                console.log("response is", res);
                //   updateShareCount();


                // client
                //   .mutate({
                //     mutation: updateUserQuery,
                //     variables: {
                //       input: {
                //         id: currentUser.id,
                //         lastMobileLogin: new Date().toISOString(),
                //         points:
                //           parseInt(pointsSettings.useMobileApp) +
                //           parseInt(currentUser.points),
                //       },
                //     },
                //   })
                //   .then((res) => {
                //     setCurrentUser(res.data.updateUser);
                //   })
                //   .catch((err) => console.log('err', err));
            })
            .catch((err) => {
                console.log('err', err);
            });
    };


    const getUserJobShares = async (
        policy = 'network-only',
        nextToken = null,
        userAllJobShares = []
    ) => {
        const { client } = props;
        try {
            const { data } = await client.query({
                query: gql(queryUserJobShareByUserIdIndex),
                variables: {
                    userId: currentUser.id,
                    after: nextToken,
                },
                fetchPolicy: policy,
            });
            const userJobShares = [...data.queryUserJobShareByUserIdIndex.items];
            const token = data.queryUserJobShareByUserIdIndex.nextToken != null ? data.queryUserJobShareByUserIdIndex.nextToken : null;
            userAllJobShares = [...userAllJobShares, ...userJobShares];

            updateShareCount(userAllJobShares)
            if (token) {
                getUserJobShares(policy, token, userAllJobShares);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const updateShareCount = async (userAllJobShares) => {


        const userJobSharesLength = userAllJobShares.length;
        const currentUserId = currentUser.id
        const companyId = currentUser?.companyId
        let shareCountByMobile = 0;

        console.log(userJobSharesLength, currentUserId, companyId, userAllJobShares.length);
        await onUpdateJob({
            id: job.id,
            shares: job.shares + 1,
        }).catch((err) => console.error('Update Job Share Count Error:', err));
        if (userJobSharesLength > 0) {
            const currentUserJobShareDetails = userAllJobShares.filter(
                (item) => item.jobId === job.id
            );
            if (currentUserJobShareDetails.length > 0) {

                shareCountByMobile = currentUserJobShareDetails[0]?.shareCountByMobile
                await onUpdateUserJobShare({
                    id: currentUserJobShareDetails[0].id,
                    shareCountByMobile: shareCountByMobile + 1,
                    shareDateByMobile: new Date().toISOString(),
                    companyId: companyId,
                })
            }
            else {
                await onCreateUserJobShare({
                    userId: currentUserId,
                    jobId: job.id,
                    companyId: companyId,
                    shareCountByMobile: 1,
                    shareDateByMobile: new Date().toISOString()
                })
            }
        }
        else {
            await onCreateUserJobShare({
                userId: currentUserId,
                jobId: job.id,
                companyId: companyId,
                shareCountByMobile: 1,
                shareDateByMobile: new Date().toISOString()
            }).catch((err) =>
                console.error('Create User Job Share Count Error:', err)
            );
        }
        //updatePointLog()
    }





    // return (

    //     <>
    //         {
    //             QRCodeVisible ?
    //                 <Modal visible={QRCodeVisible} transparent={true} style={{ borderWidth: 1, width: '80%', height: 100 }}>
    //                     <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%', borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
    //                         <View style={{ height: '50%', width: '80%', justifyContent: 'space-around', borderRadius: 8, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' }}>
    //                             <Image
    //                                 source={ErinLogo}
    //                                 alt="Erin Logo"
    //                                 style={{
    //                                     width: 100,
    //                                     height: 70,


    //                                 }}
    //                                 resizeMode="contain"
    //                             />
    //                             <QRCode
    //                                 value={codelink}
    //                                 getRef={(c) => setReference(c)}
    //                             />
    //                             <Text >share your job using the QRCode on different social platforms </Text>
    //                             <View style={{ flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between', width: '100%', height: 40, }}>
    //                                 <TouchableOpacity activeOpacity={0.8} onPress={() => checkShare()} style={{ borderWidth: 1, borderRadius: 8, width: '49%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    //                                     <Text>Share</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity activeOpacity={0.8} onPress={() => setQRCode(!QRCodeVisible)} style={{ borderWidth: 1, borderRadius: 8, width: '49%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    //                                     <Text>Cancel</Text>
    //                                 </TouchableOpacity>

    //                             </View>
    //                         </View>

    //                     </View>
    //                 </Modal>
    //                 :
    //                 <TouchableOpacity style={{ padding: 5 }} onPress={() => {
    //                     setQRCode(!QRCodeVisible), setCodeLink(`https://${getDomain()}/.netlify/functions/share-preview?referredBy=${currentUser.id
    //                         }&jobId=${job.id}&languageCode=EN`)
    //                 }}>
    //                     <Image
    //                         source={require('../../../_shared/assets/share.png')}
    //                         style={{ height: 15, width: 15 }}
    //                     />
    //                 </TouchableOpacity>

    //         }


    //     </>
    // );
    return (
        <TouchableOpacity style={{ padding: 5 }} onPress={() => onShare()}>
            <Image
                source={require('../../../_shared/assets/share.png')}
                style={{ height: 15, width: 15 }}
            />
        </TouchableOpacity>
    )
};

export default withApollo(ShareIcon);
