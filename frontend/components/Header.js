import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { Layout, Menu,  } from 'antd';
import { Row, Col } from 'antd';
import { Button, Modal, Dropdown, message, Space, Tooltip, Tag } from 'antd';
import { Avatar, Image } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    DownOutlined,
    LoginOutlined
  } from '@ant-design/icons';
import styles from '../styles/Home.module.css';
import Login from './Login';

const Header = ({isAuthenticated, user, signout, numero}) => {
    const { Header, Content, Footer, Sider } = Layout;
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
       console.log('numero ', numero)
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleOk = () => {
        setIsModalVisible(false);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const menu = (
        <Menu style={{right: 20}} onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Configurações do perfil
          </Menu.Item>
          <Menu.Item onClick={signout} key="2" icon={<UserOutlined />}>
            Sair
          </Menu.Item>
        </Menu>
    );

    function handleMenuClick(e) {
        // message.info('Click on menu item.');
        console.log('click', e);
    }
    
    return(
        <>
        <Header className={styles.siteLayoutHeader} style={{ padding: 0 }} >
            <Content style={{ margin: '0 16px' }}>
                <Row>
                    <Col span={8}>
                        {isAuthenticated ? 'Olá: ' + user.name: 'Para continuar faça o login'}
                    </Col>
                    <Col span={8} offset={8}>
                        <div className={styles.iconeHeader}>
                            {/* {numero} */}
                            {numero == 'Quarto Ocupado\r' && (
                                <Tag color="#2db7f5">Portão entrada aberto</Tag>
                            )}
                            {numero == 'D0 75 26 83\r' && (
                                <Tag color="#f50">Portão entrada fechado</Tag>
                            )}
                            {!isAuthenticated && (
                                <Button onClick={showModal} type="primary" icon={<LoginOutlined />}>
                                    Login
                                </Button>
                            )}
                            {isAuthenticated && (
                                <Dropdown.Button overlay={menu} placement="bottomCenter" icon={<Avatar size={30} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}>
                                </Dropdown.Button>
                            )}
                        </div>
                    </Col>
                </Row>
            </Content>
        </Header>
        <Modal 
            title="Login" 
            visible={isModalVisible} 
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                  Sair
                </Button>,
            ]}
        >
            <Login handleCancel={handleCancel} />
        </Modal>
        </>
    )
}

export default Header;