"use strict";

// 로그인 화면 불러오기
const loginBtn = document.querySelector('#login-btn');

if (loginBtn !== null)
    loginBtn.addEventListener("click", loginPage);

function loginPage() {
    location.href = "/login";
}

// 로그인 성공에 따른 메뉴 변화
const menuToggle = document.querySelector('#menuToggle');
const toggleMenu = document.querySelector('.menu');

menuToggle.addEventListener("click", openMenu);

function openMenu() {
    toggleMenu.classList.toggle('active');
}

//스크롤 했을 때 기능 
window.onscroll = () => {

    if (window.scrollY > 80) {
        document.querySelector('.header .header-2').classList.add('active');
    } else {
        document.querySelector('.header .header-2').classList.remove('active');
        toggleMenu.classList.remove('active');
    }

}