import { useState, useContext, useEffect} from 'react';
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css';
import { Layout, Menu, Breadcrumb,  } from 'antd';
import { Button, Dropdown, message, Space, Tooltip, Card, Avatar, Row, Col,
  Drawer, Form, Input, Select, DatePicker,
} from 'antd';
import {
  EditOutlined, 
  EllipsisOutlined, 
  SettingOutlined,
  DislikeFilled,
  LikeFilled,
  ProfileFilled,
  PlusOutlined
} from '@ant-design/icons';
import useWebSocket from 'react-use-websocket';
import SiderMenu from '../components/SiderMenu';
import Header from '../components/Header';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { getAPIClient } from '../services/axios';
import { parseCookies } from 'nookies'

import io from 'socket.io-client';
// import Movimentacao from '../components/Cadastros/Movimentacao';
// import Consumo from '../components/Cadastros/Consumo';

// const socket = io("http://127.0.0.1:3333");
const socket = io("ws://127.0.0.1:3333/");

// https://socket.io/get-started/private-messaging-part-1/
export default function Home() {
  const {isAuthenticated, user, signout} = useContext(AuthContext);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  const { Content, Footer } = Layout;


  useEffect(() => {
    // buscarDados()
  }, []);

  useEffect(() => {
    socket.on('news', (data) => {
      console.log('ouvindo aqui news', data)
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('ouvindo aqui disconnect')
      setIsConnected(false);
    });

    socket.on('pong', () => {
      console.log('ouvindo aqui pong')
      setLastPong(new Date().toISOString());
    });

    // return () => {
    //   socket.off('connect');
    //   socket.off('disconnect');
    //   socket.off('pong');
    // };
  }, []);

  const sendPing = () => {
    // socket.emit('ping');
    socket.emit('news', { my: 'data' })
  }


  // async function listarQuartos(){
  //   var key = 'listar'
  //   try {
  //     const {data : result} = await api.get('quarto');
  //     // console.log("Result quarto", result)
  //     setQuartos(result)
  //     message.success({ content: 'Todos os quartos foram listados!', key });
  //   } catch (error) {
  //     console.log("Erro ao buscar quartos", error, error.response);
  //     message.error({ content: 'Erro ao listar quartos', key, duration: 2 });
  //   }
  // }


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
          </Breadcrumb>
          <div className={styles.siteLayoutBackground} style={{ padding: 24, minHeight: 360 }}>
            <Row gutter={16}>
              <Col className="gutter-row" span={4}>
              <div>
      <p>Connected: { '' + isConnected }</p>
      <p>Last pong: { lastPong || '-' }</p>
      <button onClick={ sendPing }>Send ping</button>
    </div>
              </Col>
            </Row>
          </div>
        </Content>
        {/* {addVisible && movimentacao && (
          <Movimentacao 
            addVisible={addVisible}
            showDrawer={showDrawer}
            hiddeDrawer={hiddeDrawer}
            quartos={quartos}
            quarto={quarto}
            tipoRegistro={tipoRegistro}
            listarQuartos={listarQuartos}
            movimentacao={movimentacao}
            isAuthenticated={isAuthenticated}
            abrirConsumo={abrirConsumo}
          />
        )}
        {addVisibleConsumo && movimentacao && (
          <Consumo 
            addVisible={addVisibleConsumo}
            showDrawer={showDrawerConsumo}
            hiddeDrawer={hiddeDrawerConsumo}
            quarto={quarto}
            movimentacao={movimentacao}
            isAuthenticated={isAuthenticated}
            operador={user}
          />
        )} */}
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  console.log('context ', context)
  const apiClient = getAPIClient(context)
  const { ['saude_token'] : token } = parseCookies(context)
  
  if(!token){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  // await apiClient.get('/users')?

  return {
    props: {}, // will be passed to the page component as props
  }
}
