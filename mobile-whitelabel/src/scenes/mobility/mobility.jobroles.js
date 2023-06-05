import React, { Component, useEffect, useState } from 'react';
import { withApollo } from 'react-apollo';
import {
    View, FlatList, Dimensions, Text, ActivityIndicator, Animated
} from 'react-native';
import { connect } from 'react-redux';
import { get } from 'lodash';
import gql from 'graphql-tag';
import { getDomain } from '../../WhiteLabelConfig';
import { searchUserDataNetwork } from '../../_shared/services/utils';
import { customTranslate } from '../../_shared/services/language-manager';
import { Actions } from 'react-native-router-flux';
import { hpx, nf, wpx } from '../../_shared/constants/responsive';

const width = Dimensions.get('window').width;

const getUserById = `query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      cognitoId
      companyId
      active
      emailAddress
      accessToken
      expires
      expirationDoneByToken
    }
  }
  `;
class MobilityRoles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: JSON.parse(get(props, 'currentUser.company.theme', '{}')),
            visible: false,
            lengthError: false,
            query: '',
            statusFilter: 'active',
            success: false,
            loaded: false,
            firstLoad: true,
            activeEmployees: null,
            buttonState: '',
            edit: false,
            editorKey: 4,
            filteredDepartments: [],
            filteredRoles: [],
            company: get(props, 'currentUser.company'),
            filterEmployeeStatus: 'active',
            searchedEmployees: [],
            loading: true
        };

    }





    getUsersListing = async (policy = 'network-only') => {
        const { client, currentUser } = this.props;
        try {
            const userId = get(currentUser, 'id', null);

            if (userId !== null) {

                const { data } = await client.query({
                    query: gql(getUserById),
                    variables: {
                        id: userId,
                    },
                    fetchPolicy: policy,
                });
                console.log("data", data);
                const result = get(data, 'getUser', null);
                console.log("result length", result)
                this.setState({
                    resultData: result,
                    loading: false
                });
            }
        } catch (error) {
            console.log(error);
            this.setState({
                loading: false
            });
        }
    }

    async componentDidMount() {
        await this.getUsersListing();
        let url = '';
        if (
            [
                'localhost',
                'erinapp-dev.netlify.app',
                'erinapp-load-test.netlify.app',
                'testing.erinapp.com',
                'referralstest.aus.com',
                'qa.referafriend.seaworldentertainment.com',
            ].includes(getDomain())
        ) {
            url =
                '';
        } else {
            url =
                '';
        }
        await this.setQueryToState(get(this.state, 'searchQuery', ''), 0);
    }


    setQueryToState = async (searchQuery = '', timeout = 500) => {
        const {
            company,
            filteredDepartments = [],
            filteredRoles = [],
            filteredStatus = 'all',
        } = this.state;
        this.setState({ searchQuery });
        clearTimeout(this.timer);
        if (searchQuery === '' && filteredDepartments.length <= 0) {
            this.setState({
                loading: false,
                searchedEmployees: [],
            });
        }
        this.setState({ loading: true });
        this.timer = setTimeout(async () => {
            const params = {
                query: searchQuery,
                size: 1000,
                role: get(this.props, 'currentUser.role'),
                filters: {
                    companies: get(company, 'id'),
                    departments: filteredDepartments,
                    roles: filteredRoles,
                    active: filteredStatus,
                    openToNewRole: true,
                },
            };

            const response = await searchUserDataNetwork(params);
            if (get(response, 'query') === get(this.state, 'searchQuery')) {

                this.setState({
                    loading: false,
                    searchedEmployees: [...get(response, 'data', [])],
                });
            }
            // console.log(this.state.searchedEmployees[0]?.firstName);
        }, timeout);
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <FlatList
                    data={this.state.searchedEmployees}
                    ListEmptyComponent={() => (

                        <View style={{ width: wpx(400), height: hpx(300), justifyContent: 'flex-end', alignItems: 'center' }}>
                            {this.state.loading == false ?
                                <Text style={{ fontSize: nf(16), fontWeight: 'bold' }}>There are not any employees available.</Text> :
                                <ActivityIndicator size="large" />
                            }
                        </View>

                    )}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8, width: width - 10, marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <Text style={{ marginTop: 5, fontWeight: 'bold', fontSize: 15 }} >{customTranslate('ml_Name') + ' : '}</Text>
                                    <Text style={{ marginTop: 5 }} >{item?.firstName + " " + item?.lastName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <Text style={{ marginTop: 5, fontWeight: 'bold', fontSize: 15 }} >{customTranslate('ml_Email') + ' : '}</Text>
                                    <Text style={{ marginTop: 5 }} >{item?.emailAddress}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <Text style={{ marginTop: 5, fontWeight: 'bold', fontSize: 15 }}  >{customTranslate('ml_Job_title') + ' : '}</Text>
                                    <Text style={{ marginTop: 5, width: width / 1.25 }} >{item?.title}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <Text style={{ marginTop: 5, fontWeight: 'bold', fontSize: 15 }} >{customTranslate('ml_Department') + ' : '}</Text>
                                    <Text style={{ marginTop: 5 }} >{item?.department?.name}</Text>
                                </View>
                                {/* <Text style={{ marginTop: 5 }}>{customTranslate('ml_Email') + ' : ' + item?.emailAddress}</Text>
                                        <Text style={{ marginTop: 5 }}>{customTranslate('ml_Job_title') + ' : ' + item?.title}</Text>
                                        <Text style={{ marginTop: 5 }}>{customTranslate('ml_Department') + ' : ' + item?.department?.name}</Text> */}

                            </View>
                        )
                    }}
                />



            </View>
        )
    }
}


const mapStateToProps = (state) => {
    const { currentUser } = state.user;
    return {
        currentUser,
    };
};
export default connect(
    mapStateToProps,
)(withApollo(MobilityRoles));
