/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
// import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Avatar, List,
  // Divider, Skeleton,
} from 'antd';
// import * as actions from '@redux/actions';
// import PropTypes from 'prop-types';
import RenderSubtype from '@components/render_subtype';

function App({
  ledgerBilllist, ledgerSubtypes,
}) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={ledgerBilllist}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
            title={(
              <div className="space-between-flex">
                <span>{moment(item.date).format('YYYY-MM-DD')}</span>
                <span>{item.amount}</span>
              </div>
            )}
            description={(
              <div className="space-between-flex">
                <span>
                  <RenderSubtype
                    subtype={ledgerSubtypes.find((_) => _.key === item.subtype)}
                  />
                </span>
                <span>{item.description}</span>
              </div>
            )}
          />
        </List.Item>
      )}
    />
  );
}

App.propTypes = { // 使用prop-type进行类型检查
  // ledgerBilllist: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.string.isRequired,
  //     date: PropTypes.number.isRequired,
  //     amount: PropTypes.number.isRequired,
  //     payway: PropTypes.string.isRequired,
  //     subtype: PropTypes.string.isRequired,
  //     description: PropTypes.string,
  //   }).isRequired,
  // ).isRequired,
  // ledgerCategory: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.string.isRequired,
  //     text: PropTypes.string.isRequired,
  //   }).isRequired,
  // ).isRequired,
  // ledgerSubtypes: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.string.isRequired,
  //     text: PropTypes.string.isRequired,
  //   }).isRequired,
  // ).isRequired,
  // datePickerRange: PropTypes.number.isRequired,
  // fetch_ledger_billlist_data: PropTypes.func.isRequired,
  // handle_app_spinning: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
    ledgerBilllist: state.ledgerBilllist,
  }),
  {
    // handle_app_spinning: actions.handle_app_spinning,
    // fetch_ledger_billlist_data: actions.fetch_ledger_billlist_data,
  },
)(App);
