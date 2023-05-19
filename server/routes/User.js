import express from 'express';

import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserDB from '../models/User.js';

const users = express.Router();
users.use(cors());

users.get("/list",async(req,res)=>{
  const ar = await UserDB.find();
  res.json({ar});
})

users.post('/register',async (req, res) => {
    const today = new Date()
    const userData = {
      first_name: req.body.fn,
      last_name: req.body.ln,
      email: req.body.email,
      password: req.body.pwd,
      created: today
    }
console.log(userData);
    await UserDB.find({
        email: req.body.email
      })
      .then(async user => {
        console.log(user,"user");
        if (user.length==0) {
          try{
              const hashedPassword = await bcrypt.hash(req.body.pwd, 10);
              userData.password=hashedPassword;
              const userobj = new UserDB(userData)
              await userobj.save()
              res.json({ status:"success",Data: userData.email + ' registered!',message:userData.email + ' registered!' })
                
          }catch(err){
                  res.json({ status:"fail",Data: err,message:err })
                  }
            
          }
          else {
            res.json({ status:"fail",Data: 'User already exists',message:'User already exists' })
          }
        })
        .catch(err => {
          return res.json({ status:"fail",Data: err,message:err })
        })
    })



    users.post('/login', async (req, res) => {
      
      console.log("request sign in");
      const userchk= await UserDB.find({ email: req.body.email });
      console.log(userchk);
      
      if (userchk.length == 0) {
       
        res.status(400).send("Cannot find user");
      } 
      else {
        try {
          if (await bcrypt.compare(req.body.password,userchk[0].password )) {
            const payload = {
              _id: userchk[0]._id,
              first_name: userchk[0].first_name,
              last_name: userchk[0].last_name,
              email: userchk[0].email
            }
            let token = jwt.sign(payload, process.env.secretkey, {
              expiresIn: '212h'
            })
            console.log("login success");
            return res.json({token:token,message:'Login Successful',status:'success'})
          }
            else {
                // Passwords don't match
                return res.json({ status:"fail",error: 'Password doesnt match',message:'Password doesnt match' })
              }
            }
            
        
          catch(err){
            
            res.json({ status:"fail",error: err,message:err })
          }
        }
      })

    


export default users;