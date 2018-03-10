var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/', function (req, res, next) {
console.log(req.body);
  var user = new User({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      password:bcrypt.hashSync(req.body.password,10),
      email:req.body.email
  })
user.save((err,result)=>{
    if (err) {
        return res.status(500).json({
          title: "An error occured",
          error: err
        });
      }
      res.status(201).json({
        message: "User Created",
        obj: result
      });
})
});

router.post('/signin',(req,res,next)=>{
    console.log(req.body);
  User.findOne({email:req.body.email},(err,user)=>{

    if(err){
        return res.status(500).json({
            title:"An error occured",
            error:err
        })
    }
    if(!user){
        return res.status(500).json({
            title:"Login failed",
            error:{message:'invalid login credentials'}
        })
    }

    if(!bcrypt.compareSync(req.body.password,user.password)){
        return res.status(401).json({
            title:"Login failed",
            error:{message:'invalid login credentials'}
        })
    }

    var token = jwt.sign({user:user},"secret",{expiresIn:7200});
    res.status(200).json({
        message:"Success login",
        token:token,
        userId:user._id
    })
    

   
  });

});
module.exports = router;
