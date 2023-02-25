import React, { useState, useContext, useEffect } from 'react';
import { Layout, Menu, Avatar,  } from 'antd';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router'

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    DownOutlined,
    HomeOutlined,
    AppstoreTwoTone,
    CalculatorTwoTone,
    HeartTwoTone,
    HeartOutlined,
    MehTwoTone,
    PieChartTwoTone,
    MedicineBoxOutlined
  } from '@ant-design/icons';

const SiderMenu = ({isAuthenticated, user}) => {
    
    const router = useRouter()
    const [collapsed, setCollapsed ] = useState(true);
    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;

    useEffect(() => {
        console.log('isAuthenticated, user', isAuthenticated, user)
    }, []);

    const onCollapse = collapsed => {
        console.log(collapsed);
        setCollapsed(collapsed)
    };

    const handleClick = (e) => {
        router.push(e)
    }


    return(
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className={styles.logo}>
                <Avatar style={{ backgroundColor: 'green', verticalAlign: 'middle'}} size="large" gap={4}>
                    M
                </Avatar>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" onClick={() => {handleClick('/')}} icon={<HomeOutlined />}>
                    Tela principal
                </Menu.Item>
                {user && (
                    <>
                        {/* {user.role === 'Admin' && isAuthenticated && (
                            <Menu.Item key="2" onClick={() => {handleClick('movimentacoes')}} icon={<CalculatorTwoTone />}>
                                Movimentação
                            </Menu.Item>
                        )}
                        {user.role === 'Admin' && isAuthenticated && (
                            <Menu.Item key="3" onClick={() => {handleClick('produtos')}} icon={<AppstoreTwoTone />}>
                                Produtos
                            </Menu.Item>
                        )}
                        {user.role === 'Admin' && isAuthenticated && (
                            <Menu.Item key="4" onClick={() => {handleClick('quartos')}} icon={<HeartTwoTone />}>
                                Quartos
                            </Menu.Item>
                        )} */}
                        {user.role === 'Admin' && isAuthenticated && (
                            <Menu.Item key="5" onClick={() => {handleClick('profissionais')}} icon={<HeartOutlined />}>
                                Atendimento
                            </Menu.Item>
                        )}
                        {user.role === 'Admin' && isAuthenticated && (
                            <Menu.Item key="5" onClick={() => {handleClick('profissionais')}} icon={<UserOutlined />}>
                                Profissional
                            </Menu.Item>
                        )}
                        {user.role === 'Admin' && isAuthenticated && (
                            <Menu.Item key="6" onClick={() => {handleClick('unidades')}} icon={<MedicineBoxOutlined />}>
                                Unidades
                            </Menu.Item>
                        )}
                        {/* {user.role === 'Admin' && isAuthenticated && (
                            <SubMenu key="sub1" icon={<PieChartTwoTone />} title="Relatório">
                                <Menu.Item key="7">Consumo</Menu.Item>
                                <Menu.Item key="8">Quartos</Menu.Item>
                                <Menu.Item key="9">Operadores</Menu.Item>
                            </SubMenu>
                        )} */}
                    </>
                )}
                
                {/* <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item> */}
            </Menu>
        </Sider>
    )
}

export default SiderMenu;