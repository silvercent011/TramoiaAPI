const config = require('./config');
const port = config.port

// IMPORTS
// express
const express = require('express');
const app = express()
//cors
const cors = require('cors')
app.use(cors())

//BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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



//Execução
app.listen(port, ()=> {
    console.clear();
    console.log('TramoiaAPI, 2021');
    console.log(`Servidor rodando na porta ${port}`)
});