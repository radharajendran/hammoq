import React, { useState, useEffect } from 'react';
import { Form, Input, Layout, Button, Upload, Row, Col, message, Image, Modal, Space } from 'antd';
import { PoweroffOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { post, put, get, remove } from '../shared/http-service'
import updateUser from './../store/dispatcher'

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

  let { id } = useParams();

  const userData = useSelector(data => data);
  const dispatch = useDispatch()

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };
  /**
   * Bind user details when refresh
   */
  const fetchUser = () => {
    get(`/user_info/${id}`)
      .then((res) => {
        if (res.error) {
          message.error(res.message);
        }
        else {
          form.setFieldsValue(res);
          setState((state) => ({
            ...state,
            imageData: arrayBufferToBase64(res.imageBase64),
            imageType: res.imageType
          }));
        }

      })
      .catch((error) => {
        console.error(`Error occured in Password reset ${error}`);
        message.error('Error occured in Password reset');
      });
  }

  /**
   * Delete user fields
   */
  const handleDeleteField = (field) => {

    let data = { id: id, field: field }

    remove(`/delete_user_info`, data)
      .then((res) => {

        if (res.error) {
          message.error(res.message);
        }
        else {
          message.success('Delete successfully completed');
        }

      })
      .catch((error) => {
        console.error(`Error occured in delete field ${error}`);
        message.error('Error occured in delete field');
      });
  }

  useEffect(() => {

    if (id) {
      /** User store data to get user details after logged in */
      if (userData) {

        console.log('userData---->', userData);
        form.setFieldsValue(userData);

        setState((state) => ({
          ...state,
          imageData: userData.imageBase64,
          imageType: userData.imageType
        }));
      }
      else {
        fetchUser(id);
      }

    }

  }, []);


  const [state, setState] = useState({
    fileList: null,
    isEdit: false,
    modalVisible: false
  });

  /**
   * Signup API handling
   */
  const handleSubmit = (values) => {

    let {
      password,
      confirmPassword
    } = values

    //If id available trigger update event
    if (id) {
      return handleUpdate(values);
    }

    if (!state.imageFile) {
      message.error('Please upload Profile Photo ');
      return;
    }

    if (!id && (password != confirmPassword)) {
      message.error('Password and confirm password should be match');
      return;
    }

    let formData = new FormData();

    for (let key in values) {
      formData.append(key, values[key])
    }

    formData.append('file', state.imageFile);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    post(`/create_user`, formData, config)
      .then((res) => {

        if (res.error) {
          message.error(res.message);
        }
        else if (res._id) {
          message.success('Registration successfully completed');
          window.location.href = '/#/login';
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

  /**
   * Clear Form
   */
  const handleClear = () => {
    form.resetFields();
  }

  /**
   * Form submit event for Reset Password
   * @param {JSON} values 
   * @returns 
   */
  const handleResetPassword = (values) => {

    if (values.newPassword != values.confirmPassword) {
      message.error('Password Mismatch');
      return;
    }

    if (values.oldPassword == values.newPassword) {
      message.error('Old and New password should not be same');
      return;
    }

    values.id = id;
    put(`/reset_password`, values)
      .then((res) => {

        if (res.error) {
          message.error(res.message);
        }
        else {
          message.success('Password reset completed');
          window.location.href = '/#/login';
        }

      })
      .catch((error) => {
        console.error(`Error occured in Password reset ${error}`);
        message.error('Error occured in Password reset');
      });
  }

  /**
   * Update user Info
   */
  const handleUpdate = (values) => {

    values.id = id;
    put(`/update_user_info`, values)
      .then((res) => {

        if (res.error) {
          message.error(res.message);
        }
        else {
          message.success('Update successfully completed');
        }

      })
      .catch((error) => {
        console.error(`Error occured in Update ${error}`);
        message.error('Error occured in Update');
      });

  }

  /*
   * To return base64 image
   */
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  /**
   * Handling File control events
   * @param {*} info
   */
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

  const renderUpload = () => {
    if (id) {
      return (
        <img height="130px" width="130px" src={`data:${state.imageType};base64,${state.imageData}`} />
      )
    }
    else {
      return (
        <Upload
          listType="picture-card"
          fileList={state.fileList}
          accept="image/jpeg, image/png, image/png, image/bmp"
          onChange={onFileChange}
          onPreview={handlePreview}
          customRequest={customRequest}
          maxCount="1"
        >
          <Button
            icon={<UploadOutlined />}>Photo</Button>
        </Upload>
      )
    }

  }

  /**
   * Handling preview uploaded profile pic
   * @param {file} file
   */
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
            <Col span={18}>
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
                label="Last Name"
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
                    required: true,
                    message: 'Please input your Email!',
                  },
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
                style={{ display: id ? 'none' : '' }}
                rules={[
                  {
                    required: id ? false : true,
                    message: 'Please input your password!'
                  }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                style={{ display: id ? 'none' : '' }}
                rules={[
                  {
                    required: id ? false : true,
                    message: 'Please input your password!'
                  }]}
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
                  {id ? 'Update' : 'Register'}
                </Button>
                <Button className="btn-space" onClick={handleClear} htmlType="button">
                  Clear
                </Button>
                <Button style={{ display: id ? '' : 'none' }}
                  onClick={() => {
                    setState((state) => ({
                      ...state,
                      modalVisible: true
                    }));
                  }}
                  className="btn-space" htmlType="button">
                  Reset Password
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                {renderUpload()}
              </Form.Item>
            </Col>
          </Row>

        </Form>

        {/* Reset passwor modal dialog box */}
        <Modal
          title="Reset Password"
          visible={state.modalVisible}
          onCancel={() => {
            setState((state) => ({
              ...state,
              modalVisible: false
            }));
          }}
          okButtonProps={{ form: 'reset-password-form', key: 'submit', htmlType: 'submit' }}

        >
          <Form id="reset-password-form" layout="vertical" onFinish={handleResetPassword} >
            <Form.Item
              label="Old Password"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your Old password!'
                }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your New password!'
                }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please Confirm your password!'
                }]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>

  );
};

export default RegistrationForm