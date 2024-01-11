const express= require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const dotenv= require("dotenv")
const app=express();
app.set('view engine','ejs');
dotenv.config();
let keyw="";
let freq;
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",(req,res)=>{
    
    res.render(__dirname+'/index',{key:keyw,freq:freq})
});
const Schema=mongoose.Schema;
const keyschema=new Schema({keyword: String , frequency: Number});
const key=mongoose.model("key",keyschema);

app.post("/",(req,res)=>{
    keyw=req.body.item;
    
   key.findOne({keyword: keyw}).then(function(data){

    if(data){
        const id=data._id;
        const f=data.frequency
     
         key.findByIdAndUpdate(id,{frequency:f+1}).then((key)=>{
         
               freq= f+1;
               res.redirect("/");
        })
    
    }
    else{
        key.create({keyword: keyw, frequency: 1}).then((user)=>{console.log(key); freq=1; res.redirect("/");} );
        
    }
   })
   
   
});


 mongoose.connect(process.env.CONNECTION_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
     .then(()=> app.listen(process.env.PORT, () => console.log(`server is running on ${process.env.PORT} and key=${keyw}`)))
     .catch((error) => console.log(error.message));

