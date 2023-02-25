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
import Produtos from '../../components/Cadastros/Produtos';
import { api } from '../../services/api';


export default function Home() {
  const {isAuthenticated, user, signout} = useContext(AuthContext);
  const [addVisible, setAddVisible ] = useState(false)
  const [movimentacoes, setMovimentacoes ] = useState([])
  const [produtos, setProdutos ] = useState([])
  const [produto, setProduto ] = useState(null)

  const { Content, Footer } = Layout;


  useEffect(() => {
    listarMovimentacoes()
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
    setProduto(null)
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'produto_nome',
      key: 'produto_nome',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Qto',
      dataIndex: 'produto_qto',
      key: 'produto_qto',
    },
    {
      title: 'Valor',
      dataIndex: 'produto_valor',
      key: 'produto_valor',
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
            <Tooltip placement="bottom" title={'Editar produto'}>
                <Button onClick={() => {show(text.id)}} style={{background: 'green', color: '#fff'}}>Editar</Button>
            </Tooltip>
            <Popconfirm
                title="ATENÇÂO: ao excluir este produto todos os seus registros serão excluídos, sem possibilidade de restauração, deseja continuar?"
                onConfirm={() => {confirm(text.id)}}
                onCancel={cancel}
                okText="Sim"
                cancelText="Não"
            >
                <Tooltip placement="bottom" title={'Excluir produto'}>
                    <Button style={{background: 'red', color: '#fff'}}>Excluir</Button>
                </Tooltip>
            </Popconfirm>
        
        </>
      ),
    },
  ];

  function limparStateProduto(){
    setProduto(null)
  }

  async function show(id){
    var key = 'show';
    message.loading({ content: 'Buscando dados do produto, aguarde ...', key });
    try {
        const {data: edit} = await api.get(`/produto/${id}`);
        console.log("edit", edit)
        message.success({ content: 'Dados do produto carregado com sucesso!', key });
        setProduto(edit)
        showDrawer()
      } catch (error) {
        console.log("Erro buscar dados para editar", error, error.response);
        message.error({ content: 'Erro ao buscar dados do produto', key, duration: 2 });
      }
  }

  async function deletar(id) {
    var key = 'excluir';
    message.loading({ content: 'Excluíndo o produto, aguarde ...', key });
    try {
      const {data: prod} = await api.delete(`/produto/${id}`);
      console.log("prod", prod)
      message.success({ content: 'Produto excluído com sucesso!', key });
      listarProdutos()
    } catch (error) {
      console.log("Erro ao deletar", error, error.response);
      message.error({ content: 'Erro ao excluir produto', key, duration: 2 });
    }
  }


  async function listarMovimentacoes(){
    var key = 'listar'
    try {
      const {data : result} = await api.get('movimentacao');
      console.log("Result movimentacao", result)
      setMovimentacoes(result)
      message.success({ content: 'Todos as movimetanções foram listadas!', key });
    } catch (error) {
      console.log("Erro ao buscar movimentações", error, error.response);
      message.error({ content: 'Erro ao listar movimentações', key, duration: 2 });
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
            <Breadcrumb.Item>Movimentações</Breadcrumb.Item>
            <Breadcrumb.Item>
            {/* <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                Novo produto
            </Button> */}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.siteLayoutBackground} style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={movimentacoes} />
          </div>
        </Content>
        {addVisible && (
            <Produtos 
                addVisible={addVisible}
                showDrawer={showDrawer}
                produto={produto}
                listarMovimentacoes={listarMovimentacoes}
                limparStateProduto={limparStateProduto}
            />
        )}
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}
