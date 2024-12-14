const messageList = document.querySelector("ul"),
  messageForm = document.getElementById("message"),
  nicknameForm = document.getElementById("nickname");

const socket = new WebSocket("ws://" + window.location.host);

const makeMessage = (type, payload) => JSON.stringify({ type, payload });

socket.addEventListener("open", () => {
  console.log("connected to server");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("disconnected from server");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
});

nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
});
