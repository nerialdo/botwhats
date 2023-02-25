import { useState, useContext, useEffect} from 'react';
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../../styles/Home.module.css';
import { Layout, Breadcrumb, Table, Tag, Space, Button, message, Tooltip, Popconfirm} from 'antd';
import { Row, Col } from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import SiderMenu from '../../components/SiderMenu';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/AuthContext';
import Unidades from '../../components/Cadastros/Unidades';
import { api } from '../../services/api';


export default function Home() {
  const {isAuthenticated, user, signout} = useContext(AuthContext);
  const [addVisible, setAddVisible ] = useState(false)
  const [operadores, setOperadores ] = useState([])
  const [operador, setOperador ] = useState(null)

  const { Content, Footer } = Layout;


  useEffect(() => {
    listarOperadores()
  }, []);

  function confirm(e) {
    console.log('exluíndo ', e);
    deletar(e)
    message.success('Excluíndo!');
  }
  
  function cancel(e) {
    console.log(e);
    message.error('Entemos que não deseja excluir');
  }

  const showDrawer = () => {
    setAddVisible(!addVisible)
  };
  const hiddeDrawer = () => {
    setAddVisible(!addVisible)
    setOperador(null)
  };

  const columns = [
    {
      title: 'Nome da unidade',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'CNES',
      dataIndex: 'cnes',
      key: 'cnes',
      render: text => <span>{text}</span>
    },
    // {
    //   title: 'Status',
    //   key: 'status',
    //   dataIndex: 'status',
    //   render: tags => (
    //     <Tag color={'geekblue'} key={'loser'}>
    //         {tags}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Ação',
      key: 'acao',
      render: (text, record) => (
        <>
            <Tooltip placement="bottom" title={'Editar operador'}>
                <Button onClick={() => {show(text.id)}} style={{background: 'green', color: '#fff'}}>Editar</Button>
            </Tooltip>
            <Popconfirm
                title="ATENÇÂO: ao excluir esta unidade todos os seus registros serão excluídos, sem possibilidade de restauração, deseja continuar?"
                onConfirm={() => {confirm(text.id)}}
                onCancel={cancel}
                okText="Sim"
                cancelText="Não"
            >
                <Tooltip placement="bottom" title={'Excluir operador'}>
                    <Button style={{background: 'red', color: '#fff'}}>Excluir</Button>
                </Tooltip>
            </Popconfirm>
        
        </>
      ),
    },
  ];

  function limparStateOperador(){
    setOperador(null)
  }

  async function show(id){
    var key = 'show';
    message.loading({ content: 'Buscando dados da unidade, aguarde ...', key });
    try {
        const {data: edit} = await api.get(`/unidade/${id}`);
        console.log("edit", edit)
        message.success({ content: 'Dados da unidade carregado com sucesso!', key });
        setOperador(edit)
        showDrawer()
      } catch (error) {
        console.log("Erro buscar dados para editar", error, error.response);
        message.error({ content: 'Erro ao buscar dados da unidade', key, duration: 2 });
      }
  }

  async function deletar(id) {
    var key = 'excluir';
    message.loading({ content: 'Excluíndo o operador, aguarde ...', key });
    try {
      const {data: prod} = await api.delete(`/unidade/${id}`);
      console.log("prod", prod)
      message.success({ content: 'operador excluído com sucesso!', key });
      listarOperadores()
    } catch (error) {
      console.log("Erro ao deletar", error, error.response);
      message.error({ content: 'Erro ao excluir operador', key, duration: 2 });
    }
  }


  async function listarOperadores(){
    var key = 'listar'
    try {
      const {data : result} = await api.get('unidades');
      console.log("Result unidades", result.data)
      setOperadores(result.data)
      message.success({ content: 'Todas as unidades foram listadass!', key });
    } catch (error) {
      console.log("Erro ao buscar operadores", error, error.response);
      message.error({ content: 'Erro ao listar unidades', key, duration: 2 });
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu 
        isAuthenticated={isAuthenticated} 
        user={user}
      />
      <Layout className={styles.siteLayout}>
        <Header 
          isAuthenticated={isAuthenticated}
          user={user}
          signout={signout}
        />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Unidades</Breadcrumb.Item>
            <Breadcrumb.Item>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                Nova Unidade
            </Button>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.siteLayoutBackground} style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={operadores} />
          </div>
        </Content>
        {addVisible && (
            <Unidades 
                addVisible={addVisible}
                showDrawer={showDrawer}
                hiddeDrawer={hiddeDrawer}
                dados={operador}
                listarDados={listarOperadores}
                limparStateDado={limparStateOperador}
            />
        )}
        <Footer style={{ textAlign: 'center' }}>WebAtiva ©2023. Todos os direitos reservados</Footer>
      </Layout>
    </Layout>
  )
}
