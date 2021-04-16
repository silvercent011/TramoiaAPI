const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  _id: {type: String, required: true, unique: true},
  statistics: {type: Object, default: null},
  engagement: {type: Object, default: null}
})

module.exports = mongoose.model('Project', ProjectSchema, 'projects');