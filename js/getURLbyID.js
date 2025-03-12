import { tokenRetrive, alertUser, removeURL, displayInfo, urlSettings } from "./utility.js";


const getURL = async (_id) => {
 
  if (!tokenRetrive()) {
    alertUser("error", "Refrech Page");
    return;
  }

  document.querySelector('body').style.overflowY = "hidden";

  const response = await fetch(
    `https://www.shorten-url-api.infobrains.club/api/private/urls/${_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenRetrive()}`,
      },
    }
  );

  const jsonResponse = await response.json();
 
  if (response.status == 200) {
    return jsonResponse.data;
  }

  if (response.status == 401) {
    alertUser("error", "Unauthorized, You Will Be Loged Out");

    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1500);
  }

  if (response.status == 404) {
    removeURL(_id);
    alertUser("error", "URL not found");
    return;
  }

  if (response.status == 500) {
    alertUser("error", "Internal Server Error");
    return;
  }
};

export const addSettingsListner = (nodes) => {
  
  if (nodes == null) return;
  
  nodes.forEach(node => {

    node.querySelector('#url-option').addEventListener('click', (e) => {
      const id = e.target.closest(".fetch-links").id;
      getURL(id).then((data) => displayInfo(data));
    })

  });
};

