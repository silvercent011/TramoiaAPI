const express = require('express');
const axios = require('axios')
const router = express.Router();
const Users = require('../models/user')

router.post('/', async (req, res) => {
    //Obtêm os dados de login dos headers
    const { username, password } = req.headers;
    try {
        //Verificando se username(email) e senha foram enviados
        if (!username || !password) return res.send({error:'Dados inválidos'});
        //Obtendo tokens da api do strateegia
        const api_signin_response = await axios.post(`${process.env.APIBASE}/users/v1/auth/signin`,{},{auth:{username:username, password:password}})
        const { access_token, refresh_token } = api_signin_response.data;
        //Obtendo dados da api utilizando o token obtido anteriormente
        const user_data = await axios.get(`${process.env.APIBASE}/users/v1/user/me`,{headers:{"Authorization":`Bearer ${access_token}`}});
        const final_data = JSON.parse(JSON.stringify(user_data.data));

        //Obtendo apartir do token JWT todos projetos que o usuario participa
        const userProjects = await axios.get(`${process.env.APIBASE}/projects/v1/project`, {headers:{"Authorization":`Bearer ${access_token}`}})
        const projects = userProjects.data


        //Fazendo parsing do tipo de planos, _id, adição do último login para se adequar ao Model e os projetos do usuario
        final_data['_id'] = final_data['id']
        final_data['plan_type'] = final_data['plan']['type']
        final_data['last_login'] = Date.now()
        final_data['projects'] = projects

        //Ambos os resultados abaixo retornam o mesmo item, apenas diferenciando se o login é o primeiro ou último.
        //Os tokens de acesso e refresh não são armazenados no servidor, são retornados para a aplicação

        if (await Users.findOne({_id:final_data['id']})) {
            //Entrará nesse loop se o usuário já estiver na nossa base de dados, atualizando seu campo de último login e também seus projetos, verificando se ele foi adcionado em um novo
            await Users.findOneAndUpdate({_id:final_data['id']}, {projects: projects}, (err, data) => {
            if(err){ //Retorna um erro para o dev caso não passe no update
                    console.log("ERRO", err)    
                } else {
                    console.log("DADOS", data)
                }
            })
            const ts = await Users.findOne({_id:final_data['id']})
            const toSend = ts.toObject()
            toSend['access_token'] = access_token
            toSend['refresh_token'] = refresh_token
            return res.send(toSend)
        } else {
            //Caso o usuário não conste no nosso banco de dados, será adicionado a data de primeiro login e será cadastrado
            final_data['first_login'] = final_data['last_login']
            const ts = await Users.create(final_data)
            const toSend = ts.toObject()
            toSend['access_token'] = access_token
            toSend['refresh_token'] = refresh_token
            return res.send(toSend)
        }
    } catch (error) {
        //Retorna erros se os métodos acima falharem
        return res.send({error:error})
    }
});


module.exports = router;