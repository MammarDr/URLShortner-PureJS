import {tokenRetrive, appendURL} from './utility.js';


(() => {

  const fetchData = async () => {


    const url = "https://www.shorten-url-api.infobrains.club/api/private/urls";
  
    let response = await fetch(`${url}?page=1&limit=15`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${tokenRetrive()}`,
      },
    });
  
    let jsonResponse = await response.json();
  
    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "../index.html";
      return null;
    }
  
    if (response.status == 500) {
      return null;
    }
  
    if (response.status == 200) {
      return jsonResponse.data;
    }
  };

  fetchData().then((data) => appendURL(data, 'Load'));

})();


