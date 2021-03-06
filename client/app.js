const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener('submit', (event) => login(event));
addMessageForm.addEventListener('submit', (event) => sendMessage(event));

function login(event) {
  event.preventDefault();
  if (userNameInput.value) {
    userName = userNameInput.value;
    socket.emit('login', { author: userName });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else alert('Input your name first!');
}

function sendMessage(e) {
  e.preventDefault();
  if (messageContentInput.value) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  } else alert('Please type your message first');
}

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author === userName) message.classList.add('message--self');
  if (author === "Chat bot") message.classList.add('message--bot');
  const header = `<h3 class="message__author">${author === userName ? 'You' : author}</h3>`;
  const text = `<div class="message__content">${content}</div>`;
  message.innerHTML = header + text;
  messagesList.appendChild(message);
}