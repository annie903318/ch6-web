var express=require("express");
var router=express.Router();
var memberModel=require("../models/memberModel.js");
//註冊
router.post("/register",function(req,res){
    var newMember = new memberModel({
        name:req.body.name,
        account:req.body.account,
        password:req.body.password,
        photos:[]
    });
    //從資料庫找出相符資料的數量,data存資料的數量
    memberModel.count({
        account:req.body.account,
    },function(err,data){
        if(data>0){
            res.json({"status":1,"msg":"帳號已被註冊!"});
        }else{
            newMember.save(function(err,data){
                if(err){
                    res.json({"status":2,"msg":"save error"});
                }else{
                    res.json({"status":0,"msg":"save success","data":data});
                }
            });
        }
    });
});

//登入
router.post("/login",function(req,res){
    memberModel.findOne({
        account:req.body.account,
        password:req.body.password
    },function(err,data){
        if(data==null){
            res.json({"status":1,"msg":"帳號密碼錯誤!"});
        }else{
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success","data":data});
            }
        }
    });
});

//修改密碼
router.post("/changePass",function(req,res){
    memberModel.findOne({
        account:req.body.account,
        password:req.body.oldPass
    },function(err,data){
        if(data==null){
            res.json({"status":1,"msg":"舊密碼輸入錯誤!"});
        }else{
            data.password=req.body.newPass;
            data.save(function(err){
                if(err){
                    res.json({"status":1,"msg":"error"});
                }else{
                    res.json({"status":0,"msg":"success"});
                }
            })
        }
    });
});

module.exports=router;