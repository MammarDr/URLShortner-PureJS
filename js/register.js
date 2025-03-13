import {alertUser} from './utility.js';

(() => {
  const registerForm = document.querySelector("section#user-form");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (window.location.hash === "#login") return;

    const name = registerForm.querySelector(
      '.form-body input[name="username"]'
    ).value;
    const email = registerForm.querySelector(
      '.form-body input[name="email"]'
    ).value;
    const password = registerForm.querySelector(
      '.form-body input[name="password"]'
    ).value;

    const url =
      "https://www.shorten-url-api.infobrains.club/api/public/auth/register";

    const result = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const jsonResponse = await result.json();

    if (result.status == 500) {
      alertUser('error', jsonResponse.message);
      return;
    }
    if (result.status == 409) {
      alertUser('warning', "Insert Valid Input!");
      return;
    }
    if (result.status == 400) {
      alertUser('error', jsonResponse.message);
      return;
    }
    if (result.status == 201) {
      alertUser('success', "Registration Successful.");
      const token = jsonResponse.data.accessToken;
      localStorage.setItem("token", token);

      setTimeout( () => {
        window.location.hash = "";
        window.location.href = "../index.html";
      }, 3000);

    }
  });
})();
