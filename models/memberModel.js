var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/ch6",{useNewUrlParser:true});

var memberSchema=new mongoose.Schema({
    name:String,
    account:String,
    password:String,
    photos:[]
});
memberSchema.set("collection","member");
var model=mongoose.model("member",memberSchema);

module.exports=model;