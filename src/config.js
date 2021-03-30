require('dotenv').config();

module.exports = params = {
    mongostring : process.env.MONGOSTRING,
    apibase : process.env.APIBASE,
    port : process.env.PORT,
}