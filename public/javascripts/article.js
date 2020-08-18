//取得網址列上的搜尋條件
function getUrlVal(val) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        return pair[1];
    }
}
//供getArticleDetail()呼叫
function initArticleDetail(data) {
    var head = `
        <h3>
            ${data.name}(${data.account})
        </h3>`;
    if($.cookie("userID")==data.account){
        head+=`<h5>
                  <a class="person badge badge-warning badge-pill" href="javascript:showArticlerow()">修改</a>
                  <a class="person badge badge-light badge-pill" href="javascript:deleteArticle()">刪除</a>
               </h5>`;
    }

    $("#a_head").append(head);
    var a_date = new Date(data.postdate);
    var date = `${a_date.getMonth() + 1}月${a_date.getDate()}日  ${a_date.getHours()<10?"0"+a_date.getHours():a_date.getHours()}:${a_date.getMinutes()<10?"0"+a_date.getMinutes():a_date.getMinutes()}`;
    var content = `<h1 class="a_title mt-3 mb-3">${data.title}</h1>
                <h4><span class="badge badge-info">${data.type}</span>&nbsp&nbsp${date}</h4>
                <h5 id="content">${data.content}</h5>
                <button type="button" class="mt-2 mb-2 badge badge-primary" onclick="pushlike()">
                    讚 <span class="badge badge-light">${data.like.length}</span>
                </button>
                
                <div id="editRow" style="display:none">
                    <textarea id="editContent" rows="5" column="50" class="form-control"></textarea>
                    <button type="button" class="btn btn-warning mt-3 mb-3" onclick="editArticle()">送出</button>            
                </div>
                `;
    $("#a_content").append(content);

    //回應文章
    var comment="<h4>回應</h4>";
    var i=1;
    data.comment.forEach(element => {
        var date=new Date(element.date);
        var commentDate=`${date.getMonth() + 1}/${date.getDate()}  ${date.getHours()<10?"0"+date.getHours():date.getHours()}:${date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()}`;
        comment+=`
            <div id="${element.id}" class="container">
                <div class="row mb-3">
                    <span style="color:pink" class="pr-3">#${element.id}</span>
                    <img src="/public/photos/avatar2.jpg" style="height:50px;width:50px;"/>
                    <div>
                        <span class="pl-3">${element.account}</span><br/>
                        <span class="pl-3">${commentDate}</span><br/>
                        <span id="message${element.id}" class="pl-3">${element.message}</span><br/>
                    </div>
                    <h5>
                        <a id="edit${element.id}" class="badge badge-warning badge-pill" href="javascript:editComment(${element.id})">編輯</a>
                        <a class="badge badge-light badge-pill" href="javascript:deleteComment(${element.id})">刪除</a>
                    </h5>
                    <button type="button" class="ml-3 mt-3 mb-3 badge badge-light" style="float:right" onclick="commentPushlike(${element.id})">
                    👍 <span class="badge badge-light">${element.like.length}</span>
                    </button>
                </div>
            </div>
        `;
    });
    comment+=`<div class="form-group row mt-2 mb-2">
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="commentBar" placeholder="留言..." autocomplete="off">
                </div>
                <button type="button" class="btn btn-primary" onclick="addComment()">
                    送出
                </button>
            </div>`;

    $("#a_comment").append(comment);
}
//呼叫後端API取得文章內容
function getArticleDetail() {
    if (!getUrlVal("_id") || !getUrlVal("title")) {
        alert("查無此頁!");
        location.href = "../public/blog.html";
        return;
    }
    $.get("/blog/getArticleById?_id=" + getUrlVal("_id"), function (res, status) {
        if (res.status != "0") {
            alert(res.msg);
            location.href = "../public/blog.html";
        } else {
            initArticleDetail(res.data);
        }
    });
}
getArticleDetail();
//顯示修改文章內容文字框
function showArticlerow(){
    $("#content").hide();
    $("#editRow").show();
}
//送出並隱藏修改文章內容文字框
function editArticle(){
    var content=$("#editContent").val().replace(/ /g,"&nbsp").replace(/\n/g,"<br />");
    $.post("/blog/editArticle",{
        "_id":getUrlVal("_id"),
        "content":content
    },function(res,status){
        if(res.status==0){
            alert("修改成功");
        }
    });
    history.go(0);
}
//刪除文章
function deleteArticle(){
    if(confirm("確定要刪除嗎?")){
        $.post("/blog/deleteArticle",{
            "_id":getUrlVal("_id")
        },function(res){
            if(res.status==0){
                alert("刪除成功");
                location.href="/public/blog.html";
            }
        });
    }
}
//按讚
function pushlike(){
    if(!$.cookie("userID") || $.cookie("userID")=="null"){
        alert("請先登入會員");
        location.href="/public/login.html";
        return;
    }else{
        $.post("/blog/pushlike",{
            "_id":getUrlVal("_id"),
            "account":$.cookie("userID")
        },function(res){
            if(res.status==0){
                history.go(0);
            }else{
                alert("Error");
            }
        });
    }   
}
//留言
function addComment(){
    if(!$.cookie("userID") || $.cookie("userID")=="null"){
        alert("請先登入會員");
        location.href="/public/login.html";
        return;
    }
    $.post("/blog/addComment",{
        "_id":getUrlVal("_id"),
        "account":$.cookie("userID"),
        "message":$("#commentBar").val()
    },function(res){
        if(res.status==0){
            window.location.reload();
        }else{
            alert("Error");
        }
    });
}
//按讚留言
function commentPushlike(id){
    $.post("/blog/commentPushlike",{
        "_id":getUrlVal("id"),
        "account":$.cookie("userID"),
        "id":id
    },function(res){
        if(res.status==0){
            history.go(0);
        }else{
            alert("Error");
        }
    })
}
//編輯留言
function editComment(id){
    var msg=$(`#message${id}`);
    var btnVal=$(`#edit${id}`);
    var editArea=`<input id="inp${id}" class="ml-3" type="text" autocomplete="off"/>`;
    if(btnVal.text()=="編輯"){
        msg.hide();
        msg.after(editArea);
        btnVal.text("完成");
    }else{
        var newMsg=$(`#inp${id}`).val();
        $(`#inp${id}`).remove();
        if(newMsg){
            $.post("/blog/editComment",{
                "_id":getUrlVal("_id"),
                "id":id,
                "message":newMsg
            },function(res){
                if(res.status==0){
                    history.go(0);
                }
            });
        }
        msg.show();
        btnVal.text("編輯");
    }
}
//刪除留言
function deleteComment(id){
    $.post("/blog/deleteComment",{
        "_id":getUrlVal("_id"),
        "id":id
    },function(res){
        if(res.status==0){
            window.location.reload();
        }else{
            alert("Error");
        }
    });
}

