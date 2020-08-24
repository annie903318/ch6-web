document.getElementById("navbar-brand").innerHTML="Test";

if($.cookie("userID")=="" ||$.cookie("userID")==null){
    $("#login").show();
    $("#changePass").hide()
    $("#vote").hide();
    $("#username").hide();
    $("#logout").hide();
    $("#album").hide();
    $("#blog").hide();
}else{
    $("#login").hide();
    $("#changePass").show();
    $("#vote").show();
    $("#username").show();
    $("#username").text("UserName : "+$.cookie("userName"));
    $("#logout").show();
    $("#album").show();
    $("#blog").show();
}
function logout(){
    $.removeCookie("userID");
    $.removeCookie("userName");
    history.go(0); //刷新當前頁面
    alert("登出成功");
}

