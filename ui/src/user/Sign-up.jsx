import React, { useState } from 'react';
import { Form, Input, Layout, Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { post } from '../shared/http-service'

const { Header } = Layout;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 10,
    },
  },
  wrapperCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 10,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 12,
      offset: 0,
    },
    sm: {
      span: 12,
      offset: 8,
    },
  },
};

const handleSubmit = (values) => {
  console.log('Received values of form: ', values);

  post(`/create_user`, values)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });

}

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const uploadButton = (
    <div>
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (

    <div>
      <Layout>
        <Header style={{ color: "white", textAlign: "center", fontSize: "large" }}>Sign Up</Header>
      </Layout>
      <div style={{ textAlign: "center", width: "75%", marginTop: "15px" }}>

        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: 'Please input your First Name!',
              },
            ]}
            hasFeedback
          >
            <Input />
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
            >
              {uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            name="lastName"
            label="last Name"
            rules={[
              {
                required: true,
                message: 'Please input your Last Name!',
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="Birth Date"
            rules={[
              {
                required: true,
                message: 'Please input your Birth Date!',
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                type: 'number',
                message: 'The input is not valid Phone Number!',
              }
            ]}
          >
            <Input />

          </Form.Item>

          <Form.Item>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
            >
              {uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
          </Button>
          </Form.Item>
        </Form>
      </div>
    </div>

  );
};

export default RegistrationForm