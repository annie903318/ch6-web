if($.cookie("userID")=="" || $.cookie("userID")==null){
    alert("請先登入會員");
    location.href="../public/login.html";
}
var optionAry=[];
//新增選項
function pushOption(){
    if($("#option").val()!=""){
        optionAry.push($("#option").val());
        var optionLabel=`
        <li style="margin:10px">
            ${optionAry[optionAry.length-1]}
            <button type="button" class="del btn btn-secondary btn-sm">刪除</button>
        </li>
        `;
        $("#option-group").append(optionLabel);
        $("#option").val("");
    }
}
//新增投票
function addVote(){
    if(optionAry.length<2){
        alert("請至少加入兩個投票選項!");
        return ;
    }
    var postdata = {
        title:$("#title").val(),
        optionAry:optionAry,
        account:$.cookie("userID"),
        name:$.cookie("userName")
    };
    $.post("/vote/addVote",{
        "postdata":postdata 
    },function(res){
        if(res.status==0){
            alert("建立投票成功");
            location.href="/public/vote.html";
        }
    });
}
//刪除投票選項
$(document).on("click",".del",function(){
    var index=$(this).parent().index();
    optionAry.splice(index,1);
    $(this).parent().remove();
});