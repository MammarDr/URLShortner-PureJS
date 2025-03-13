import {tokenRetrive, alertUser, isValidURL, appendURL} from './utility.js';
(() => {

  const getProtocole = (url) => {
    return /http:\/\//i.test(url) ? 'http://www.' : 'https://www.';
  }


  const cleanURL = (url) => {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  const capitalizeFirstLetter = (str) => {
    const lowerCaseStr = str.toLowerCase();
    return lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
  }

  document.querySelector("#shorten-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const input = e.currentTarget.querySelector('input[name="url"]');
    let url = cleanURL(input.value);
    input.value = "";

    if (!tokenRetrive()) {
      alertUser('error', "Invalid Token");
      return;
    }

    if (!isValidURL(url)) {
      alertUser('error', "Invalid URL");
      return;
    }

    url = getProtocole(url) + capitalizeFirstLetter(isValidURL(url, false));

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
      window.location.href = "./index.html";
    }

    if (response.status == 500) {
      alertUser('error', jsonResponse.message);
    }

    if (response.status == 201) {
      alertUser('success', "URL Has Been Shortened");
      console.log(jsonResponse.data);
      appendURL([jsonResponse.data], 'Create');
    }
  });
})();
