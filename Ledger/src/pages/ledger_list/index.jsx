import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import * as moment from 'moment';
import {
  Card, Button, Space, Typography, DatePicker,
} from 'antd';
import i18n from '@i18n';
import LedgerListTable from './table';

// 渲染时间段控件
function RenderDatePickerControl({
  datePickerRange,
  setDatePickerRange,
}) {
  const currentWeek = [moment().startOf('week'), moment().endOf('week')];
  const currentMonth = [moment().startOf('month'), moment().endOf('month')];
  const currentYear = [moment().startOf('year'), moment().endOf('year')];
  return (
    <Space className="font-12">
      <Typography.Link onClick={() => setDatePickerRange(currentWeek)}>
        {i18n.t('current_week')}
      </Typography.Link>
      <Typography.Link onClick={() => setDatePickerRange(currentMonth)}>
        {i18n.t('current_month')}
      </Typography.Link>
      <Typography.Link onClick={() => setDatePickerRange(currentYear)}>
        {i18n.t('current_year')}
      </Typography.Link>
      <Typography.Link onClick={() => setDatePickerRange(-1)}>
        All
      </Typography.Link>
      <DatePicker.RangePicker
        value={datePickerRange}
        className="ml-2"
        onChange={(value) => {
          setDatePickerRange(value);
        }}
      />
    </Space>
  );
}
RenderDatePickerControl.propTypes = {
  datePickerRange: PropTypes.number.isRequired,
  setDatePickerRange: PropTypes.func.isRequired,
};

export default function LedgerList({
  setShowLedgerAddModal,
}) {
  const [datePickerRange, setDatePickerRange] = useState(-1); // -1 => 展示所有数据，其它展示指定时间段数据

  return (
    <Card type="inner" className="mb-4" style={{ minHeight: '300px' }}>
      {/* list table相关按钮操作区 */}
      <div className="space-between-flex mb-1">
        <div>
          <Button type="primary" className="mr-3" onClick={() => setShowLedgerAddModal(true)}>{i18n.t('add_items')}</Button>
          <Button type="primary" danger>{i18n.t('delete_selected')}</Button>
        </div>
        <RenderDatePickerControl
          datePickerRange={datePickerRange}
          setDatePickerRange={setDatePickerRange}
        />
      </div>

      {/* list table */}
      <LedgerListTable datePickerRange={datePickerRange} />
    </Card>
  );
}
LedgerList.propTypes = {
  setShowLedgerAddModal: PropTypes.func.isRequired,
};
