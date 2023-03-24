/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row, Col, List, Popover, Badge,
} from 'antd';
import RenderSubtype from '@components/render_subtype';
import { Column } from '@ant-design/plots';
import { filter_sort_data_by_date_range } from '@utils/common';
import { PAY_WAY_LIST } from '@src/const';
import {
  ledgerCategoryProptypes,
  ledgerSubtypesProptypes,
  ledgerBilllistProptypes,
} from '@utils/proptypes.config';

function PopHoverConteng(item, ledgerSubtypes) {
  const { subtype_id, payway } = item;
  // eslint-disable-next-line react/destructuring-assignment
  const subtype = ledgerSubtypes.find((_) => _.key === subtype_id);
  return (
    <div className="font-12">
      <RenderSubtype
        subtype={subtype}
      />
      <span className="mx-2">
        {PAY_WAY_LIST.find((_) => _.key === payway)?.label}
      </span>
      {item?.description}
    </div>
  );
}

function combine_same_one_date_data(data) {
  console.log(data);
  const combineData = [];
  let temp = {
    date: null, amount: 0, subtype: [], payway: [],
  };
  data
    .sort((a, b) => b.date - a.date)
    .forEach((item, index) => {
      if (!moment(item.date).isSame(temp.date, 'day')) {
        // 判断是不是同一天的数据
        if (index !== 0) {
          combineData.push({
            ...temp,
            key: index,
            amount: temp.amount.toFixed(2),
            subtype: Array.from(new Set(temp.subtype)), // 数组去重
            payway: Array.from(new Set(temp.payway)), // 数组去重
          });
        }
        temp = {
          date: item.date,
          amount: 0,
          subtype: [],
          payway: [],
        };
      }
      temp.amount += item.amount;
      temp.subtype.push(item.subtype_id);
      temp.payway.push(item.payway);
    });
  return combineData;
}

function Dashboard({
  ledgerBilllist, ledgerSubtypes, datePickerRange,
}) {
  const dashboardConfig = {
    data: filter_sort_data_by_date_range(
      combine_same_one_date_data(ledgerBilllist).reverse(),
      datePickerRange,
    ).map((item) => ({
      ...item,
      amount: parseInt(item.amount, 10),
      date: moment(item.date).format('yy-MM-DD'),
    })),
    xField: 'date',
    yField: 'amount',
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: '',
      height: 50,
    },
    tooltip: {
      customContent: (value) => {
        const currentDayList = ledgerBilllist.filter((item) => moment(value).isSame(moment(item.date), 'day'));
        return currentDayList.map((item) => (
          <div className="space-between-flex my-2">
            <RenderSubtype
              subtype={ledgerSubtypes.find(
                (_) => _.key === item.subtype_id,
              )}
            />
            <div className="clearfix font-12">
              <span style={{ float: 'right' }}>{`￥${item.amount}`}</span>
              {item.description && (
                <>
                  <br />
                  (
                  {item.description}
                  )
                </>
              )}
            </div>
          </div>
        ));
      },
    },
    label: {
      content: '111',
      position: 'top', // 'top', 'bottom', 'middle',
      style: {
        // 配置样式
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };
  const colorPresets = [
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'geekblue',
  ];

  return (
    <Row>
      <Col span={18}>
        {' '}
        <Column {...dashboardConfig} className="pt-5" />
      </Col>
      <Col span={5} offset={1}>
        <List
          size="small"
          header={<div>Top 10消费:</div>}
          dataSource={filter_sort_data_by_date_range(
            ledgerBilllist,
            datePickerRange,
          )
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10)}
          renderItem={(item, index) => (
            <List.Item>
              <Popover title={false} content={PopHoverConteng(item, ledgerSubtypes)}>
                <div className="space-between-flex width-100">
                  <span>
                    {index <= 2 ? (
                      <Badge count={index + 1} />
                    ) : (
                      <Badge color={colorPresets[index - 3]} className="px-2" />
                    )}
                    <span className="ml-1">
                      {moment(item.date).format('YY-MM-DD')}
                    </span>
                  </span>
                  <span>
                    ￥
                    {item.amount}
                  </span>
                </div>
              </Popover>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}
Dashboard.propTypes = { // 使用prop-type进行类型检查
  ...ledgerCategoryProptypes,
  ...ledgerSubtypesProptypes,
  ...ledgerBilllistProptypes,
  datePickerRange: PropTypes.number.isRequired,
};
export default connect(
  (state) => ({
    ledgerCategory: state.ledgerCategory,
    ledgerSubtypes: state.ledgerSubtypes,
    ledgerBilllist: state.ledgerBilllist,
    datePickerRange: state.datePickerRange,
  }),
)(Dashboard);
