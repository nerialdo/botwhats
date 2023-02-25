import { useState, useContext } from 'react';
import { Layout } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';

import { AuthContext } from '../contexts/AuthContext';

const { Content } = Layout;

const Login = ({handleCancel}) => {
    const {signIn} = useContext(AuthContext);

    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            await signIn(values)
            handleCancel()
        } catch (error) {
            alert('Erro ao fazer login, verifique seus dados de acesso ou fale com o suporte')
            console.log("Erro onSubmit", error)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onValuesChange = (value) => {
        // console.log('onValuesChange:', value);
    };
    return(
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValuesChange}
            autoComplete="off"
            >
            <Form.Item
                label="Código"
                name="codigo"
                rules={[{ required: true, message: 'Infome seu codigo de acesso!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Senha"
                name="password"
                rules={[{ required: true, message: 'Infome sua senha de acesso!' }]}
            >
                <Input.Password />
            </Form.Item>

            {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Entrar
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Login;