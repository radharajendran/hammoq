import { Form, Input, Button, Layout, Row, Col, message } from 'antd';
import { post } from '../shared/http-service'

const { Header, Footer } = Layout;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const Login = () => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);

        const config = {
            headers: {
                'content-type': 'application/json',
            },
        };

        post(`/login`, values, config).then((res) => {

            if (res.error) {
                message.error(res.message);
            }
            else if (res._id) {
                message.success('Login successfully completed');
            }

        })
            .catch((error) => {
                console.error(`Error occured in Login ${error}`);
                message.error('Error occured in Login');
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const navigateSignUp = () => {
        window.location.href = '/#/signup';
    };

    return (
        <div>
            <Layout>
                <Header style={{ color: "white", textAlign: "left", fontSize: "large" }}>Sign In</Header>
            </Layout>
            <div style={{ width: "75%", marginTop: "15px" }}>
                <Form
                    {...layout}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input style={{ width: "300px" }} />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password style={{ width: "300px" }} />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Sign In
                        </Button>
                        <Button style={{ marginLeft: "5px" }} type="primary" htmlType="button" onClick={navigateSignUp}>
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Login;