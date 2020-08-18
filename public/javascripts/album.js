function upload() {
    if (!$.cookie("userID") || $.cookie("userID") == null) {
        alert("請先登入會員");
        location.href = "../public/login.html";
        return;
    }
    var img = document.getElementById("u_img_file");
    if (!/.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(img.value)) {
        alert("圖片類型不正確!");
        return;
    }
    var formData = new FormData();
    formData.append('photo', img.files[0]);
    var url = "/album/upload?account=" + $.cookie("userID");
    //先前所使用的$.post方法是$.ajax中HTTP POST 傳輸的簡化寫法，
    //但此處要傳輸的資料是base64編碼的相片檔案資料，使用jQuery的ajax來傳輸才能執行更精確的設置
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false, //代表傳輸資料不進行自動轉換
        contentType: false, //代表傳輸的資料型態不另外進行設置
        success: function (res) {
            if (res.status == 0) {
                alert("上傳成功!");
                history.go(0);
            }
        },
        error: function (err) {
            alert("上傳失敗!");
        }
    });
}
//修改預覽圖示
$("#u_img_file").change(function () {
    readURL(this);
});
function readURL(input) {
    if (input.files && input.files[0]) { //判斷是否為file型態以及是否有值
        var reader = new FileReader(); //HTML5中用於讀取檔案資料的方法
        reader.onload = function (e) {
            $("#u_img").attr("src", e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
//初始化相簿
function initAlbum(data) {
    data.photos.forEach(function (img) {
        var comment = `<div 
                            <a href="JavaScript:void(0)" onclick ="selectImg('${img}',this)">
                            <img class="u_img" src="/public/photos/${img}" style="width:350px;height:300px;margin:10%;display:inline;"/>
                            </a>
                        </div>`;

        $('#gallery').append(comment);
    });
}
// 取得所有相片
function getAlbum() {
    if (!$.cookie('userID') || $.cookie('userID') == "null") {
        alert(" 請先登入會員 ");
        location.href = '/public/login.html';
        return;
    }
    $.post("/album/getAlbum", { 'account': $.cookie('userID') },
        function (res) {
            if (res.status == 0) {
                initAlbum(res.data);
            }
        });
}
getAlbum();
//選取圖片
function initPic() {
    $("#preview").hide();
    $("#previewbg").hide();
    $("#displayImage").hide();
    $("#closeBtn").hide();
    $("#wrap").hide();
}
initPic();
function selectImg(img, a) {
    $("#albumList").hide();
    $("#preview").show();
    $("#previewbg").show();
    $("#displayImage").show();
    $("#closeBtn").show();
    $("#displayImage").attr("src", "/public/photos/" + img);
    $("#wrap").show();
}
//關閉視窗
function closeDialog() {
    $("#albumList").show();
    $("#preview").hide();
    $("#previewbg").hide();
    $("#displayImage").hide();
    $("#closeBtn").hide();
    $("#wrap").hide();
}
//刪除
function remove() {
    if (!$.cookie("userID") || $.cookie("userID") == null) {
        alert("請先登入會員");
        location.href = "../public/login.html";
        return;
    }
    if (!confirm("確定要刪除嗎?")) {
        return;
    } else {
        var imgPath = $("#displayImage").attr("src");
        var img = imgPath.replace("/public/photos/", "");
        $.post("/album/delete", {
            "account": $.cookie("userID"),
            "photo": img,
            "path":imgPath
        }, function (res) {
            if (res.status == 1) {
                alert("刪除失敗");
            } else {
                alert("刪除成功");
                history.go(0);
            }
        });
    }
}
