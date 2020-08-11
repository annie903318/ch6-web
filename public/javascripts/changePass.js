if($.cookie("userID")=="" || $.cookie("userID")==null){
    alert("請先登入會員!");
    location.href="../public/login.html";
}
function changePass(){
    var oldPass=$("#oldPass").val();
    var newPass=$("#newPass").val();
    if(oldPass!="" && newPass!=""){
        $.post("/member/changePass",{
            "account":$.cookie("userID"),
            "oldPass":oldPass,
            "newPass":newPass
        },function(res){
            if(res.status==1){
                alert(res.msg);
            }else{
                alert("修改成功!");
                location.href="../public/index.html";
            }
        });
        }
}