import {tokenRetrive, alertUser, updateURL, urlSettings, isValidURL} from './utility.js';


const addAnimationURLform = () => {
    urlSettings['Menu'].style.pointerEvents = 'none';
    urlSettings['_ID'].classList.add('weak-pulsating-element');
  }
  
const removeAnimationURLform = () => {
    urlSettings['Menu'].style.pointerEvents = 'all';
    urlSettings['_ID'].classList.remove('weak-pulsating-element');
}

function oneUpperCase(str) {
  const lowerCaseStr = str.toLowerCase();
  return lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
}



(
    () => {

      const hideContainer = () => {
        document.querySelector('body').style.overflowY = "auto";
        urlSettings['Menu'].classList.add('hide');
      }
    
        
      urlSettings['Save'].addEventListener('click', async (e) => {

        if(urlSettings['Save'].getAttribute('data-api-call') === 'false') {
          hideContainer();
          return;
        }

        if (!tokenRetrive()) {
            alertUser('error', "Invalid Token, Sign-in First!");
            hideContainer();
            return;
        }

        if(!confirm('Want To Save Changes ?')) {
            hideContainer();
            return;
        } 
        
        addAnimationURLform();

        const cleanURL = (url) => {
          return url.endsWith('/') ? url.slice(0, -1) : url;
        }

        const getProtocole = (url) => {
          return /http:\/\//i.test(url) ? 'http://www.' : 'https://www.';
        }

        let newURL = cleanURL(urlSettings['originalLink'].href);
        newURL = getProtocole(newURL) + oneUpperCase(isValidURL(newURL, false));

        const id = urlSettings['_ID'].getAttribute('id');
        const url ="www.shorten-url-api.infobrains.club/api/private/urls/";
       
        const response = await fetch(`https://www.shorten-url-api.infobrains.club/api/private/urls/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization'  : `Bearer ${tokenRetrive()}`
          },
          body: JSON.stringify({
            url : newURL
          })
        })


        const jsonResponse = await response.json();

        if(response.status == 200) {
          alertUser('success', "URL Has Been Updated!");
          updateURL(id, jsonResponse.data);
          setTimeout( () => {
            hideContainer();
            removeAnimationURLform();
          }, 3000);
          return;
        }

        if(response.status == 400) {
          alertUser('error', "Invalid URL");
          hideContainer();
          removeAnimationURLform();
          return;
        }

        if(response.status == 401) {

          alertUser('error', "Unauthorized, You Will Be Loged Out");

          localStorage.removeItem('token');

          setTimeout( () => {
            window.location.href = "../index.html";
          }, 3000);

          return;
        }

        if(response.status == 404) {
          alertUser('error', "URL not found");
          hideContainer();
          removeAnimationURLform();
          return;
        } 

        if(response.status == 500) {
          alertUser('error', "Internal Server Error");
          hideContainer();
          removeAnimationURLform();
          return;
        }

    
    })}



) ();
