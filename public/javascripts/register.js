function register(){
    var name=$("#name").val();
    var account=$("#account").val();
    var password=$("#password").val();
    var confirmpsd=$("#confirmpsd").val();

    if(name!="" && account!="" && password!="" && confirmpsd!=""){
         if(password!=confirmpsd){
            alert("確認密碼不相同!");
        }else{
            $.post("/member/register",{
                "name":name,
                "account":account,
                "password":password,
                "photos":[]
            },function(res){
                if(res.status==0){
                    alert("註冊成功!");
                    location.href="../public/login.html";
                }else if(res.status==1){
                    alert(res.msg);
                }
            });
        }
    }  
}