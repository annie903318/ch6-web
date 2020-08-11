var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/ch6",{useNewUrlParser:true});

var voteSchema=new mongoose.Schema({
    account:String,
    name:String,
    title:String,
    option:Array,
    postdate:Date
});
voteSchema.set("collection","vote");
var model=mongoose.model("vote",voteSchema);

module.exports=model;