import { createContext, useEffect, useState, useCallback } from "react";
import { recuperarInformacoesUsuario, signInRequest, cadastroRequest } from "../services/auth";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api, linkServer} from "../services/api";
// import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

import { message } from 'antd';

export const AuthContext = createContext({})

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [numero, setNumero] = useState(0);
    const [portaoEntrada, setPortaoEntrada] = useState('FECHADO');
    const [portaoSaida, setPortaoSaida] = useState('FECHADO');
    // const isAuthenticated = !!user

    useEffect(() => {
        const { 'saude_token' : token } = parseCookies()
        // console.log('token useEffect', token)
        if(token){
            recuperarInformacoesUsuario(token).then(response => {
                console.log("Dads ", response.user)
                setUser(response.user)
                setIsAuthenticated(true)
            })
        }
    }, [])

    // websocket
    // const { lastJsonMessage, sendMessage } = useWebSocket('ws://localhost:3001', {
    //     onOpen: () => console.log(`Connected to App WS`),
    //     onMessage: () => {
    //     if (lastJsonMessage) {
    //         console.log(lastJsonMessage);
    //         // setNumero(lastJsonMessage.n);
    //         if(lastJsonMessage.n === 'ENTRADA FECHADO\r' || lastJsonMessage.n === 'ENTRADA ABERTO\r'){
    //             setPortaoEntrada(lastJsonMessage.n)
    //         }
    //         if(lastJsonMessage.n === 'SAIDA FECHADO\r' || lastJsonMessage.n === 'SAIDA ABERTO\r'){
    //             setPortaoSaida(lastJsonMessage.n)
    //         }
    //     }
    //     },
    //     queryParams: { 'token': '123456' },
    //     onError: (event) => { console.error(event); },
    //     shouldReconnect: (closeEvent) => true,
    //     reconnectInterval: 3000
    // });

    async function cadastro({name, email, password}){
        try {
            const { user } = await cadastroRequest({ name, email, password })
            return user
        } catch (error) {
            console.log('error cadastro', error, error.response)            
        }
    }

    async function signIn({ email, password }){
        const { token, data } = await signInRequest({
            email,
            password
        })

        // console.log("fez o login", token.token)
        console.log("fez o login signIn", token, data)

        // recuperarInformacoesUsuario(token).then(response => {
        //     console.log("BUSCANDO DADOS USUARIO AO FAZER LOGIN ", response)
        //     setUser(response.user)
        //     setIsAuthenticated(true)
        //     Router.push('/')
        //     // document.location.reload(true);
        // })
        setUser(data)
        setIsAuthenticated(true)

        setCookie(undefined, 'saude_token', token)
        // setCookie(undefined, 'site_vinicius_token', token, {
        //     maxAge: 60 * 60 * 1 // 1 hour
        // })
    }

    async function signout() {
        destroyCookie(null, 'saude_token')
        setUser(null)
        setIsAuthenticated(false)
        Router.push('/')
        document.location.reload(true);
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            signIn, 
            signout,
            cadastro
        }} >
            {children}
        </AuthContext.Provider>
    )

}