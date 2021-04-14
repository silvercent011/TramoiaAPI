const express = require('express');
const axios = require('axios')
const router = express.Router();

router.get('/', async (req, res) => {
    //Obtêm os dados do body
    const { id, access_token } = req.headers;
    try {
        if (!id || !access_token) return res.send({error:'Dados inválidos'});

        //Obtendo apartir do token JWT todos projetos que o usuario participa
        const userProject = await axios.get(`${process.env.APIBASE}/projects/v1/project/${id}`, {headers:{"Authorization":`Bearer ${access_token}`}})
        const project = userProject.data
        return res.send(project)
    } catch (error) {
        //Retorna erros se os métodos acima falharem
        return res.send({error:error})
    }
});


module.exports = router;