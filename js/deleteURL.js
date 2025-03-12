import {alertUser,removeURL, tokenRetrive, urlSettings} from './utility.js';


const addAnimationURLform = () => {
    urlSettings['Menu'].style.pointerEvents = 'none';
    urlSettings['_ID'].classList.add('weak-pulsating-element');
  }
  
const removeAnimationURLform = () => {
    urlSettings['Menu'].style.pointerEvents = 'all';
    urlSettings['_ID'].classList.remove('weak-pulsating-element');
}

export const deleteURLbyID = async (_id) => {
    
    if (document.querySelector(".fetch-links").id == 0) {
        document.querySelector(".fetch-links").remove();
        return;
      }

    if(!tokenRetrive()) {
        alertUser('error', 'Refrech The Page!');
        return;
    }

    if(_id == null) {
        alertUser('error', 'ERROR#001');
        return;
    }
   
    const target = document.querySelector(`.fetch-links#${_id}`);

    if(target == null) {
        alertUser('error', 'URL Is Not Found.');
        return;
    }

    if(!confirm('Want To Delete URL ?')) {
        document.querySelector('body').style.overflowY = "auto";
        urlSettings['Menu'].classList.add('hide');
        return;
    }

    addAnimationURLform();

    const response = await fetch(`https://www.shorten-url-api.infobrains.club/api/private/urls/${_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${tokenRetrive()}`
        },
        body: JSON.stringify({})
    });


    const jsonResponse = await response.json();
   
   if (response.status == 404) {
         alertUser('error', "URL Has Not Been Found.");
         removeAnimationURLform();
       }
   
       if (response.status == 401) {
         localStorage.removeItem("token");
         window.location.href = "./index.html";
       }
   
       if (response.status == 500) {
         alertUser('error', "Internal server error.");
         removeAnimationURLform();
       }
   
       if (response.status == 200) {
         alertUser('success', "URL Has Been Deleted.");
         setTimeout( () => {
             removeURL(_id);
             document.querySelector('body').style.overflowY = "auto";
             urlSettings['Menu'].classList.add('hide');
             removeAnimationURLform();
         }, 3000);
       }

    }


(
    () => {

        urlSettings['Delete'].addEventListener('click', (e) => {
            if(urlSettings['_ID'].id == 0) {
                alertUser('warning', 'Insert A New URL First.');
                return;
            }
            deleteURLbyID(urlSettings['_ID'].id);    
        })  

    }
) ();
