
const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))
import { api } from "./api";
import { useRouter } from 'next/router'

export async function cadastroRequest(data){

    try {
        const response = await api.post("/users", {
            name: data.name,
            username: data.name,
            login_source: 'Normal',
            email: data.email.trim(),
            password: data.password
        });
        // console.log("Sucesso, ", response.data)
        //Alert.alert("Sucesso", response.data.token);
         return {
            user: {
                name: response.data.name,
                email: response.data.email,
                avatar_url: ''
            }
        }
    } catch (error) {
        console.log("Error ao se cadastrar", error, error.response)
        if(error.response.data.type === 'email_existe'){
            alert(error.response.data.message)
        }else{
            alert('Erro se cadastrar, fale com o suporte.')
        }
    }

}

export async function signInRequest(data){
    // console.log("data signInRequest, ", data)
    try {
        const response = await api.post("/sessions", {
          email: data.email.trim(),
          password: data.password
        });
        console.log("Sucesso, ", response.data)
        // console.log("Sucesso token gerado ", response.data.token)
        //Alert.alert("Sucesso", response.data.token);
        return  response.data
        
        // await AsyncStorage.setItem('@tokenEmpresa', response.data.token);

        // history.push('/admin');

    } catch (error) {
        console.log("Error ao fazer login", error, error.response)
        // if(error.response.data[0].field === 'password'){
        //     alert('A senha informada está incorreta!')
        // }
        // if(error.response.data[0].field === 'email'){
        //         alert('Não consta nenhum conta com esse email!')
        // }
    }
}

export async function recuperarInformacoesUsuario(token){

    console.log('token passado', token)

    var config = {
      headers: {Authorization: 'bearer ' + token},
    };
    
    try {
        // const {data: dadosuser} = await api.get(`/users`, config);
        // console.log("Dados dos dadosuser", dadosuser)
        // return {
        //     user: {
        //         name: dadosuser.user.name,
        //         codigo: dadosuser.user.codigo,
        //         role: dadosuser.roles,
        //         avatar_url: ''
        //     }
        // }

        return {
            user: {
                name: 'Nerialdo Ferreira',
                email: 'nerialdo@webativa.com.br',
                role: 'Admin',
                avatar_url: ''
            }
        }

    } catch (error) {
        console.log("Erro ao buscar dados do usuario", error, error.response);
    }

}