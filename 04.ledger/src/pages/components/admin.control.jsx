import React, { useState } from 'react';
import { Button, Form, Input, Card, Typography } from 'antd';

let syncTimer = null;

function clearSyncTimer() {
  if (syncTimer) {
    clearInterval(syncTimer)
    syncTimer = null
  }
}

const AdminControl = () => {
  const [form] = Form.useForm();
  const [blockContent, setBlockContent] = useState('输入正确的地址，点击按钮开始同步！');

  const getSyncDBStatus = () => {
    fetch('http://127.0.0.1:8800/sync.db/progress', {
      method: 'GET',
    }).then(response => response.json())
      .then(response => {
        if (response.status === 'FAILED' || response.status === 'COMPLETE') {
          clearSyncTimer()
        }
        setBlockContent(response.messages.join('\n'))
      });
  }

  const handleBasicFormFinish = (values) => {
    let formFields = form.getFieldsValue()
    fetch('http://127.0.0.1:8800/sync.db', {
      method: 'POST',
      body: JSON.stringify({
        url1: formFields.clone_address,
        url2: formFields.to_do_address,
      })
    }).then(response => {
      setBlockContent('正在接受新的消息。。。')

      clearSyncTimer()
      syncTimer = setInterval(getSyncDBStatus, 500)

      setTimeout(function () {
        clearSyncTimer()
      }, 18000)
    });
  };

  const handleExportData = () => {
    fetch('http://127.0.0.1:8800/export.ledger_list', {
      method: 'GET',
    }).then(res => {
      return res.blob();
    }).then(blob => {
      let a = document.createElement('a');
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'file_name.text';
      a.click();
      a.remove();
    })
  }

  return (
    <>
      <Card type="inner" bordered={false} className='mb-4'>
        <Form name="basic"
          form={form}
          labelCol={{ span: 8, }}
          wrapperCol={{ span: 10, }}
          onFinish={handleBasicFormFinish}
        >
          <Form.Item name="clone_address" label="Clone Address" rules={[{ required: true, message: 'Required', },]} >
            <Input />
          </Form.Item>

          <Form.Item name="to_do_address" label="To-Do Address" rules={[{ required: true, message: 'Required', },]} >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
            <Button type="primary" htmlType="submit">Sync DB</Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 10, }}>
            <Typography.Paragraph>
              <pre>{blockContent}</pre>
            </Typography.Paragraph>
          </Form.Item>
        </Form>
      </Card>

      <Card type="inner" bordered={false}>
        <Button type="primary" onClick={() => handleExportData()}>Export Ledger list</Button>
      </Card>
    </>

  );
};
export default AdminControl;