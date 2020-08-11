function newVote(data){
    var content=document.createElement("tr");
    content.className="row100 body";

    var date=new Date(data.postdate);
    var crt_date=(date.getMonth()+1) + "/" + date.getDate() + ' ' +(date.getHours() < 10 ? '0' +date.getHours() : date.getHours()) +
    ':' + (date.getMinutes() < 10 ?'0' + date.getMinutes() : date.getMinutes());

    var addHtml = `<td class="cell100 column1"></td>
                    <td class="cell100 column2">
                        <a href="/public/voteDetail.html?id=${data._id}">${data.title}</a>
                    </td>
                    <td class="cell100 column5">
                       ${data.account}
                    </td>
                    <td class="cell100 column6">
                        ${crt_date}
                    </td>`;
    content.insertAdjacentHTML("beforeend",addHtml);
    $('#votelist').append(content);
}
function getUrlVal(val){
    //取得網址列的搜尋字串
    var query=window.location.search.substring(1); //去掉"?"
    var vars=query.split("&");
    for(var i=0;i<vars.length;i++){
        var pair=vars[i].split("=");
        if(pair[0]==val){
            return pair[1];
        }
    }
    return(false);
}
//取得投票資料
function getVote(){
    var search="";
    if(getUrlVal("account")){
        search+="account"+getUrlVal("account")+"&";
    }
    if(getUrlVal("title")){
        search+="title"+getUrlVal("title")+"&";
    }
    $.get("/vote/getVote?"+search,function(data,status){
        for(var i=0;i<data.length;i++){
            newVote(data[i]);
        }
    });
}
function search(){
    var search=$("#title").val();
    $("#title").val("");
    document.getElementById("votelist").textContent="";
    
    $.get("/vote/getVote?title="+search,function(data,status){
        if(data==""){
            alert("查無此標題");
        }else{
            for(var i=0;i<data.length;i++){
            newVote(data[i]);
            }
        }
    });
}

getVote();