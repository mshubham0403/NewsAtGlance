import express from 'express';

import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserDB from '../models/User.js';

const users = express.Router();
users.use(cors());



users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today
    }

    UserDB.findOne({
        email: req.body.email
      })
      .then(user => {
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              userData.password = hash
              UserDB.create(userData)
                .then(user => {
                  res.json({ status:"success",Data: user.email + ' registered!',message:user.email + ' registered!' })
                })
                .catch(err => {
                  res.json({ status:"fail",Data: err,message:err })
                  // res.send('error: ' + err)
                })
            })
          }else {
            res.json({ status:"fail",Data: 'User already exists',message:'User already exists' })
          }
        })
        .catch(err => {
          return res.json({ status:"fail",Data: err,message:err })
        })
    })



    users.post('/login', (req, res) => {
      
        UserDB.findOne({
          email: req.body.email
        })
          .then(user => {
            if (user) {
              if (bcrypt.compareSync(req.body.password, user.password)) {
                // Passwords match
                const payload = {
                  _id: user._id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email
                }
                let token = jwt.sign(payload, process.env.secretkey || "secretkey", {
                  expiresIn: '1h'
                })
                return res.json({token:token,message:'Login Successful',status:'success'})
              }
              else {
                // Passwords don't match
                return res.json({ status:"fail",error: 'Password doesnt match',message:'Password doesnt match' })
              }
            }
            else {
              return res.json({ status:"fail",error: 'User does not exist',message:'User does not exist' })
            }
          })
          .catch(err => {
            
            res.json({ status:"fail",error: err,message:err })
          })
      })

    


export default users;