let signInSection = document.getElementById("signin-id");
let signUpSection = document.getElementById("signup-id");
let signInToggle = document.getElementById("signin-toggle");
let signUpToggle = document.getElementById("signup-toggle");
let signInUsername = document.getElementById("signin-username");
let signInPassword = document.getElementById("signin-password");
let loginForm = document.getElementById("login-form-id");
let signupForm = document.getElementById("signup-form-id");

async function renderChats() {
  const res = localStorage.getItem("token");
  if (res) {
    const response = await fetch("http://localhost:3000/api/userdetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: res,
      },
    });

    if (response.ok) {
      window.location.replace("/chat.html");
    }
  }
}

function renderSignUp() {
  signInSection.classList.add("hide");
  signUpSection.classList.remove("hide");
  signUpToggle.classList.add("hide");
  signInToggle.classList.remove("hide");
}

function renderSignIn() {
  signUpSection.classList.add("hide");
  signInSection.classList.remove("hide");
  signInToggle.classList.add("hide");
  signUpToggle.classList.remove("hide");
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm).entries();
  const data = JSON.stringify(Object.fromEntries(formData));
  try {
    const response = await fetch("http://localhost:3000/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const result = await response.text();

    signInUsername.value = "";
    signInPassword.value = "";

    if (response.ok) {
      localStorage.setItem("token", result);
      window.location.replace("/chat.html");
    } else {
      Toastify({
        text: result,
        className: "info",
        gravity: "top",
        position: "center",
        style: {
          background: "#ff3333",
        },
      }).showToast();
    }
  } catch (error) {
    console.log(error);
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm).entries();
  const data = JSON.stringify(Object.fromEntries(formData));
  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    // const result = await response.text();

    const result = await response.text();

    // console.log(await response.json());

    signInUsername.value = "";
    signInPassword.value = "";

    if (response.ok) {
      localStorage.setItem("token", result);
      window.location.replace("/chat.html");
    } else {
      Toastify({
        text: result,
        className: "info",
        gravity: "top",
        position: "center",
        style: {
          background: "#ff3333",
        },
      }).showToast();
    }
  } catch (error) {
    console.log(error);
  }
});
