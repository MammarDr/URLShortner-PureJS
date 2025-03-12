import {addSettingsListner} from './getURLbyID.js';

export const tokenRetrive = () => {
  return localStorage.getItem('token');
}

// Notifications
const notification = {
    success: document.querySelector('.toast-item.success'),
    help: document.querySelector('.toast-item.help'),
    warning: document.querySelector('.toast-item.warning'),
    error: document.querySelector('.toast-item.error')
};


const notificationHide = (signal) => {
    signal.classList.add('hide');
    signal.classList.remove('slide-in-blurred-right');
}

Object.values(notification).forEach(signal => {
  const close = signal.querySelector('.close');
  close.addEventListener('click', (e) => {
    const notification = e.currentTarget.closest('.toast-item');
    notificationHide(notification);
  })
});

window.addEventListener('scroll', () => {

  // If Scroll, Remove Notfications
  Object.values(notification).forEach(signal => {
    if (signal) notificationHide(signal);
    
  });

});


export const alertUser = (type, prompt) => {

    let signal = notification[type];
    signal.style = `top:${window.scrollY}`;
    signal.classList.remove('hide');
    signal.querySelector('p').innerHTML = prompt;
    signal.classList.add('slide-in-blurred-right');

    clearTimeout(signal.dismissTimer);

     signal.dismissTimer = setTimeout(() => {
        signal.classList.remove('slide-in-blurred-right');
        signal.classList.add('hide');
        signal.style = `top:${0}`;
    }, 3000);
}


// URL Validatior
export const isValidURL = (url, flag = true) => {
    const regex = /^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}([\/?#].*)?$/;
    let subUrl = url.replace(/\bhttps:\/\/www.\b/gi, "").trim();
    subUrl = subUrl.replace(/\bhttps:\/\/\b/gi, "").trim();
    subUrl = subUrl.replace(/\bhttp:\/\/www.\b/gi, "").trim();
    subUrl = subUrl.replace(/\bhttp:\/\/\b/gi, "").trim();
    subUrl = subUrl.replace(/\bwww.\b/gi, "").trim();
    return flag ? regex.test(subUrl) : subUrl; // If True Do Test, else, Return the string without protocole://wwww.
}     

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load Scripts To HTML
export const loadScript = (src) => {
    if (document.querySelector(`script[src="${src}"]`)) return; 
    const script = document.createElement("script");
    script.setAttribute('src',`${src}`);
    script.type = "module";
    document.body.appendChild(script);
}


// Setting Menu Logic
export const urlSettings = {

  originalLink: document.querySelector('#url-update .url-original a'),
  shortLink: document.querySelector('#url-spec a'),
  Date_Modified: document.querySelector('#url-update .date-modified span'),
  Date_Created: document.querySelector('#url-update .date-created span'),
  Menu: document.getElementById('url-update'),
  _ID: document.querySelector('#url-update .info-wrapper'),
  Open: document.querySelector('#url-update span'),
  Copy: document.querySelector('#url-update .copy'),
  Edit: document.querySelector('#url-spec a'),
  Delete: document.querySelector('#url-update .delete'),
  Save: document.querySelector('#url-update .save'),
  Cancel: document.querySelector('#url-update button'),
  Clicks: document.querySelector('#url-update .clicks span')

}

// Add Copy Function To URL
export const addCopyFunction = (nodes) => {


  nodes.forEach(node => {

    
    if(node.tagName !== 'SPAN') {
      node = node.querySelector('.copy');
    }


    node.addEventListener('click',  (e)=> {
      const target =  e.currentTarget;
      var text = target.parentElement.querySelectorAll('a')[0].href;
      navigator.clipboard.writeText(text);
      target.querySelector('.abs').classList.remove('hide');
      setTimeout(() => {
          target.querySelector('.abs').classList.add('hide');
      }, 800);
    })

  });
}

// Display Fetched Data To Update Form
export const displayInfo = (data) => {

        if(data == null) {
          alertUser('error', "An Expected Error, Contact The Admin.");
          return;
        }
        
        urlSettings['_ID'].id = data.id;
        urlSettings['shortLink'].href = data.shortUrl;
        urlSettings['shortLink'].innerHTML = "link.short/" + data.shortUrl.slice(-5);
        urlSettings['originalLink'].href = data.originalUrl;
        urlSettings['originalLink'].innerHTML = isValidURL(data.originalUrl, false);
        urlSettings['Clicks'].innerHTML = `Clicks : ${data.clicks}`;
        urlSettings['Date_Modified'].innerHTML = data.updatedAt.split("T")[0];
        urlSettings['Date_Created'].innerHTML = data.createdAt.split("T")[0];
        urlSettings['Menu'].classList.remove('hide');

}

// Append URL To HTML
const structHTML = (dataList, status) => {
  let URLs = [];
  console.log(dataList);
  dataList.forEach((data) => {
    console.log(data);
  
    // Creating New URL
    const template = document.getElementById("fetch-links");
    const templateContent = template.content.cloneNode(true);

    var div = document.createElement("div");
    div.id = data.id;
    div.className = "fetch-links";

    div.appendChild(templateContent);

    const shortenURL = div.querySelector("#url-shorten > a");
    const originalURL = div.querySelector(".url-original a");
    const clicks = div.querySelector("#url-clicks span");
    
    console.log(data.shortUrl);
    shortenURL.href = data.shortUrl;
    console.log(data.shortUrl);
    shortenURL.innerHTML = "link.short/" + data.shortUrl.slice(-5);

    originalURL.href = data.originalUrl;
    originalURL.innerHTML = isValidURL(data.originalUrl,false);
    clicks.innerHTML = data.clicks + " clicks";

    // Storing The New URL in List
    URLs.push(div);     
    
  });

  if(status)  URLs = Array.from(URLs).reverse();
  return URLs;
}


/* FOR Future Implementation  
// Creat New URL
// Display It First
// Push The Last element To The Next Set if Current Set Size == 5)
// Change updateURL To Push Element to the stack
const LoadContent = (URLs) => {

  const container = document.querySelector('.links-container');

  let currSet = !set ? addSetHTML() : set[set.length - 1];

  for(var i = 0; i < URLs.length; i++) {

    removeDefaultEXAMPLE(document.querySelector(".fetch-links"));
    
    var size = parseInt(currSet.getAttribute('data-size'), 10);

    if(size == 5) {
      container.style = `height:${currSet.offsetHeight + 15}; overflow-x:scroll;`;
      currSet = addSetHTML();
      size = 0;
    }

    URLs[i].style.animationDelay = `${(i) * 0.4}s`;
    URLs[i].classList.add('fade-up');

    currSet.appendChild(URLs[i]);

    currSet.setAttribute('data-size', `${size + 1}`)
    
  }
}


const CreateContent = (URLs) => {

}
*/


export const appendURL = async (dataList, type) => {

    if (dataList === null) return;

    if(dataList.length == 0) {
      document.querySelector('.fetch-links').classList.remove('pulsating-element');
      document.getElementById('shorten-form').classList.remove('disable');
      return;
    }

    await delay(1500);

    const status = {
      Load: true,
      Create: false
    }

    let URLs = structHTML(dataList, status[type]); // Return List Of HTML Divs

    addSettingsListner(URLs); // Event To Open Settings 

    addCopyFunction(URLs); // Function To Copy URL

    
    const removeDefaultEXAMPLE = (node) => {
      if(node == null || node.id != 0) return;
      document.getElementById('shorten-form').classList.remove('disable');
      node.classList.add("fade-out");
      node.style.display = "none";
      node.remove();
    }

    const addSetHTML = () => {
      var div = document.createElement('div');
      div.classList.add('set');
      div.setAttribute('data-size', '0');
      container.appendChild(div);
      return div;
    }


    const container = document.querySelector('.links-container');
    const set = container.querySelectorAll('.set');

    let currSet = !set ? addSetHTML() : set[set.length - 1];

    for(var i = 0; i < URLs.length; i++) {

      removeDefaultEXAMPLE(document.querySelector(".fetch-links"));
      
      var size = parseInt(currSet.getAttribute('data-size'), 10);

      if(size == 5) {
        container.style = `height:${currSet.offsetHeight + 15}; overflow-x:scroll;`;
        currSet = addSetHTML();
        size = 0;
      }

      URLs[i].style.animationDelay = `${(i) * 0.4}s`;
      URLs[i].classList.add('fade-up');

      status[type] ? currSet.appendChild(URLs[i]) : currSet.prepend(URLs[i]);

      currSet.setAttribute('data-size', `${size + 1}`)
      
    }
  };
  

// Remove URL From HTML
export const removeURL = (_id) => {
  const target = document.querySelector(`#form-container #${_id}`);
  const currSet = target.closest('.set');
  var size = parseInt(currSet.getAttribute('data-size'), 10);

  if(size <= 1) {
    currSet.remove();
    const container = document.querySelector('.links-container');
    if(container.querySelectorAll(`.set`).length <= 1) {
      container.style.overflowX = 'hidden';
    }
  } else {
    currSet.setAttribute('data-size', `${size - 1}`);
    target.remove();
  }
}

// Update URL In HTML
export const updateURL = (_id, data) => {
  const newElement = structHTML([data], false);
  const target = document.querySelector(`#form-container #${_id}`);
  const parent = target.closest('.set');
  parent.replaceChild(newElement[0], target);
}

export const addAnimationURLform = () => {
  urlSettings['Menu'].style.pointerEvents = 'none';
  urlSettings['_ID'].classList.add('weak-pulsating-element');
}

export const removeAnimationURLform = () => {
  urlSettings['Menu'].style.pointerEvents = 'all';
  urlSettings['_ID'].classList.remove('weak-pulsating-element');
}