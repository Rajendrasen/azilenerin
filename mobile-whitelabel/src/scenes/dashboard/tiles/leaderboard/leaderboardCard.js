import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './leaderboard.component.style';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../../_shared/services/language-manager';
import {withApollo} from 'react-apollo';
import {COLORS} from '../../../../_shared/styles/colors';
import _ from 'lodash';
import {listUsersByPoints} from '../../../../_store/_shared/api/graphql/custom/dashboard/list-users-by-points.graphql';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import FontIcon from 'react-native-vector-icons/FontAwesome';

class BaseRefCard extends React.Component {
  state = {
    tab: 0,
    points: [],
    options: [
      {
        title: 'All (Top 10)',
      },
      {
        title: 'All (My Position)',
      },
    ],
    optionItem: '',
  };
  componentDidMount() {
    this.props.client
      .query({
        query: listUsersByPoints,
        variables: {
          companyId: this.props.currentUser.company.id,
        },
      })
      .then((res) => {
        // console.log('ress', res);
        let arr = _.get(
          res,
          'data.queryUsersByCompanyIdPointsIndex.items',
          [],
        ).filter((item) => item.points > 0&&item.role !== 'superAdmin');
        let sorted = _.orderBy(arr, 'points', 'desc').slice(0, 10);
        this.setState({points: sorted});
      });
  }
  renderRow = (index, name, digits, id) => {
    return (
      <View style={styles.textRow}>
        <Text
          style={[
            styles.cellText,
            id == this.props.currentUser.id && {color: COLORS.blue},
          ]}>
          {index}. {name}
        </Text>
        <Text
          style={[
            styles.cellText,
            {color: COLORS.grayMedium, fontWeight: 'bold'},
          ]}>
          {digits}
        </Text>
      </View>
    );
  };
  renderList = () => {
    if (this.state.tab == 0) {
      if (this.state.optionItem == 'All (My Position)') {
        let filteredList = this.props.topReferrers
          .filter((item) => item.totalReferrals !== null&&item.role !== 'superAdmin')
          .sort((a, b) => b.totalReferrals - a.totalReferrals);
        let index = filteredList.findIndex(
          (item) => item?.id === this.props?.currentUser?.id,
        );
        const startPoint = index - 5 < 0 ? 0 : index - 5;
        const beforeData = filteredList.slice(startPoint, index + 1);
        const afterData = filteredList.slice(index + 1, index + 5);
        const finalData = beforeData.concat(afterData);
        return filteredList.length > 0 ? (
          filteredList.map(
            (item, i) =>
              i > index - 6 && i < index + 5
                ? this.renderRow(
                    i + 1,
                    `${item?.firstName} ${item?.lastName}`,
                    item?.totalReferrals,
                    item.id,
                  )
                : null,
            // console.log("index",index,"i",i)
          )
        ) : (
          <Text style={[{alignSelf: 'center', margin: 10}, styles.cellText]}>
            No Data Available
          </Text>
        );
      } else {
        // let newSortedArray = this.props.topReferrers
        //   .filter((item) => item.role == 'employee')
        //   .slice(0, 10)
        //   .sort((a, b) => b.totalReferrals - a.totalReferrals);
        let newSortedArray = this.props.topReferrers
          .filter(
            (item) =>
              item.totalReferrals !== null && item.role !== 'superAdmin',
          )
          .slice(0, 10)
          .sort((a, b) => b.totalReferrals - a.totalReferrals);
        return this.props.topReferrers && this.props.topReferrers.length ? (
          newSortedArray?.map((item, i) => {
            // console.log('item', item);
            return this.renderRow(
              i + 1,
              `${item.firstName} ${item.lastName}`,
              item.totalReferrals == null || item.totalReferrals == undefined
                ? 0
                : item.totalReferrals,
              item.id,
            );
          })
        ) : (
          <Text style={[{alignSelf: 'center', margin: 10}, styles.cellText]}>
            No Data Available
          </Text>
        );
      }
    } else {
      if (
        this.state.optionItem == 'All (Top 10)' ||
        this.state.optionItem == ''
      ) {
        return this.state.points && this.state.points.length ? (
          this.state.points.map((item, i) =>
            this.renderRow(
              i + 1,
              `${item.firstName} ${item.lastName}`,
              item.points,
              item.id,
            ),
          )
        ) : (
          <Text style={[{alignSelf: 'center', margin: 10}, styles.cellText]}>
            No Data Available
          </Text>
        );
      } else {
        let index = this.state.points.findIndex(
          (item) => item?.id === this.props?.currentUser?.id,
        );
        const startPoint = index - 5 < 0 ? 0 : index - 5;
        const beforeData = this.state.points.slice(startPoint, index + 1);
        const afterData = this.state.points.slice(index + 1, index + 5);
        const finalData = beforeData.concat(afterData);
        return finalData.length > 0 ? (
          finalData.map((item, i) =>
            this.renderRow(
              i + 1,
              `${item.firstName} ${item.lastName}`,
              item.points,
              item.id,
            ),
          )
        ) : (
          <Text style={[{alignSelf: 'center', margin: 10}, styles.cellText]}>
            No Data Available
          </Text>
        );
      }
    }
  };

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  handleOptions = (item) => {
    this.hideMenu();
    this.setState({optionItem: item});
    if (this.state.optionItem == 'All (My Position)') {
      this.renderList();
    } else {
      this.renderList();
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={[styles.row]}>
          <TouchableOpacity
            onPress={() => this.setState({tab: 0, optionItem: ''})}
            style={[styles.cell, this.state.tab == 0 && styles.activeCell]}>
            <Text
              style={[
                styles.cellText,
                this.state.tab == 0 && styles.activeCellText,
              ]}>
              Referrals
            </Text>
          </TouchableOpacity>
          {this.props.currentUser?.company?.pointsSettings &&
            JSON.parse(this.props.currentUser?.company?.pointsSettings)
              .enabled && (
              <TouchableOpacity
                onPress={() => this.setState({tab: 1, optionItem: ''})}
                style={[styles.cell, this.state.tab == 1 && styles.activeCell]}>
                <Text
                  style={[
                    styles.cellText,
                    this.state.tab == 1 && styles.activeCellText,
                  ]}>
                  Points
                </Text>
              </TouchableOpacity>
            )}
        </View>
        <View style={{marginTop: 5}}>{this.renderList()}</View>
        <View
          style={{
            marginTop: 10,
            width: '100%',
            flexDirection: 'row',
          }}>
          <Text style={styles.title}>Showing :</Text>
          <View style={{width: '60%'}}>
            <Menu
              ref={this.setMenuRef}
              button={
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    onPress={this.showMenu}
                    style={{
                      color: COLORS.blue,
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      marginRight: 5,
                      fontSize: 13,
                      marginLeft: 10,
                    }}>
                    {this.state.optionItem == ''
                      ? this.state.options[0]?.title
                      : this.state.optionItem}
                  </Text>
                  <FontIcon
                    color={COLORS.blue}
                    name="caret-down"
                    size={20}
                    onPress={this.showMenu}
                  />
                </TouchableOpacity>
              }>
              {this.state.options.map((item) => (
                <MenuItem
                  key={item.title}
                  onPress={() => this.handleOptions(item.title)}>
                  {item.title}
                </MenuItem>
              ))}
            </Menu>
          </View>
        </View>
      </View>
    );
  }
}
export const LeaderBoardCard = withApollo(borderedTile(BaseRefCard));
