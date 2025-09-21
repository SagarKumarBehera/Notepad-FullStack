const express = require('express')
const NoteModel = require('../Models/Notes')

const noteController = express.Router()

// get

noteController.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 12;
      
      let query = {};
  
      // Filtering 
      if (req.query.category) {
        query.category = req.query.category;
      }
  
      // Sorting 
      const sortOptions = {};
      if (req.query.sort) {
        sortOptions[req.query.sort] = req.query.order === "desc" ? -1 : 1;
      }
  
      // Searching with name
      if (req.query.title) {
        // Use a regex for partial matching
        query.title = { $regex: new RegExp(req.query.title, "i") };
      }
  
        query.createrId = req.userId;
      
      const totalItems = await NoteModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);
  
      const data = await NoteModel.find(query)
        .sort(sortOptions)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      res.json({
        data,
        page,
        totalPages,
        totalItems,
      });
    } catch (error) {
      res.send({ message: "Internal server error" });
    }
  });
  

// Create 

noteController.post('/create', async (req,res)=>{
    const userId = req.userId
    const {title, description, category} = req.body;
    if(!title || !description || !category){
        return res.send({msg:'Please fill all the details'})
    }
    try {
        const note = await NoteModel.create({
            title:title,
            description:description,
            category:category,
            createrId:userId,
        })
        res.send({msg:'Note created'})
        console.log(note)
    } catch (error) {
        console.log(error)
        res.send({msg:'Something went wrong'})
    }
});

// patch

noteController.patch('/edit/:id', async (req,res)=>{
    const id = req.params.id
    const createrId = req.userId
    try {
        const user = await NoteModel.findByIdAndUpdate({_id: id, createrId },{...req.body})
        if(user){
            res.send({ message:'Note Updated Successfully'})
            console.log(data)
        }
        else{
            res.send({ message:"Note data not found"});
        }
    } catch (error) {
        console.log(error)
        res.send({msg:'Something went wrong!!'})
    }
});

//delete

noteController.delete('/delete/:id', async (req,res)=>{
    const id = req.params.id
    const createrId = req.userId
    try {
        const user = await NoteModel.findByIdAndDelete({_id: id, createrId })
        if(user){
            res.send({ message:'Note delted Successfully'})
            console.log(data)
        }
        else{
            res.send({ message:"Note not found"});
        }
    } catch (error) {
        console.log(error)
        res.send({msg:'Something went wrong!!'})
    }
});

module.exports = noteController