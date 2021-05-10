var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var multer = require("multer");
const fs = require('fs')
import { v4 as uuidv4 } from 'uuid';
var product = require('../models/product');
var users = require('../models/user');

const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null,'./uploads/')
    },
    filename: function(req , file , cb){
        cb(null , uuidv4() + file.originalname)
    }
})

const upload = multer({storage: storage})

router.post('/addProduct', upload.single('image') ,(req,res,next) => {
    console.log(req.file);
   
        new product({
        _id: uuidv4(),
        name: req.body.name,
        desc: req.body.desc,
        image: {
            data: fs.readFileSync(req.file.path),
            contentType:'image/jpg'
        }, 
        category:req.body.category,
        cc: req.body.cc,
        link: req.body.link
    }).save((err,doc)=> {
        if(err)
            console.log(err)
        else{
            res.send({
                success:'true',
                message: 'Product added successfully',
                image:doc.image
            })
        }
    })
})

router.post('/editProduct',(req,res)=> {
    var objForUpdate = {}
    if(req.body.name) {objForUpdate.name = req.body.name;}
    if(req.body.desc) {objForUpdate.desc = req.body.desc;} 
    if(req.body.cc) {objForUpdate.cc = req.body.cc;}
    if(req.body.link) {objForUpdate.link = req.body.link;}

    product.findOneAndUpdate({"_id":req.body.id},{$set : objForUpdate}, (err,doc)=> {
        if(doc){
            res.send({
                success:'true',
                message:'Product Updated successfully'
            })
        }
        if(err){
            console.log(err)
        }
    })
})

router.get('/deleteProduct',(req,res)=> {
    product.findOneAndDelete({"_id":req.query.id}, (err,doc)=> {
        if(doc){
            res.send({
                success:'true'
            })
        }
        else if(err){
            console.log(err)
        }
    })
})


router.post('/saveProduct' , (req,res)=>{
    users.findOneAndUpdate({"_id":req.body.name} , {$addToSet: {"pid": [req.body.productid]}} ,(err,doc)=> {
            res.send({
                success:'true',
                message:'Product updated successfully',
                doc:doc
            })
        
        if(err){
            console.log(err)
        }
    })
})

router.post('/unSaveProduct', (req,res)=>{
    users.findOneAndUpdate({"_id":req.body.name} , {$pullAll: {"pid": [req.body.id]}} ,(err,doc)=> {
        res.send({
            success:'true',
            message:'Product updated successfully',
            doc:doc
        })
    
    if(err){
        console.log(err)
    }
})
})


router.get('/searchProduct',(req,res)=> {
    if(req.query.name !== ""){
        product.find({"name":req.query.name}, (err,doc)=> {
            if(doc.length>0){
                res.send({
                    success:'true',
                    message:'Product successfully found by name',
                    doc:doc
                })
            }
            else{
                res.send({
                    success:'false',
                    message:'No product found by this name',
                    doc:doc
                })
            }
        })
    }
    else if(req.query.category !== ""){
        product.find({"category":req.query.category}, (err,doc)=> {
            console.log(doc)
            if(doc.length>0){
                res.send({
                    success:'true',
                    message:'Product successfully found by category',
                    doc:doc
                })
            }
            else{
                res.send({
                    success:'false',
                    message:'No product found by entered category',
                    doc:doc
                })
            }
        })
    }
})

router.get('/getProduct',(req,res)=>{
    product.find({"_id":req.query._id},(err,doc)=>{
        if(err)
            console.log(err);
        else{
            res.send({
                success:"true",
                doc:doc
            })
        }
    })
})

router.get('/getsavedProduct',(req,res)=> {
    var products = require('../models/product');
    users.aggregate([
        {   $match: {"_id": req.query.name} },
        {
            $lookup:{
                from:"products",
                localField:"pid",
                foreignField:"_id",
                as:"result"
            }
        }
    ],(err,doc)=> {
        res.send({
            doc:doc
        })
    })
})

router.post('/saveReview', (req,res)=> {
    console.log(req.body)
    let review = {
        _id : req.body.username,
        c1: req.body.c1,
        c2: req.body.c2,
        desc: req.body.desc,
        rating: req.body.rating
    }
    product.findOneAndUpdate({"_id":req.body.id} , {$push: {"review": [review]}} ,(err,doc)=> {
        if(doc){
            res.send({
                success:'true',
                message:'Review submitted successfully'
            })
        }        
        if(err){
            console.log(err)
        }
    })
})

router.get('/getReward',(req,res)=>{

    product.find({},(err,doc)=>{
        if(doc.length>0){
            console.log(doc)
            res.send({
                doc:doc
            })
        }
        else if(err){
            console.log(err)
        }
    }).limit(2)
})

module.exports = router;