import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { fetch_plus } from '@utils/common';
import {
  Button, Form, Input, message,
} from 'antd';

function App() {
  const onFinish = (values) => {
    fetch_plus('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    })
      .then((result) => {
        if (result.status === 0) {
          message.error(result.message);
        } else {
          localStorage.setItem('token', result.token);
          window.location.href = '/';
        }
      });
  };

  return (
    <main className="login-control font-14 py-4">
      <img src="../images/Road trip_Isometric.png" alt="" />
      <Form
        className="login-form"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            placeholder="请输入用户名"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password
            placeholder="请输入密码"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Button htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form>
    </main>
  );
}
export default App;
