
import {alertUser} from './utility.js';

(() => {

  const loginForm = document.querySelector("section#user-form");
 
  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (window.location.hash == "#signup") return;

    const email = loginForm.querySelector(
      '.form-body input[name="email"]'
    ).value;

    const password = loginForm.querySelector(
      '.form-body input[name="password"]'
    ).value;

    const url =
      "https://www.shorten-url-api.infobrains.club/api/public/auth/login";

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const jsonResponse = await response.json();

    if (response.status == 500) {
      alertUser('error', jsonResponse.message);
      return
    }
    if (response.status == 409) {
      alertUser('error', jsonResponse.message);
      return
    }
    if (response.status == 400) {
      alertUser('warning', "Insert Valid Input!");
      return
    }
    if (response.status == 200) {
      alertUser('success', jsonResponse.message);
      const token = jsonResponse.data.accessToken;
      localStorage.setItem("token", token);

      setTimeout( () => {
        window.location.hash = "";
        window.location.href = window.location.href = `./URLShortner-PureJS/index.html`;
      }, 3000);

      return
    }
  });
})();
