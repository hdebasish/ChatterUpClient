let socket = io.connect("http://localhost:3000");
let connectedUserElement = document.getElementById("connected-users");
let welcomeMessageElement = document.getElementById("welcome-user-name-id");
let inputField = document.getElementById("input-text");
let inputButton = document.getElementById("input-button");
let chatBox = document.getElementById("chat-id");
let logout = document.getElementById("logout");

let username;
let image;

inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    inputButton.click();
  }
});

async function fetchUserInfo() {
  try {
    const res = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/userdetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: res,
      },
    });

    await response
      .json()
      .then((data) => {
        socket.emit("connected-user", data);
      })
      .catch((err) => {
        console.log(err);
        localStorage.clear();
        window.location.replace("/index.html");
      });
  } catch (error) {
    console.log(error);
  }
}

let timer;

socket.on("getUsers", (users) => {
  users.filter((item, index) => users.indexOf(item) === index);

  if (users.length > 0) {
    users.forEach((user) => {
      if (user.username != userInfo.username) {
        let li = document.createElement("li");
        li.setAttribute("class", "online-user");
        li.setAttribute("id", "online-user-" + user.username);
        li.innerHTML = ` <div class="green-dot-wrapper"> <div class="green-dot"></div> </div> <div class="online-user-name">${user.username}</div> `;
        connectedUserElement.appendChild(li);
        const numOfOnlineUsers = document.querySelectorAll("li").length;
        document.getElementById("online-user-id").innerText =
          "Online Users " + numOfOnlineUsers;
      }
    });
  }
});

socket.on("current_user", (user) => {
  userInfo = user;
  welcomeMessageElement.innerText = "Welcome " + userInfo.username + "!";
});

socket.on("load-messages", (chats) => {
  chatBox.innerHTML = "";

  chats.forEach((chat) => {
    if (chat.username == userInfo.username) {
      let d = new Date(chat.timeStamp);
      let time = d.getHours() + ":" + d.getMinutes();

      let messageElement = document.createElement("div");
      messageElement.setAttribute("class", "chat-content user");
      messageElement.innerHTML = `<div class="img-container"><img src="${chat.image}" alt="" class="user-image"></div> <div class="user-text"> <div class="user-metadata"><div class="user-time">${time}</div> <div class="user-name">${chat.username}</div></div> <div class="user-content">${chat.message}</div></div> `;
      chatBox.append(messageElement);
    } else {
      let d = new Date(chat.timeStamp);
      let time = d.getHours() + ":" + d.getMinutes();

      let messageElement = document.createElement("div");
      messageElement.setAttribute("class", "chat-content sender");
      messageElement.innerHTML = `<div class="img-container"><img src="${chat.image}" alt="" class="user-image"></div> <div class="sender-text"> <div class="sender-metadata"><div class="sender-time">${time}</div> <div class="sender-name">${chat.username}</div></div><div class="sender-content">${chat.message}</div></div> `;
      chatBox.append(messageElement);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  });
});

socket.on("joined_user", (user) => {
  if (user) {
    let li = document.createElement("li");
    li.setAttribute("class", "online-user");
    li.setAttribute("id", "online-user-" + user.username);
    li.innerHTML = ` <div class="green-dot-wrapper"> <div class="green-dot"></div> </div> <div class="online-user-name">${user.username}</div> `;
    connectedUserElement.appendChild(li);
    const numOfOnlineUsers = document.querySelectorAll("li").length;
    document.getElementById("online-user-id").innerText =
      "Online Users " + numOfOnlineUsers;
  }
});

inputField.addEventListener("keydown", (event) => {
  socket.emit("typing-user", userInfo.username);
});

socket.on("typing", (user) => {
  if (timer) {
    clearTimeout(timer);
  }
  document.getElementById("sender-status-id").innerText =
    user + " is typing...";
  timer = setTimeout(() => {
    document.getElementById("sender-status-id").innerText = "";
  }, 1000);
});

inputButton.addEventListener("click", (event) => {
  let message = inputField.value;

  let d = new Date();
  let time = d.getHours() + ":" + d.getMinutes();

  if (message) {
    socket.emit("send_chat_msg", userInfo, message, time);
    let messageElement = document.createElement("div");
    messageElement.setAttribute("class", "chat-content user");
    messageElement.innerHTML = `<div class="img-container"><img src="${userInfo.image}" alt="" class="user-image"></div> <div class="user-text"> <div class="user-metadata"><div class="user-time">${time}</div> <div class="user-name">${userInfo.username}</div></div> <div class="user-content">${message}</div></div> `;
    chatBox.append(messageElement);
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

socket.on("receive_chat_msg", (user, message, time) => {
  if (user.username == userInfo.username) {
    let messageElement = document.createElement("div");
    messageElement.setAttribute("class", "chat-content user");
    messageElement.innerHTML = `<div class="img-container"><img src="${user.image}" alt="" class="user-image"></div> <div class="user-text"> <div class="user-metadata"><div class="user-time">${time}</div> <div class="user-name">${user.username}</div></div> <div class="user-content">${message}</div></div> `;
    chatBox.append(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  } else {
    let messageElement = document.createElement("div");
    messageElement.setAttribute("class", "chat-content sender");
    messageElement.innerHTML = `<div class="img-container"><img src="${user.image}" alt="" class="user-image"></div> <div class="sender-text"> <div class="sender-metadata"><div class="sender-time">${time}</div> <div class="sender-name">${user.username}</div></div><div class="sender-content">${message}</div></div> `;
    chatBox.append(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

logout.addEventListener("click", (event) => {
  localStorage.clear();
  window.location.replace("/index.html");
});

socket.on("disconnected_user", (user) => {
  document.getElementById("online-user-" + user.username).remove();
});
