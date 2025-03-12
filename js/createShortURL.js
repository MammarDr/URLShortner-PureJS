import {tokenRetrive, alertUser, isValidURL, appendURL} from './utility.js';
(() => {

  const getProtocole = (url) => {
    if(/http:\/\//i.test(url)) {
      return 'http://www.'
    } else {
      return 'https://www.'
    }
  }

  document.querySelector("#shorten-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const input = e.currentTarget.querySelector('input[name="url"]');
    let url = input.value;
    input.value = "";

    if (!tokenRetrive()) {
      alertUser('error', "Invalid Token");
      return;
    }

    if (!isValidURL(url)) {
      alertUser('error', "Invalid URL");
      return;
    }

    url = getProtocole(url) + isValidURL(url, false);

    const shortenURL =
      "https://www.shorten-url-api.infobrains.club/api/private/urls";

    const response = await fetch(shortenURL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${tokenRetrive()}`,
      },
      body: JSON.stringify({
        url,
      }),
    });

    const jsonResponse = await response.json();

    if (response.status == 400) {
      alertUser('error', "Server Rejected The URL");
    }

    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    }

    if (response.status == 500) {
      alertUser('error', jsonResponse.message);
    }

    if (response.status == 201) {
      alertUser('success', "URL Has Been Shortened");
      appendURL([jsonResponse.data], 'Create');
    }
  });
})();
