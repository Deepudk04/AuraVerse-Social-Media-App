const express = require('express');
const dotenv = require('dotenv');
const Post = require('./Models/Post');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const app = new express();
dotenv.config();
const { MONGO_CONNECTION , PORT } = process.env;

mongoose.connect(MONGO_CONNECTION)
        .then((result)=>{
            console.log('Mongodb connected successfully ');
        })
        .catch((error)=>{
            console.log('Error connecting Mongo DB');
        })

app.use(cors());        
app.use(express.json());

const upload = multer({storage : multer.memoryStorage() })

app.post('/post/create', async (req,res)=>{
    try{
        const document = req.body;
        const post = await Post.create(document);
        res.status(201).json({messsage: 'Post created successfully', data: post})
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.get('/post/get/:id',async (req,res)=>{
    try{
        const { id }  = req.params;
        const result = await Post.findById(id).exec();
        res.status(200).json({message: 'Post Found', result});
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.get('/post/getAll',async (req,res)=>{
    try{
        const result = await Post.find({}).exec();
        res.status(200).json({message: 'Post Found', result});
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.get('/post/getByLikesCount/:count',async (req,res)=>{
    try{
        const { count }  = req.params;
        const result = await Post.find({likesCount : { $gte: count }}).exec();
        res.status(200).json({message: 'Post Found', result});
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.get('/post/getByLocation/:location',async (req,res)=>{
    try{
        const { location }  = req.params;
        const result = await Post.find({location : location},'_id title description location').exec();
        res.status(200).json({message: 'Post Found', result});
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.put('/post/update', async (req,res)=>{
    try{
        const { id , dataToUpdate  } = req.body;
        const result = await Post.findByIdAndUpdate( id , dataToUpdate , {new : true});
        res.status(200).json({message: 'Post Updated', result});
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.delete('/post/delete/:id',async (req,res)=>{
    try{
        const { id }  = req.params;
        const result = await Post.findByIdAndDelete(id).exec();
        res.status(200).json({message: 'Post Deleted', result});
    }catch(e){
        res.status(500).json({message: e.message});
    }
})

app.listen(PORT,()=>{
    console.log('Server listening on port -',PORT);
})
