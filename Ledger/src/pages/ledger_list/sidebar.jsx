import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '@redux/actions';

function SideBar({
  showDashboard,
  handle_show_dashboard,
  handle_show_subtype_manage_modal,
}) {
  /* 书签式菜单 */
  return (
    <div className="bookmarks-menu">
      <ul>
        <li onClick={() => { handle_show_dashboard(!showDashboard); }} aria-hidden="true">
          Toggle Show
        </li>
        <li onClick={() => { handle_show_subtype_manage_modal(true); }} aria-hidden="true">
          Subtype Manage
        </li>
      </ul>
    </div>
  );
}
SideBar.propTypes = {
  showDashboard: PropTypes.bool.isRequired,
  handle_show_dashboard: PropTypes.func.isRequired,
  handle_show_subtype_manage_modal: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({ showDashboard: state.showDashboard }),
  {
    handle_show_dashboard: actions.handle_show_dashboard,
    handle_show_subtype_manage_modal: actions.handle_show_subtype_manage_modal,
  },
)(SideBar);
