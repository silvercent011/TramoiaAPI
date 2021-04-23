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

        //Fazendo a requisição e obtendo todas as missions do lab
        const missionsArray = await Promise.all(project['missions'].map(async (mission) => {
            const labMission = await axios.get(`${process.env.APIBASE}/projects/v1/mission/${mission.id}`, {headers: {"Authorization": `Bearer ${access_token}`}})
            return labMission.data
        }))
        
        //Obtendo as estatísticas de cada uma das missions
        const missionsStatistics = await Promise.all(missionsArray.map(async mission => {
           const missionStatistic = await axios.get(`${process.env.APIBASE}/projects/v1/mission/${mission.id}/statistics`, {headers: {"Authorization": `Bearer ${access_token}`}})
           return missionStatistic.data
        }))

        //Mapeia o array de missions, e coloca em cada um dos pontos as suas respectivas estatísticas
        missionsArray.forEach(mission => {
            mission.points.forEach(point => {
                projectEngagement.data.forEach(proj => {
                    if(proj.id === point.id) {
                        point['statistic'] = proj
                    }
                })
            })
        })

        //Mapeamento do array de missions onde é adicionado ao JSON as estatísticas gerais de cada uma das missions
        missionsArray.map((mission, index) => {
            mission['statistics'] = missionsStatistics[index]
        })

        project['missions'] = missionsArray

        return res.send(project)
        
    } catch (error) {
        //Retorna erros se os métodos acima falharem
        return res.send({error:error})
    }
});


module.exports = router;