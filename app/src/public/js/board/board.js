"use strict";

// 글 작성 버튼을 눌렀을 때
const write = document.querySelector('.add');

write.addEventListener('click', writeBoard);

function writeBoard() {
    location.href = '/board/write';
}

// 분류를 눌렀을 때 항목 표시
$('.custom-select').on('change', function () {
    var url = $(this).val();
    var page = window.location.search;
    var splited = page.replace("?", "").split(/[=?&]/);
    var param = {};

    for (var i = 0; i < splited.length; i++) {
        param[splited[i]] = splited[++i];
    }

    console.log(param.page);

    location.href = "/board?page=" + param.page + "&limit=" + url;
})