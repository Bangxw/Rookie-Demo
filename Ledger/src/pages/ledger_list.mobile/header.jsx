/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import {
  Button, Popup, Divider, AutoCenter,
} from 'antd-mobile';
import { connect } from 'react-redux';
import { AppstoreOutline } from 'antd-mobile-icons';
import { ledgerSubtypesProptypes } from '@utils/proptypes.config';
import IconFont from '@components/iconfont';

function App({
  ledgerSubtypes,
}) {
  const [popVisiable, setPopVisiable] = useState();
  const [calendarPopup] = useState(false);

  return (
    <header className="p-3" style={{ background: '#1DA57A' }}>
      <div className="space-between-flex text-white">
        <Button
          size="small"
          onClick={() => setPopVisiable(true)}
          style={{
            '--background-color': 'rgba(0,0,0,0.25)',
            '--border-color': 'rgba(0,0,0,0.01)',
            color: '#fff',
          }}
        >
          全部分类
          <span className="mx-2" style={{ borderRight: '1px solid #ccc', display: 'inline-block', height: '14px' }} />
          <AppstoreOutline />
        </Button>
        <div className="pr-4 font-16">
          2023年3月
          <IconFont type="icon-triangle" className="font-12 ml-2" style={{ transform: 'rotate(180deg)', color: '#aaa' }} />
        </div>
      </div>

      <div className="text-white font-16 my-3 ml-2">总支出 ￥5005  总收入￥3456</div>

      <Popup
        position="top"
        bodyStyle={{ height: '40vh' }}
        visible={popVisiable}
        onMaskClick={() => setPopVisiable(false)}
      >
        <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
          <Button>全部分类</Button>
          <Divider contentPosition="left">左侧内容</Divider>
          <div>
            {
              ledgerSubtypes.map((item) => <Button className="m-2" key={item.key}>{item.text}</Button>)
            }
          </div>
        </div>
      </Popup>

      <Popup
        position="bottom"
        bodyStyle={{ height: '40vh' }}
        visible={calendarPopup}
        showCloseButton
        onMaskClick={() => setPopVisiable(false)}
      >
        <AutoCenter className="mt-3">请选择月份</AutoCenter>
        <Divider />
        <div style={{ height: '30vh', overflowY: 'auto' }}>
          <div>
            <AutoCenter style={{ color: '#ccc' }} className="mb-2">2022</AutoCenter>
            {
              Array(12).fill(null).map((item, index) => (
                <Button className="m-3" key={item}>{`${index + 1}月`}</Button>
              ))
            }
            <AutoCenter style={{ color: '#ccc' }} className="mb-2">2023</AutoCenter>
            {
              Array(12).fill(null).map((item, index) => (
                <Button className="m-2" key={item}>{`${index + 1}月`}</Button>
              ))
            }
          </div>
        </div>
      </Popup>
    </header>
  );
}

App.propTypes = { // 使用prop-type进行类型检查
  ...ledgerSubtypesProptypes,
};

export default connect(
  (state) => ({
    ledgerSubtypes: state.ledgerSubtypes,
  }),
)(App);
