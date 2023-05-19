// .env file
// MONGO_USERNAME=enter your mongo username
// MONGO_PASSWORD=enter your mongo password
// MONGO_DB_NAME=enter db name
// PORT=5003
// secretkey=enter secret key

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Api from './routes/api.js';
import Users from './routes/User.js';
import { fileURLToPath } from "url";
// ... other imports 
import ArticleDB from './models/article.js';
import path from 'path';
dotenv.config();
const app = express();
// ... other app.use middleware 

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

let minCount=0;
let currCount = minCount; // 0-248 and repeat
let numOfSources=4
let numOfArticlesPerSources=3
let num_of_sentences_in_summary=2

let maxCount=248 - numOfSources;

function fetchArticles() {
    if(process.env.REPEAT=="TRUE"){ //This is added to control sever on-off status 
    
        console.log('start')
        try{
            axios.post(
                process.env.FLASK_URL+"/db", 
                { 
                    currCount:currCount%maxCount,
                    numOfSources,
                    numOfArticlesPerSources,
                    num_of_sentences_in_summary
                },
                config
            )
            
            .then(async function (response) {
                console.log('Received response')
                currCount++
                const sites=response.data.allsite
                const sites_key=response.data.allsite_key

                for(var z=0;z<sites.length;z++){

                
                    var limit=response.data.alldata[sites[z]]['length']
                    console.log("z:"+sites[z]+"  limit:"+limit)

                    

                    for(var i=limit-1;i>=0;i--){

                        const documentCount = await ArticleDB.countDocuments({});
                        console.log('documentCount:'+documentCount)   
                        
                        let articleI=new ArticleDB({
                            
                            main_url:sites[z],
                            main_url_key:sites_key[z],
                            url:response.data.alldata[sites[z]][i].url,
                            
                            title:response.data.alldata[sites[z]][i].title,
                            text:response.data.alldata[sites[z]][i].text,
                            top_image:response.data.alldata[sites[z]][i].top_image,
                            index:i.toString(),
                            unique_id:documentCount.toString(),

                        })
                        
                        
                        console.log("article.title:"+articleI.title)
                        
                        let resp=await articleI.save()
                        let nar = articleI;
                        art.push(nar)

                        
                    }
                    console.log()
                    console.log('Will be Called after every 3 minutes!')
                }
            
            })
        }
        catch(err){
            console.log('error on server:'+err)
        }
    }
    else{
        console.log('Server is off')
    }

}
app.post("/fetchArticles",async (req,res)=>{
await fetchArticles();
res.json(art);
})





//process.env.MONGO_DB_NAME
mongoose.connect('mongodb+srv://'+process.env.MONGO_USERNAME+':'+process.env.MONGO_PASSWORD+'@cluster0.vtpm8td.mongodb.net/?'+process.env.MONGO_DB_NAME+'?retryWrites=true&w=majority',{
    useNewUrlParser: true
})


//Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "public", "index.html"));
});

app.listen(port, function() {
    console.log('Server is running on port: ' + process.env.PORT)
})
