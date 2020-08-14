var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/ch6",{useNewUrlParser:true});

var articleSchema=new mongoose.Schema({
    account:String,
    name:String,
    type:String,
    title:String,
    content:String,
    like:Array,
    comment:Array,
    postdate:Date
});
articleSchema.set("collection","article");
var model=mongoose.model("article",articleSchema);

module.exports=model;