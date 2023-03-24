import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TableList from './table';
import Dashboard from './dashboard';

function ListRender({ showDashboard }) {
  return showDashboard ? <Dashboard /> : <TableList />;
}
ListRender.propTypes = { // 使用prop-type进行类型检查
  showDashboard: PropTypes.bool.isRequired,
};
export default connect(
  (state) => ({ showDashboard: state.showDashboard }),
)(ListRender);
