if ($.cookie("userID") == "" || $.cookie("userID") == null) {
    alert("請先登入會員");
    location.href = "../public/login.html";
}
//新增文章
function addArticle() {
    var postdata = {
        type: $("#type").val(),
        title: $("#title").val(),
        //取代空格&換行
        content: $("#content").val().replace(/ /g,"&nbsp").replace(/\n/g,"<br />"),
        account:$.cookie("userID"),
        name:$.cookie("userName")
    };

    $.post("/blog/addArticle",postdata
    ,function(res){
        if(res.status==0){
            alert("發文成功");
            location.href="../public/blog.html";
        }
    });
}