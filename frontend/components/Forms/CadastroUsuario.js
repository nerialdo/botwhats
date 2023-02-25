import React, { useState, useContext } from 'react';
import {
  Form,
  Input,
  Button,
} from 'antd';
import { AuthContext } from '../../contexts/AuthContext';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const CadastroUsuario = ({handlerLogin}) => {
  const { cadastro, signIn } = useContext(AuthContext);

  const [form] = Form.useForm();

  const onFinish = async (data) => {
    try {
      const dadosCadastro = await cadastro(data) 
      await signIn(data)
    } catch (error) {
      console.log('Error onFinish login', error, error.response)
    }
  };

  return (
    <Form
      // {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      // layout="vertical"
    >
      <div>
        <h2>Novo cadastro</h2>
      </div>
      <Form.Item
        name="name"
        label="Seu nome"
        tooltip="Seu nome completo"
        rules={[
          {
            required: true,
            message: 'O campo Nome é obrigatório',
            whitespace: true,
          },
        ]}
      >
        <Input className='imputForm'/>
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        tooltip="Seu melhor E-mail"
        rules={[
          {
            type: 'email',
            message: 'Você não digitou um email válido',
          },
          {
            required: true,
            message: 'O campo E-mail é obrigatório',
          },
        ]}
      >
        <Input className='imputForm'/>
      </Form.Item>

      <Form.Item
        name="password"
        label="Senha"
        tooltip="Use sempre senhas fortes, com numeros, letras e caracteres especial"
        rules={[
          {
            required: true,
            message: 'Este campo é obrigatório',
          },
        ]}
        hasFeedback
      >
        <Input.Password className='imputForm' />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirmar"
        dependencies={['password']}
        tooltip="Confirme a senha usada"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Este campo é obrigatório',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('As duas senhas que você digitou não correspondem!'));
            },
          }),
        ]}
      >
        <Input.Password className='imputForm'/>
      </Form.Item>

      {/* <Form.Item
        name="phone"
        label="Celular"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item> */}

      <Form.Item 
      // {...tailFormItemLayout}
      >
        <div className='linkBtn'>
          <Button type="primary" className="login-form-button" htmlType="submit">
            Cadastrar
          </Button>
        </div>
        <div className='linkBtn'>
            <Button type="secondary" onClick={handlerLogin} className="login-form-button">
              Já tenho cadastro
            </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
export default CadastroUsuario;