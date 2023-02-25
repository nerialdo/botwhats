import axios from 'axios';
import { parseCookies } from "nookies";

export function getAPIClient(ctx){
    // console.log("ctxctxctxctx", ctx)
    const { 'saude_token' : token } = parseCookies(ctx)

    const api = axios.create({
        // baseURL: 'https://sistema-fotos-vi.herokuapp.com'
        baseURL: 'http://localhost:3333/api'
        // baseURL: 'https://api.viniciusfotografia.com.br'
    })

    // if(token){
    //     api.defaults.headers['Autorization'] = `Bearer ${token}`
    // }
    api.interceptors.request.use(config => {
        // console.log("config getAPIClient", config);
        if(token){
            config.headers.Authorization =  `Bearer ${token}`;
        }
        return config
    })

    return api
}