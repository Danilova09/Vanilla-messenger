const userFormBlock = <HTMLFormElement>document.getElementById('userFormBlock')!;
const userEditModalForm = <HTMLFormElement>document.getElementById('userEditModalForm')!;
let firstNameInput = <HTMLInputElement>document.getElementById('firstNameInput');
let lastNameInput = <HTMLInputElement>document.getElementById('lastNameInput');
let inputMessage = <HTMLInputElement>document.getElementById('inputMessage')!;
let mainUserNameTitle = document.getElementById('mainUserNameTitle')!;
let messagesBlock = document.getElementById('messages-block')!;
let mainUserLastNameTitle = document.getElementById('mainUserLastNameTitle')!;
let mainProfileUrl = 'http://146.185.154.90:8000/blog/nazik.danilova@mail.ru/profile'
let mainPostUrl = 'http://146.185.154.90:8000/blog/nazik.danilova@mail.ru/posts';
let lastDateTime: string;
let currentDateTime: string;
let card;

const getUserProfile = async () => {
    const response = await fetch(mainProfileUrl, {method: 'GET'});
    const res = await response.json();
    mainUserNameTitle.innerText = res.firstName;
    mainUserLastNameTitle.innerText = res.lastName;
}

getUserProfile();

const postUsersProfile = async (userName: string, userLastName: string) => {
    let body = new URLSearchParams();
    body.append('firstName', `${userName}`);
    body.append('lastName', `${userLastName}`);
    await fetch(mainProfileUrl, {method: 'POST', body});
}

const createCards = (res: any) => {
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
}

userEditModalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await postUsersProfile(firstNameInput.value, lastNameInput.value);
    mainUserNameTitle.innerText = `${firstNameInput.value}`;
    mainUserLastNameTitle.innerText = `${lastNameInput.value}`;
    userEditModalForm.reset();
})

userFormBlock.addEventListener('submit', async (e) => {
    e.preventDefault();
    let body = new URLSearchParams();
    body.append('message', `${inputMessage.value}`);
    await fetch(mainPostUrl, {method: 'POST', body});
    userFormBlock.reset();
});

const createMessagesBlock = async () => {
    messagesBlock.innerText = '';
    const response = await fetch(mainPostUrl, {method: 'GET'});
    const res = await response.json();
    lastDateTime = res[res.length - 1].datetime;
    createCards(res);
}

createMessagesBlock();

const getCurrentMessagesBlock = () => {
    const interval = setInterval(async () => {
        const response = await fetch(mainPostUrl, {method: 'GET'});
        const res = await response.json();
        currentDateTime = res[res.length - 1].datetime;
        if (lastDateTime !== currentDateTime) {
            messagesBlock.innerText = '';
            createCards(res);
        }
    }, 2000);
}

getCurrentMessagesBlock();

