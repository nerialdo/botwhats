import { useContext } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../../contexts/AuthContext';


const Login = ({handlerLogin}) => {
  const { signIn } = useContext(AuthContext);

  const onFinish = async (data) => {
      console.log('Received values of form: ', data);
      try {
        const dadosCadastro = await signIn(data) 
        console.log('dados do login', dadosCadastro)
      } catch (error) {
        console.log('Error onFinish login', error, error.response)
      }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <div>
        <h2>Entre com seus dados</h2>
      </div>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Este campo é obrigatório!',
          },
        ]}
      >
        <Input className='imputForm' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Seu e-mail" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Este campo é obrigatório!',
          },
        ]}
      >
        <Input
            className='imputForm' 
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Senha"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Lembrar dados</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Esqueci minha senha
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Entrar
        </Button>
        <div className='linkBtn'>
            <Button type="secondary" onClick={handlerLogin} className="login-form-button">
              Cadastre-se
            </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
export default Login;
  