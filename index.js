const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride = require('method-override');

const port=8080;
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"publics")));
app.use(express.urlencoded({ extended :true}));
app.use(methodOverride('_method'));


main()
.then(()=> console.log("Database connected"))
.catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/login');
}
const users=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        maxLength:50
    },
    password:{
        type:String,
        required:true
    }
})

const User =mongoose.model("User",users);

// let user1=new User({
//     firstname:"ram",
//     lastname:"charan",
//     email:"pavan50872@gmail.com",
//     password:"12345",
// })
// user1.save()
// .then((res=>{
//     console.log(res);
// }))
// .catch((err)=>{
//     console.log(err);
// })

app.get("/",(req,res)=>{
    res.render("index.ejs");
})
app.get("/signup",(req,res)=>{
    res.render("SignUp.ejs");
})
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.post("/signup",(req,res)=>{
    console.log(req.body);
    let {firstname,lastname,email,password,cpassword}=req.body;
    console.log(firstname,lastname,email,password,cpassword);
    let user1=new User({
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password,
    })
    user1.save()
    .then((res=>{
        console.log(res);
    }))
    .catch((err)=>{
        console.log(err);
    })
    res.send("form Summited");
})

app.post("/login",async(req,res)=>{
    console.log(req.body);
    let user= await User.find({email:req.body.email})
    .then((resu)=>{
        console.log(res);
        if((resu[0].email==req.body.email)&& (resu[0].password==req.body.password)){
            res.send(`Hello ${resu[0].firstname} ,This is your secret key *******`);
        }else{
            res.send("you entered wrong Credintials,Please check it again and login");
        }
    })
    .catch((err)=>{
        console.log(err);
    })
    
})

app.listen(port,()=>{
    console.log("connection established");
})