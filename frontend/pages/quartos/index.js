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
import Quartos from '../../components/Cadastros/Quartos';
import { api } from '../../services/api';


export default function Home() {
  const {isAuthenticated, user, signout} = useContext(AuthContext);
  const [addVisible, setAddVisible ] = useState(false)
  const [quartos, setQuartos ] = useState([])
  const [quarto, setQuarto ] = useState(null)

  const { Content, Footer } = Layout;


  useEffect(() => {
    listarQuartos()
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
    setQuarto(null)
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'quarto_nome',
      key: 'quarto_nome',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Valor',
      dataIndex: 'quarto_valor_hora',
      key: 'quarto_valor_hora',
      render: text => <span>{moedaBR(text)}</span>
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: tags => (
        <Tag color={'geekblue'} key={'loser'}>
            {tags}
        </Tag>
      ),
    },
    {
      title: 'Ação',
      key: 'acao',
      render: (text, record) => (
        <>
            <Tooltip placement="bottom" title={'Editar quarto'}>
                <Button onClick={() => {show(text.id)}} style={{background: 'green', color: '#fff'}}>Editar</Button>
            </Tooltip>
            <Popconfirm
                title="ATENÇÂO: ao excluir este quarto todos os seus registros serão excluídos, sem possibilidade de restauração, deseja continuar?"
                onConfirm={() => {confirm(text.id)}}
                onCancel={cancel}
                okText="Sim"
                cancelText="Não"
            >
                <Tooltip placement="bottom" title={'Excluir quarto'}>
                    <Button style={{background: 'red', color: '#fff'}}>Excluir</Button>
                </Tooltip>
            </Popconfirm>
        
        </>
      ),
    },
  ];

  function limparStateQuarto(){
    setQuarto(null)
  }

  async function show(id){
    var key = 'show';
    message.loading({ content: 'Buscando dados do quarto, aguarde ...', key });
    try {
        const {data: edit} = await api.get(`/quarto/${id}`);
        console.log("edit", edit)
        message.success({ content: 'Dados do quarto carregado com sucesso!', key });
        setQuarto(edit)
        showDrawer()
      } catch (error) {
        console.log("Erro buscar dados para editar", error, error.response);
        message.error({ content: 'Erro ao buscar dados do quarto', key, duration: 2 });
      }
  }

  async function deletar(id) {
    var key = 'excluir';
    message.loading({ content: 'Excluíndo o quarto, aguarde ...', key });
    try {
      const {data: prod} = await api.delete(`/quarto/${id}`);
      console.log("prod", prod)
      message.success({ content: 'quarto excluído com sucesso!', key });
      listarQuartos()
    } catch (error) {
      console.log("Erro ao deletar", error, error.response);
      message.error({ content: 'Erro ao excluir quarto', key, duration: 2 });
    }
  }


  async function listarQuartos(){
    var key = 'listar'
    try {
      const {data : result} = await api.get('quarto');
      console.log("Result quarto", result)
      setQuartos(result)
      message.success({ content: 'Todos os quartos foram listados!', key });
    } catch (error) {
      console.log("Erro ao buscar quartos", error, error.response);
      message.error({ content: 'Erro ao listar quartos', key, duration: 2 });
    }
  }


  function moedaBR(amount, decimalCount = 2, decimal = ",", thousands = "."){
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
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
            <Breadcrumb.Item>quartos</Breadcrumb.Item>
            <Breadcrumb.Item>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                Novo quarto
            </Button>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.siteLayoutBackground} style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={quartos} />
          </div>
        </Content>
        {addVisible && (
            <Quartos 
                addVisible={addVisible}
                showDrawer={showDrawer}
                hiddeDrawer={hiddeDrawer}
                quarto={quarto}
                listarQuartos={listarQuartos}
                limparStateQuarto={limparStateQuarto}
            />
        )}
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}
