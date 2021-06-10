import React, { useState } from 'react';
import { Form, Input, Layout, Button, Upload, Row, Col, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import { post } from '../shared/http-service'


import './user.css';


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


const RegistrationForm = () => {
  const [form] = Form.useForm();


  const [state, setState] = useState({
    fileList: null
  });

  const handleSubmit = (values) => {
    console.log('Received values of form: ', values);

    let formData = new FormData();

    for (let key in values) {
      formData.append(key, values[key])
    }

    formData.append('file', state.imageFile);

    const config = {
      headers: {
        'content-type': 'multipart/form-data boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
      },
    };

    post(`/create_user`, formData, config)
      .then((res) => {

        if (res.error) {
          message.error(res.message);
        }
        else if (res._id) {
          message.success('Registration successfully completed');
        }

      })
      .catch((error) => {
        console.error(`Error occured in registration ${error}`);
        message.error('Error occured in registration');
      });

  };

  const customRequest = ({ file, onSuccess }) => {
    onSuccess("ok");
  }

  const handleUpload = ({ file, onSuccess }) => {
    setState((state) => ({
      ...state,
      file: file
    }));
    onSuccess("ok");
  }

  /*
   * To return base64 image
   */
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const onFileChange = async (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    if (info.file && info.file.status === 'uploading') {

      getBase64(info.file.originFileObj, imageUrl => {
        setState((state) => ({
          ...state,
          imageFile: info.file.originFileObj
        }));
      });

    }

    setState((state) => ({
      ...state,
      fileList: fileList,
      imageFile: info.file.originFileObj
    }));

  }

  const handlePreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div>
      {<PlusOutlined />}
      <div style={{ marginTop: 8 }}>Profile Photo</div>
    </div>
  );

  return (

    <div>
      <Layout>
        <Header style={{ color: "white", textAlign: "Left", fontSize: "large" }}>Sign Up</Header>
      </Layout>
      <div style={{ textAlign: "center", width: "75%", marginTop: "15px" }}>

        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          <Row>
            <Col span={20}>
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
                name="confirmPassword"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    pattern: /^(?:\d*)$/,
                    message: 'The input is not valid Phone Number!',
                  },
                  {
                    maxLength: 10,
                    message: "Value should be length 10",
                  },
                ]}
              >
                <Input />

              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
                <Button className="btn-space" htmlType="submit">
                  Clear
                </Button>
                <Button className="btn-space" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item >
                <Upload
                  listType="picture-card"
                  fileList={state.fileList}
                  accept="image/jpeg, image/png, image/png, image/bmp"
                  onChange={onFileChange}
                  onPreview={handlePreview}
                  customRequest={customRequest}
                  maxCount="1"
                >
                  <Button icon={<UploadOutlined />}>Photo</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </div>
    </div>

  );
};

export default RegistrationForm