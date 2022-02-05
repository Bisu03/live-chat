const socket = io()

const textMessage = document.getElementById("textarea")
const messageContainer = document.querySelector(".message__area")
const btnClick = document.querySelector("#btn")

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

}

const name = prompt("Enter your name to join Live chat")

socket.emit('new-user-joined', name)

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'incoming');

    console.log(name);
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message} `, 'incoming')
})

socket.on('left', name => {
    append(`${name} left the chat`, 'incoming');
})

btnClick.addEventListener('click', (e) => {
    e.preventDefault();
    const message = textMessage.value;
    append(`You: ${message}`, 'outgoing');
    socket.emit('send', message);
    textMessage.value = '';
})


