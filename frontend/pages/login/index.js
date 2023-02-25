import { useState, useContext, useEffect} from 'react';
import { Layout } from 'antd';
import Login from '../../components/Forms/Login';
import CadastroUsuario from '../../components/Forms/CadastroUsuario';
const { Header, Footer, Sider, Content } = Layout;

export default function Index() {
    const [login, setLogin] = useState(true)

    const handlerLogin = () => {
        setLogin(!login)
    }
    return (
        <Layout>
            <Content className='layoutLogin'>
                <div className='contentLogin'>
                    {login && (
                        <Login handlerLogin={handlerLogin} />
                    )}
                    {!login && (
                        <CadastroUsuario handlerLogin={handlerLogin} />
                    )}
                </div>
            </Content>
        </Layout>
    )
}