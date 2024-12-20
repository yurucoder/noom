const socket = io();

const welcome = document.getElementById("welcome"),
  welcomeForm = welcome.querySelector("form"),
  room = document.getElementById("room"),
  roomNickForm = document.getElementById("nickname"),
  roomMsgForm = document.getElementById("message");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleRoomNicknameSubmit(event) {
  event.preventDefault();
  const input = roomNickForm.querySelector("input");
  socket.emit("nickname", input.value);
}

function handleRoomMessageFormSubmit(event) {
  event.preventDefault();
  const input = roomMsgForm.querySelector("input");
  const value = input.value;
  socket.emit("new_message", roomName, value, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  roomNickForm.addEventListener("submit", handleRoomNicknameSubmit);
  roomMsgForm.addEventListener("submit", handleRoomMessageFormSubmit);
}

function handleWelcomeFormSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeFormSubmit);
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});
socket.on("bye", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${newCount})`;
  addMessage(`${user} left!`);
});
socket.on("new_message", addMessage);
socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
