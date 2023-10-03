

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Api from './routes/api.js';
import Users from './routes/User.js';
import { fileURLToPath } from "url";
import {JSDOM} from 'jsdom';
import { Readability } from '@mozilla/readability';





 

import path from 'path';


dotenv.config();
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/../client/", "public")))


var port = process.env.PORT



app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))


app.use('/api', Api);


app.use('/users', Users);

var config = { headers: {  
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'}
}


const art =[]

app.post("/getSummary",async (req,res)=>{
    try{
        let  contentFromHTML="";
        let url = req.body.url;
        console.log(url);

        
        let r1 = await axios.get(url);
        console.log(r1.data);
        let firstResult = r1.data.articles[0];
        console.log("url of content",firstResult.url);
        
          
        let r2 =await axios.get(firstResult.url)
        
          
        let dom = new JSDOM(r2.data, {
              url: firstResult.url
            })
        
           
        let article = new Readability(dom.window.document).parse();
        
           
        contentFromHTML=article.textContent
        console.log("done");

        

    
   const  sendReq ={content:contentFromHTML,finalSize:1}
  
    let resData ={}
    console.log("sending data to summarizer...",sendReq);
    const resFromFlask = await  axios.post(process.env.FLASK_URL+"/getSummary",sendReq)
   console.log("flask",resFromFlask);
    resData={...resData,summary:resFromFlask.data.summary,message:"summary generated"};
 

    res.json(resData);
    

    }
    catch(e){
        throw Error(e)
    }

})





mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clusterh.ilp8ion.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
  )
  .then((e) => {
    console.log(`connected to ${e.connection.host}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "public", "index.html"));
});

app.listen(port, function() {
    console.log('Server is running on port: ' + process.env.PORT)
})
