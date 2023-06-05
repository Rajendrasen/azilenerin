import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { listContacts } from '../../graphql/custom/contacts/list-contacts.graphql';
import { createReferral } from '../../graphql/custom/referrals/create-referral.graphql';
import { createContact } from '../../graphql/custom/contacts/create-contact.graphql';
import uuid from 'uuid/v4';
import moment from 'moment';
import { GetJob } from '../../graphql/custom/jobs/job-by-id.graphql';

// export const withCreateReferral = Component => {
//   return compose(
//     graphql(gql(listContacts), {
//       options: props => ({
//         variables: {
//           filter: {
//             userId: { eq: props.currentUser.id },
//           },
//           limit: 1000,
//           nextToken: null,
//         },
//         fetchPolicy: 'cache-and-network',
//       }),
//       props: props => ({
//         contacts: props.data.listContacts ? props.data.listContacts.items : undefined,
//       }),
//     }),
//     graphql(gql(createContact), {
//       props: props => ({
//         ImportedCreateContact: input => {
//           const optimisticResponseData = {
//             id: uuid(),
//             ...input.input,
//             referrals: null,
//             __typename: 'Contact',
//           };
//           return props.mutate({
//             variables: input,
//             optimisticResponse: {
//               __typename: 'Mutation',
//               createContact: {
//                 __typename: 'createContact',
//                 ...optimisticResponseData,
//               },
//             },
//             update: (proxy, { data: { createContact } }) => {
//               const data = proxy.readQuery({
//                 query: gql(listContacts),
//                 variables: {
//                   filter: {
//                     userId: { eq: props.ownProps.currentUser.id },
//                   },
//                   limit: 1000,
//                   nextToken: null,
//                 },
//               });

//               if (!data.listContacts.items.find(contact => contact.id === createContact.id)) {
//                 data.listContacts.items.push(createContact);
//               }
//               proxy.writeQuery({
//                 query: gql(listContacts),
//                 variables: {
//                   filter: {
//                     userId: { eq: props.ownProps.currentUser.id },
//                   },
//                   limit: 1000,
//                   nextToken: null,
//                 },
//                 data,
//               });
//             },
//           });
//         },
//       }),
//     }),
//     graphql(gql(createReferral), {
//       props: props => ({
//         onCreateReferral: input => {
//           const optimisticResponseData = {
//             ...input.input,
//             id: uuid(),
//             referralDate: moment(),
//           };
//           props.mutate({
//             variables: input,
//             optimisticResponse: {
//               __typeName: 'Mutation',
//               createReferral: {
//                 __typeName: 'createReferral',
//                 ...optimisticResponseData,
//               },
//             },
//             update: (proxy, { data: { createReferral: newReferral } }) => {
//               if (props.ownProps.currentScene === 'jobsScene') {
//                 return;
//               }
//               const data = proxy.readQuery({
//                 query: GetJob,
//                 variables: {
//                   id: props.ownProps.job.id,
//                 },
//               });

//               if (data.getJob) {
//                 const referrals = get(data, 'getJob.referrals', []);
//                 const hasReferralBeenCached = referrals.find(referral => {
//                   return newReferral ? referral.id === newReferral.id : false;
//                 });

//                 if (!hasReferralBeenCached) {
//                   referrals.push(newReferral);

//                   proxy.writeQuery({
//                     query: GetJob,
//                     variables: {
//                       filter: {
//                         id: { eq: props.ownProps.job.id },
//                       },
//                     },
//                     data,
//                   });
//                 }
//               }
//             },
//           });
//         },
//       }),
//     })
//   )(Component);
// };
export const withCreateReferral = Component => {
  return compose(
    // graphql(gql(listContacts), {
    //   options: props => ({
    //     variables: {
    //       filter: {
    //         userId: { eq: props.currentUser.id },
    //       },
    //       limit: 2000,
    //       nextToken: null,
    //     },
    //     fetchPolicy: 'cache-and-network',
    //   }),
    //   props: props => ({
    //     contacts: props.data.listContacts ? props.data.listContacts.items : undefined,
    //   }),
    // }),
    graphql(gql(createContact), {
      props: props => ({
        ImportedCreateContact: input => {
          // const optimisticResponseData = {
          //   id: uuid(),
          //   ...input.input,
          //   referrals: null,
          //   __typename: 'Contact',
          // };
          return props.mutate({
            variables: input,
            // optimisticResponse: {
            //   __typename: 'Mutation',
            //   createContact: {
            //     __typename: 'createContact',
            //     ...optimisticResponseData,
            //   },
            // },
            // update: (proxy, { data: { createContact } }) => {
            //   const data = proxy.readQuery({
            //     query: gql(listContacts),
            //     variables: {
            //       filter: {
            //         userId: { eq: props.ownProps.currentUser.id },
            //       },
            //       limit: 2000,
            //       nextToken: null,
            //     },
            //   });
            //   if (!data.listContacts.items.find(contact => contact.id === createContact.id)) {
            //     data.listContacts.items.push(createContact);
            //   }
            //   proxy.writeQuery({
            //     query: gql(listContacts),
            //     variables: {
            //       filter: {
            //         userId: { eq: props.ownProps.currentUser.id },
            //       },
            //       limit: 2000,
            //       nextToken: null,
            //     },
            //     data,
            //   });
            // },
          });
        },
      }),
    }),
    graphql(gql(createReferral), {
      props: props => ({
        onCreateReferral: input => {
          // const optimisticResponseData = {
          //   ...input.input,
          //   id: uuid(),
          //   referralDate: moment(),
          // };
          return props
            .mutate({
              variables: input,
              // optimisticResponse: {
              //   __typeName: 'Mutation',
              //   createReferral: {
              //     __typeName: 'createReferral',
              //     ...optimisticResponseData,
              //   },
              // },
              // update: (proxy, { data: { createReferral: newReferral } }) => {
              //   if (props.ownProps.currentScene === 'jobsScene') {
              //     return;
              //   }
              //   const data = proxy.readQuery({
              //     query: GetJob,
              //     variables: {
              //       id: props.ownProps.job.id,
              //     },
              //   });
              // if (data.getJob) {
              //   const referrals = get(data, 'getJob.referrals', []);
              //   const hasReferralBeenCached = referrals.find(referral => {
              //     return newReferral ? referral.id === newReferral.id : false;
              //   });
              //   if (!hasReferralBeenCached) {
              //     referrals.push(newReferral);
              //     // proxy.writeQuery({
              //     //   query: GetJob,
              //     //   variables: {
              //     //     filter: {
              //     //       id: { eq: props.ownProps.job.id },
              //     //     },
              //     //   },
              //     //   data,
              //     // });
              //   }
              // }
              //},
            })
            .then(res => res);
        },
      }),
    })
  )(Component);
};
