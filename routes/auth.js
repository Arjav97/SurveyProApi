var express=require("express");
var router=express.Router();
var user=require('../models/user');


router.post('/register',(req,res)=>{
    
       user.findOne({"_id":req.body.username},(err,doc)=>{
        if(err)console.log(err);
        if(doc)
        {
            return res.send({
                success:'false',
                message:'Username already exits'
            });
        }
        else
        {
            new user({
                _id:req.body.username,
                name:req.body.name,
                password:req.body.password,
                account: req.body.account
                }).save((err,doc)=>{
                    if(err) console.log(err);
                    else
                    {
                        res.status(200).send({
                            success:'true',
                            message:'Registration Successful !!!',
                        });
                    }
                });
        }
    });
})

router.get('/login', (req,res) => {
  
    user.findOne(
        {
            $and : [
                {"_id" : req.query.username},
                {"password": req.query.password}
            ]
        }, (err , doc)=>{
            if(err) console.log(err)
            if(doc){
               res.send({
                   success: 'true',
                   message: 'Login Succesfull!!!',
                   doc:doc
               })                 
            }
            else {
                res.send({
                    success:'false',
                    message : 'Login Unsuccessfull!!'
                })
            }
        })
})

module.exports = router;