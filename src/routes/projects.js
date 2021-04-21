const express = require('express');
const axios = require('axios')
const router = express.Router();
const Project = require('../models/project')

router.get('/', async (req, res) => {
    //Obtêm os dados do body
    const { id, access_token } = req.headers;
    try {
        if (!id || !access_token) return res.send({error:'Dados inválidos'});

        //Obtendo apartir do token JWT todos projetos que o usuario participa
        const userProject = await axios.get(`${process.env.APIBASE}/projects/v1/project/${id}`, {headers:{"Authorization":`Bearer ${access_token}`}})
        //Obtendo estatísticas e engajamento do projeto
        const projectStatistics = await axios.get(`${process.env.APIBASE}/projects/v1/project/${id}/statistics`, {headers:{"Authorization":`Bearer ${access_token}`}})
        const projectEngagement = await axios.get(`${process.env.APIBASE}/projects/v1/project/${id}/content-engagement`, {headers:{"Authorization":`Bearer ${access_token}`}})

        const project = userProject.data
        project['statistics'] = projectStatistics.data
        project['engagement'] = projectEngagement.data

        return res.send(project)
        
    } catch (error) {
        //Retorna erros se os métodos acima falharem
        return res.send({error:error})
    }
});


module.exports = router;