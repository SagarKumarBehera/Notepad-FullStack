const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},
    category:{type:String,required:true,enum:["Important","Local"]},
    createrId:{type: mongoose.Types.ObjectId, required: true}
});


const NoteModel = mongoose.model('Notes', noteSchema);

module.exports = NoteModel;
