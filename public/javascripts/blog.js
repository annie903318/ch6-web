if (!$.cookie("userID") || $.cookie("userID") == null) {
    alert("請先登入會員");
    location.href = "../public/login.html";
}
function newArticle(data) {
    var content = document.createElement("tr");
    content.className = "row100 body";

    var date = new Date(data.postdate);
    var crt_date = (date.getMonth() + 1) + "/" + date.getDate() + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

    var addHtml = ` <td class="cell100 column1">
                        <a href="/public/article.html?_id=${data._id}">${data.title}</a>
                    </td>
                    <td class="cell100 column2">
                        <a href="/public/blog.html?type=${data.type}">${data.type}</a>
                    </td>
                    <td class="cell100 column2">
                       ${data.like.length}
                    </td>
                    <td class="cell100 column2">
                        ${data.comment.length}
                    </td>
                    <td class="cell100 column2">
                        ${data.account}
                    </td>
                    <td class="cell100 column2">
                        ${crt_date}
                    </td>`;
    content.insertAdjacentHTML("beforeend", addHtml);
    $('#article').append(content);
}
//取得網址列的搜尋字串
function getUrlVal(val) {   
    var query = window.location.search.substring(1); //去掉"?"
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == val) {
            return pair[1];
        }
    }
    return (false);
}
//以關鍵字搜尋文章
function search() {
    location.href = '/public/blog.html?title=' + $('#title').val();
}
//以分類搜尋文章
function changeType(){
    if($("#type").val()!="" || $("#type").val()!=null){
        location.href = '/public/blog.html?type=' + $('#type').val();
    }else{
        location.href = '/public/blog.html';
    }
}
//取得文章
function getArticle() {
    var search = "";
    if (getUrlVal("type")) {
        if(getUrlVal("type")=="%E5%85%A8%E9%83%A8"){
            search.replace("?type=%E5%85%A8%E9%83%A8","");
        }else{
            search += "type=" + getUrlVal("type") + "&";
        }
    }
    if (getUrlVal("account")) {
        search += "account=" + getUrlVal("account") + "&";
    }
    if (getUrlVal("title")) {
        search += "title=" + getUrlVal("title") + "&";
    }
    $.get("/blog/getArticle?" + search, function (res, status) {    
        for (var i = 0; i < res.data.length; i++) {
            newArticle(res.data[i]);
        }
    });
}
window.onload=function(){
    getArticle();
    if (getUrlVal("type")) {
        //URL轉中文
        $('#type').val(decodeURI(getUrlVal("type")));
    }
}
