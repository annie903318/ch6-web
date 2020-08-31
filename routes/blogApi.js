var express = require('express');
var router = express.Router();
var memberModel = require('../models/memberModel.js');
var articleModel = require("../models/articleModel.js");

//新增文章
router.post("/addArticle", function (req, res) {
    var newArticle = new articleModel({
        account: req.body.account,
        name: req.body.naem,
        type: req.body.type,
        title: req.body.title,
        content: req.body.content,
        like: [],
        comment: [],
        postdate: new Date()
    });
    newArticle.save(function (err, data) {
        if (err) {
            res.json({ "status": 1, "msg": "error" });
        } else {
            res.json({ "status": 0, "msg": "success", "data": data });
        }
    });
});
//瀏覽文章
router.get("/getArticle", function (req, res) {
    var type = (req.query.type != undefined) ? req.query.type : "";
    var account = (req.query.account != undefined) ? req.query.account : "";
    var title = (req.query.title != undefined) ? req.query.title : "";

    articleModel.find({
        //若等於空值就使用正規表示式中的「.*」，表示不進行會員帳號的篩選
        "account": account != "" ? account :{ $regex: '.*' + account + '.*' },
        "type": { $regex: '.*' + type + '.*' },
        "title": { $regex: '.*' + title + '.*' }
    }, function (err, data) {
        if (err) {
            console.log(err);
        }else{
            res.json({ "type": type, "data": data });
        } 
    });
});
//取得文章內容
router.get("/getArticleById",function(req,res){
    articleModel.find({
        _id:req.query._id 
    },function(err,data){
        if(data==undefined){
            res.json({"status":1,"msg":"查無此文章"});
        }else{
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                memberModel.find({
                    account:data[0].account
                },function(err,mem){
                    res.json({
                        "status":0,"msg":"success","data":{
                            account:data[0].account,
                            type: data[0].type,
                            title: data[0].title,
                            content: data[0].content,
                            like: data[0].like,
                            comment: data[0].comment,
                            postdate: data[0].postdate,
                            name: mem[0].name
                        }
                    });
                });
            }
        }
    });
});
//修改文章
router.post('/editArticle', function (req, res) {
    articleModel.findById(
        req.body._id
    ,function(err,data){
        data.content=req.body.content;
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success"});
            }
        });
    });
});
//刪除文章
router.post("/deleteArticle",function(req,res){
    articleModel.findByIdAndRemove(
        req.body._id
    ,function(err,data){
        if(err){
            res.json({"status":1,"msg":"error"});
        }else{
            res.json({"status":0,"msg":"success"});
        }
    });
});
//喜歡文章
router.post("/pushlike",function(req,res){
    articleModel.findById(req.body._id,function(err,data){
        if(data.like.indexOf(req.body.account)<0){
            //按讚
            data.like.push(req.body.account); 
        }else{
            //收回
            data.like.splice(data.like.indexOf(req.body.account),1);
        }
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success","like":data.like.length});
            }
        });
    });
});
//回應文章
var delTotal=0;
router.post("/addComment",function(req,res){
    articleModel.findById(req.body._id,function(err,data){
        var newID=0;
        if(data.comment.length>0){
            newID=Math.max(...data.comment.map(p=>p.id));
        }
        var newcomment={
            id:delTotal+newID+1,
            account:req.body.account,
            message:req.body.message,
            like:[],
            date:new Date()
        };
        data.comment.push(newcomment);
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success","comment":data.comment});
            }
        });
        delTotal=0;
    });
});
//修改回應
router.post("/editComment",function(req,res){
    articleModel.findById(
        req.body._id
    ,function(err,data){
        data.comment.forEach(element => {
            if(element.id==req.body.id){
                var commentIndex=data.comment.indexOf(element);
                data.comment[commentIndex].message=req.body.message;
            }
        });
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
                console.log("error");
            }else{
                res.json({"status":0,"msg":"success","comment":data.comment});
                console.log("success");
            }
        });
    });
});
//刪除回應
router.post("/deleteComment",function(req,res){
    articleModel.findById(
        req.body._id
    ,function(err,data){
        data.comment.forEach(element => {
            if(element.id==req.body.id){
                if(element.id==Math.max(...data.comment.map(p=>p.id))){
                    delTotal+=1;
                }else{
                    delTotal=0;
                }
                var commentIndex=data.comment.indexOf(element);
                data.comment.splice(commentIndex,1);
            }
        });
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success"});
            }
        });
    });
});
//按讚回應
router.post("/commentPushlike",function(req,res){
    articleModel.findById(
        req.body._id
    ,function(err,data){
        data.comment.forEach(element=>{
            var like=element.like;
            if(element.id==req.body.id){
                if(like.indexOf(req.body.account)<0){
                    //按讚
                    like.push(req.body.account); 
                }else{
                    //收回
                    like.splice(like.indexOf(req.body.account),1);
                }
            }
        });
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success","comment":data.comment});
            }
        });
    });
});



module.exports = router;