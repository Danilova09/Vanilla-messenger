"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userFormBlock = document.getElementById('userFormBlock');
const userEditModalForm = document.getElementById('userEditModalForm');
let firstNameInput = document.getElementById('firstNameInput');
let lastNameInput = document.getElementById('lastNameInput');
let inputMessage = document.getElementById('inputMessage');
let mainUserNameTitle = document.getElementById('mainUserNameTitle');
let messagesBlock = document.getElementById('messages-block');
let mainUserLastNameTitle = document.getElementById('mainUserLastNameTitle');
let mainProfileUrl = 'http://146.185.154.90:8000/blog/nazik.danilova@mail.ru/profile';
let mainPostUrl = 'http://146.185.154.90:8000/blog/nazik.danilova@mail.ru/posts';
let lastDateTime;
let currentDateTime;
let card;
const getUserProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(mainProfileUrl, { method: 'GET' });
    const res = yield response.json();
    mainUserNameTitle.innerText = res.firstName;
    mainUserLastNameTitle.innerText = res.lastName;
});
getUserProfile();
const postUsersProfile = (userName, userLastName) => __awaiter(void 0, void 0, void 0, function* () {
    let body = new URLSearchParams();
    body.append('firstName', `${userName}`);
    body.append('lastName', `${userLastName}`);
    yield fetch(mainProfileUrl, { method: 'POST', body });
});
const createCards = (res) => {
    for (let i = res.length - 1; i > 10; i--) {
        card = document.createElement('div');
        card.setAttribute('class', 'card my-4');
        card.innerHTML = `
                        <h5 class="card-header">user: ${res[i].user.firstName} ${res[i].user.lastName}</h5>
                        <div class="card-body">
                        <p class="card-text">message: ${res[i].message}</p>
                        <div> `;
        messagesBlock.append(card);
    }
};
userEditModalForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    yield postUsersProfile(firstNameInput.value, lastNameInput.value);
    mainUserNameTitle.innerText = `${firstNameInput.value}`;
    mainUserLastNameTitle.innerText = `${lastNameInput.value}`;
    userEditModalForm.reset();
}));
userFormBlock.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    let body = new URLSearchParams();
    body.append('message', `${inputMessage.value}`);
    yield fetch(mainPostUrl, { method: 'POST', body });
    userFormBlock.reset();
}));
const createMessagesBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    messagesBlock.innerText = '';
    const response = yield fetch(mainPostUrl, { method: 'GET' });
    const res = yield response.json();
    lastDateTime = res[res.length - 1].datetime;
    createCards(res);
});
createMessagesBlock();
const getCurrentMessagesBlock = () => {
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(mainPostUrl, { method: 'GET' });
        const res = yield response.json();
        currentDateTime = res[res.length - 1].datetime;
        if (lastDateTime !== currentDateTime) {
            messagesBlock.innerText = '';
            createCards(res);
        }
    }), 2000);
};
getCurrentMessagesBlock();
