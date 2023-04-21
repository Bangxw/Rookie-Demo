import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { fetch_plus } from '@utils/common';
import {
  Button, Form, Input, message, Card,
} from 'antd';
import { BrowserView, MobileView } from 'react-device-detect';

function LoginControl() {
  const onFinish = (values) => {
    fetch_plus('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    }).then((result) => {
      if (result.status === 0) {
        message.error(result.message);
      } else {
        localStorage.setItem('token', result.token);
        window.location.href = '/';
      }
    });
  };

  return (
    <>
      <h2 className="mb-5">Welcome Back!</h2>
      <Form
        className="login-form"
        layout="horizontal"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="登录名称"
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
          label="登录密码"
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
        <Button htmlType="submit" block className="mt-5">立即登录</Button>
      </Form>
    </>
  );
}

function Login() {
  return (
    <main className="login-control p-5">
      {/* 桌面浏览器视图 */}
      <BrowserView>
        <Card style={{ width: '400px', margin: '0 auto' }}>
          <LoginControl />
        </Card>
      </BrowserView>

      {/* 移动端显示 */}
      <MobileView>
        <LoginControl />
      </MobileView>
    </main>
  );
}
export default Login;
