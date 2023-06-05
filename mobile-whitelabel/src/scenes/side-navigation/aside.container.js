import { connect } from 'react-redux';
import AsideComponent from './aside';

const mapStateToProps = state => {
  const { currentUser } = state.user;
  return {
    currentUser,
  };
};

export const Aside = connect(mapStateToProps)(AsideComponent);
