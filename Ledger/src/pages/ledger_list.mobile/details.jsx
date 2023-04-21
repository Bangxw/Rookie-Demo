/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  Button, Card,
} from 'antd-mobile';
import { connect } from 'react-redux';
import { ledgerSubtypesProptypes } from '@utils/proptypes.config';
import IconFont from '@components/iconfont';

function App({
  ledgerSubtypes,
}) {
  return (
    <Card
      title={(
        <div style={{ fontWeight: 'normal' }}>
          <IconFont type={ledgerSubtypes.find((_) => _.key === item.subtype)?.icon} />
          卡片标题
        </div>
      )}
      extra={<RightOutline />}
      onBodyClick={onBodyClick}
      onHeaderClick={onHeaderClick}
      style={{ borderRadius: '16px' }}
    >
      <div className={styles.content}>卡片内容</div>
      <div className={styles.footer} onClick={(e) => e.stopPropagation()}>
        <Button
          color="primary"
          onClick={() => {
            Toast.show('点击了底部按钮');
          }}
        >
          底部按钮
        </Button>
      </div>
    </Card>
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
