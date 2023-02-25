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
import Profissional from '../../components/Cadastros/Profissional';
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
      title: 'Name',
      // dataIndex: 'nome',
      key: 'nome',
      // render: text => <a>{text}</a>,
      render: (text) => (
        <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'}}>
          <span style={{ fontSize: 17, fontWeight: 'bold' }}>{text.nome}</span>
          <span>{text.especialidades[0].name} - CBO {text.especialidades[0].cbo}</span>
        </div>
      )
    },
    {
      title: 'CNS',
      dataIndex: 'cns',
      key: 'cns',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      key: 'telefone',
      render: text => <span>{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
                title="ATENÇÂO: ao excluir este profissional todos os seus registros serão excluídos, sem possibilidade de restauração, deseja continuar?"
                onConfirm={() => {confirm(text.id)}}
                onCancel={cancel}
                okText="Sim"
                cancelText="Não"
            >
                <Tooltip placement="bottom" title={'Excluir profissional'}>
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
    message.loading({ content: 'Buscando dados do Profissional, aguarde ...', key });
    try {
        const {data: edit} = await api.get(`/profissionais/${id}`);
        // console.log("edit", edit.data)
        message.success({ content: 'Dados do Profissional carregado com sucesso!', key });
        setOperador(edit.data)
        showDrawer()
      } catch (error) {
        console.log("Erro buscar dados para editar", error, error.response);
        message.error({ content: 'Erro ao buscar dados do Profissional', key, duration: 2 });
      }
  }

  async function deletar(id) {
    var key = 'excluir';
    message.loading({ content: 'Excluíndo o Profissional, aguarde ...', key });
    try {
      const {data: prod} = await api.delete(`/profissionais/${id}`);
      console.log("prod", prod)
      message.success({ content: 'Profissional excluído com sucesso!', key });
      listarOperadores()
    } catch (error) {
      console.log("Erro ao deletar", error, error.response);
      message.error({ content: 'Erro ao excluir Profissional', key, duration: 2 });
    }
  }


  async function listarOperadores(){
    var key = 'listar'
    try {
      const {data : result} = await api.get('profissionais');
      console.log("Result profissionais", result.data)
      setOperadores(result.data)
      message.success({ content: 'Todos os Profissionais foram listados!', key });
    } catch (error) {
      console.log("Erro ao buscar Profissionais", error, error.response);
      message.error({ content: 'Erro ao listar Profissionais', key, duration: 2 });
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
            <Breadcrumb.Item>Profissionais</Breadcrumb.Item>
            <Breadcrumb.Item>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                Novo Profissional
            </Button>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.siteLayoutBackground} style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={operadores} />
          </div>
        </Content>
        {addVisible && (
            <Profissional 
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
