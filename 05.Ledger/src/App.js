import { Card, Spin } from 'antd';
import React, { useState, useEffect } from 'react';

import ControlPanelForm from './components/control_panel.form'
import AddMultipleModal from './components/add_multiple.modal'
import LedgerTagsManageModal from './components/ledger_tags_manage.modal'
import LedgerListTable from './components/ledger_list.table'

const App = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [ledgerTags, setLedgerTags] = useState([]);
  const [ledgerList, setLedgerList] = useState([]);
  const [showAddMultiModal, setShowAddMultiModal] = useState(false);
  const [showLedgerTagsManageModal, setShowLedgerTagsManageModal] = useState(false);

  const get_ledger_list = () => {
    fetch('http://127.0.0.1:8800/ledger/list')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        setLedgerList(response.data || [])
      });
  }

  const get_ledger_tags = () => {
    fetch('http://127.0.0.1:8800/ledger/tags')
      .then(response => response.json())
      .then(response => {
        response.data.map(item => item.key = item._id)
        setLedgerTags(response.data || [])
      });
  }

  useEffect(() => {
    get_ledger_tags()
    get_ledger_list()
  }, []);

  return (
    <Spin spinning={isSpinning}>
      <div className='container'>
        <Card title="新增记录" type="inner" style={{ marginBottom: 20 }}>
          <ControlPanelForm
            classificationTags={ledgerTags}
            onRefreshData={() => get_ledger_list()}
            onShowMultiRecordsModal={value => setShowAddMultiModal(value)}
            onShowLedgerTagsManageModal={value => setShowLedgerTagsManageModal(value)}
          />
        </Card>

        <LedgerListTable classificationTags={ledgerTags} ledgerList={ledgerList} />
      </div>

      <AddMultipleModal
        classificationTags={ledgerTags}
        showAddMultiModal={showAddMultiModal}
        onShowAddMultiModal={value => setShowAddMultiModal(value)}
      />
      <LedgerTagsManageModal
        isSpinning={isSpinning}
        onIsSpinning={value => setIsSpinning(value)}
        classificationTags={ledgerTags}
        onRefreshClassificationTags={() => get_ledger_tags()}
        showLedgerTagsManageModal={showLedgerTagsManageModal}
        onShowLedgerTagsManageModal={value => setShowLedgerTagsManageModal(value)}
      />
    </Spin>
  );
};

export default App;