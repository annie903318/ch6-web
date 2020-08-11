//取得網址列上的搜尋條件
function getUrlVal(val){
    var query=window.location.search.substring(1);
    var vars=query.split("&");
    for(var i=0;i<vars.length;i++){
        var pair=vars[i].split("=");
        // if(pair[0]==val){
        //     return pair[1];
        // }
        return pair[1];
    }
}
//供getVoteDetail()呼叫
function initVoteDetail(data){
    var head=`
        <h3>
            ${data.name}
            (<a class="person" href="vote.html?account=${data.account}">
                ${data.account}
            </a>)
        </h3>`;   
    $("#a_head").append(head);
    var content=`<h2 class="a_title">${data.title}</h2>`;
    var a_date=new Date(data.postdate);
    var date=`${a_date.getMonth()+1}月${a_date.getDate()}日  ${a_date.getHours()}:${a_date.getMinutes()}`;
    content+=`<div class="a_head">${date}</div>`;
    $("#a_content").append(content);
    var account="";
    if($.cookie("userID") && $.cookie("userID")!=null){
        account=$.cookie("userID");
    }
    //票數統計
    var vote_total=0;
    data.option.forEach(element => {
        vote_total+=element.account.length;
    });
    var cnt=0;
    //選項及票數
    data.option.forEach(element=>{
        var ischeck=(element.account.indexOf(account)<0)?"":"checked";
        var length=(vote_total==0)?0:element.account.length/vote_total*95;
        var comment=`<div class="pt-4 pb-4">
                        <div style="width:50%;float:left;">
                            <input type="radio" name="option" value="${cnt}" onchange="pushVote()" style="float: left" ${ischeck} />
                            <div class="option">
                                ${element.name}
                            </div>
                        </div>
                        <div style="width:40%;float:right">
                            ${element.account.length} 票
                        </div>
                    </div>`; //style="width:${length}%"
                   
        $('#a_content').append(comment);
        cnt+=1;
    });
}
//呼叫後端API取得投票內容
function getVoteDetail(){
    if(!getUrlVal("_id")||!getUrlVal("title")){
        alert("查無此頁!");
        location.href="../public/vote.html";
        return;
    }
    $.get("/vote/getVoteById?_id="+getUrlVal("_id"),function(res,status){
        if(res.status!="0"){
            alert(res.msg);
            location.href="../public/vote.html";
        }else{
            initVoteDetail(res.data);
        }
    });
}
getVoteDetail();
//投票
function pushVote(){
    if(!$.cookie("userID")||$.cookie("userID")==null){
        alert("請先登入會員");
        location.href="../public/login.html";
        return;
    }
    $.post("/vote/pushVote",{
        "_id":getUrlVal("_id"),
        "account":$.cookie("userID"),
        "cnt":$("input[name=option]:checked").val()
    },function(res){
        if(res.status==0){
            history.go(0);
        }
    });
}
//取消投票
function cancel(){
    if (!$.cookie('userID') || $.cookie('userID') == "null") {
        alert(" 請先登入會員 ");
        location.href = '/public/login.html';
        return;
    }
    $.post("/vote/cancel", {
        '_id': getUrlVal("_id"),
        'account': $.cookie('userID')
        }, function (res) {
        if (res.status == 0) {
            history.go(0);
        }
    });
}