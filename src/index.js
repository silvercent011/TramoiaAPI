const config = require('./config');
const port = config.port

// IMPORTS
// express
const express = require('express');
const app = express()
//cors
const cors = require('cors')
app.use(cors())

//BodyParser OBS: O bodyparser foi descontinuado, a ideia é usar o próprio express, funciona do mesmo jeito e evita uns erros chatos que ficam aparecendo no console.
//const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//MongoDB
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const mongoose = require('mongoose');
const url = config.mongostring
mongoose.connect(url, options, () => { console.log('MongoDB Atlas localizado e conectado.') });
mongoose.connection.useDb('tramoia')

app.get('/', async (req, res) => {
    await res.json({status:'Tramoia Rodando'})
});

//Authentication
const auth = require('./routes/auth');
app.use('/auth', auth);

//Projects
const projects = require('./routes/projects');
app.use('/projects', projects);

//Execução
app.listen(port, ()=> {
    console.clear();
    console.log('TramoiaAPI, 2021');
    console.log(`Servidor rodando na porta ${port}`)
});