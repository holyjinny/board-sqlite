"use strict";

const loginBtn = document.getElementById('login'),
    signupBtn = document.getElementById('signup');

loginBtn.addEventListener('click', (e) => {
    var parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
        if (element !== 'slide-up') {
            parent.classList.add('slide-up');
        } else {
            signupBtn.parentNode.classList.add('slide-up');
            parent.classList.remove('slide-up');
        }
    })
});

signupBtn.addEventListener('click', (e) => {
    var parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
        if (element !== 'slide-up') {
            parent.classList.add('slide-up');
        } else {
            loginBtn.parentNode.parentNode.classList.add('slide-up');
            parent.classList.remove('slide-up');
        }
    })
});