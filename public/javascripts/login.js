function login(){
    var account=document.getElementById("account").value;
    var password=document.getElementById("password").value;
    
    $.post("/member/login",{
        "account":account,
        "password":password
    },function(res){
        if(account!="" && password!=""){
            if(res.status==1){
                alert(res.msg);
            }else{
                $.cookie("userName",res.data.name);
                $.cookie("userID",res.data.account);
                alert("登入成功!");
                location.href="/public/index.html";
            }
        }
    });
}