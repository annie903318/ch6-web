var express=require("express");
var router=express.Router();
var multer=require("multer");
var memberModel=require("../models/memberModel.js");
var fs = require("fs");


//設定儲存檔案格式
var storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,"./public/photos");
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + '.' + fileFormat[1])
    }
});


var upload=multer({storage:storage});

//上傳圖片
router.post("/upload",upload.single("photo"),function(req,res,next){
    memberModel.findOne({
        account:req.query.account
    },function(err,data){
        data.photos.push(req.file.filename);
        data.save(function(err){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success","photos":data.photos});
            }
        });
    });
});

// var storage=multer.memoryStorage();
// var upload=multer({storage:storage});

//上傳圖片
//single():將前端 <input> 元素中，name 屬性值為"photo" 的元素值傳入此方法中
// router.post("/upload", upload.array("photo"), function(req,res,next){
//     memberModel.findOne({
//         account:req.query.account
//     },function(err,data){
//         var img=req.files;
//         var str=img[0].originalname.split(".");
//         img[0].originalname=Date.now()+"."+str[1];
//         data.phoreqtos.push(img[0]);
//         data.save(function(err){
//             if(err){
//                 res.json({"status":1,"msg":"error"});
//             }else{
//                 res.json({"status":0,"msg":"success","photos":data.photos});
//             }
//         });
//     });
// });

//瀏覽圖片
router.post("/getAlbum",function(req,res,next){
    memberModel.findOne({
        account:req.body.account
    },function(err,data){
            if(err){
                res.json({"status":1,"msg":"error"});
            }else{
                res.json({"status":0,"msg":"success","data":data});
            }
        });
});

//刪除圖片
router.post("/delete",function(req,res,next){
    memberModel.findOne({
        account:req.body.account
    },function(err,data){
        if(err){
            res.json({"status":1,"msg":"error"});
        }else{
            var path="."+req.body.path;
            fs.unlink(path,(err) => {
                if (err) {
                    res.json({"status":1,"msg":"error"});
                }
            });
            data.photos.forEach((element,index) => {
                if(element==req.body.photo){
                    data.photos.splice(index,1);
                }
            });
            data.save(function(err,data){
                if(err){
                    res.json({"status":1,"msg":"error"});
                }else{
                    res.json({"status":0,"msg":"success","data":data});
                }
            });
        }
    });
});


module.exports=router;