const express=require("express");
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolist')
.then(()=>console.log("database connected"))
.catch((err)=>console.log("error in db"));

const schema=new mongoose.Schema({
    "title":String,
    "description":String
});
const models=mongoose.model("todomodel",schema);
app.use(express.json());
app.use(cors());

app.post('/givevalues',async(req,res)=>{
    try{
    const {title,description} =req.body;
   const newmodel=new models({title,description});
   await newmodel.save();
   
    console.log(newmodel);
    res.status(201).send(newmodel);
    }
    catch(err){
        res.status(404).send("error");
        console.log(err);
    }
})
app.get("/wantvalue",async(req,res)=>{
    try{
        const getmodels=await models.find();
        console.log(getmodels);
        res.status(201).json(getmodels);
    }
    catch(err){
        res.status(404).send("error");
        console.log(err+"in get method");
    }
})
app.put("/update/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const {edittitle,editdescription} =req.body;
        const putmodel=await models.findByIdAndUpdate(id,{title:edittitle,description:editdescription});
        //console.log(putmodel);
        if(!putmodel)
            res.status(500).send("cant find");
        console.log(putmodel);
        res.status(201).send("sucessfullyupdated");       
    }
    catch(err){
        res.status(404).send("error");
        console.log(err+"in put method");
    }
})
app.delete("/delete/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        await models.findByIdAndDelete(id);
        console.log("success delete");
        res.status(200).send("successfully deleted");
    }
    catch(err){
        res.status(400).send("cant delete");
    };
})
app.listen(3001,()=>{
    console.log("Server started successfully");
});