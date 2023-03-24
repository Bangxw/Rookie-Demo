import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, DatePicker, Row, Col, Space, Typography,
} from 'antd';
import { datPickerRangeProptypes } from '@utils/proptypes.config';
import * as actions from '@redux/actions';
import dayjs from 'dayjs';
import i18n from '@i18n';

// 渲染时间段选择控件
function RenderDatePickerControl({
  datePickerRange,
  handle_date_picker_range,
}) {
  const currentWeek = [dayjs().startOf('week'), dayjs().endOf('week')];
  const currentMonth = [dayjs().startOf('month'), dayjs().endOf('month')];
  const currentYear = [dayjs().startOf('year'), dayjs().endOf('year')];
  return (
    <Row>
      <Col xs={24} lg={12} className="my-2">
        <Space className="font-12">
          <Typography.Link onClick={() => handle_date_picker_range(currentWeek)}>
            {i18n.t('current_week')}
          </Typography.Link>
          <Typography.Link onClick={() => handle_date_picker_range(currentMonth)}>
            {i18n.t('current_month')}
          </Typography.Link>
          <Typography.Link onClick={() => handle_date_picker_range(currentYear)}>
            {i18n.t('current_year')}
          </Typography.Link>
          <Typography.Link onClick={() => handle_date_picker_range(-1)}>
            All
          </Typography.Link>
        </Space>
      </Col>
      <Col xs={24} lg={12}>
        <DatePicker.RangePicker
          value={datePickerRange}
          onChange={(value) => {
            handle_date_picker_range(value);
          }}
        />
      </Col>
    </Row>
  );
}
RenderDatePickerControl.propTypes = {
  ...datPickerRangeProptypes,
  handle_date_picker_range: PropTypes.func.isRequired,
};
const RenderDatePicker = connect(
  (state) => ({ datePickerRange: state.datePickerRange }),
  { handle_date_picker_range: actions.handle_date_picker_range },
)(RenderDatePickerControl);

/* list table相关按钮功能区 */
function Ribbon({
  handle_show_billlist_add_modal,
}) {
  return (
    <div className="space-between-flex mb-1">
      <div className="button">
        <Button
          type="primary"
          className="mr-3"
          onClick={() => handle_show_billlist_add_modal(true)}
        >
          {i18n.t('add_items')}
        </Button>
        <Button type="primary" danger>{i18n.t('delete_selected')}</Button>
      </div>

      <RenderDatePicker />
    </div>
  );
}
Ribbon.propTypes = {
  handle_show_billlist_add_modal: PropTypes.func.isRequired,
};
export default connect(
  () => ({}),
  { handle_show_billlist_add_modal: actions.handle_show_billlist_add_modal },
)(Ribbon);
