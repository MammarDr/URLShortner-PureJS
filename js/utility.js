import {addSettingsListner} from './getURLbyID.js';



// Return Token
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


// Add Close Function To Notifications
Object.values(notification).forEach(signal => {
  const close = signal.querySelector('.close');
    close.addEventListener('click', (e) => {
      const notification = e.currentTarget.closest('.toast-item');
      notificationHide(notification);
    })
});


// If Scroll Hide Notification
window.addEventListener('scroll', () => {

  Object.values(notification).forEach(signal => {
    if (signal) notificationHide(signal);   
  });

});

// Display Notification By Type
export const alertUser = (type, prompt) => {

    let signal = notification[type];
    signal.style = `top:${window.scrollY}px`;
    signal.classList.remove('hide');
    signal.querySelector('p').innerHTML = prompt;
    signal.classList.add('slide-in-blurred-right');

    clearTimeout(signal.dismissTimer);

     signal.dismissTimer = setTimeout(() => {
        signal.classList.remove('slide-in-blurred-right');
        signal.classList.add('hide');
        signal.style = `top:${0}px`;
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
    return flag ? regex.test(subUrl) : subUrl; 
    // If Flag == True , Return The Result Of REGEX TEST
    // If Flag == False, Return The URL Without (protocole://wwww.)
    // One Function, 2 uses
}     


// Simulating API Delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load Scripts To HTML By Name
export const loadScript = (src) => {
    if (document.querySelector(`script[src="${src}"]`)) return; 
    const script = document.createElement("script");
    script.setAttribute('src',`${src}`);
    script.type = "module";
    document.body.appendChild(script);
}


// Storing All URL-Settings DOM Elements To One Variable
// No Repeating Queries
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

// Adding Copy Function To URL
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

// Each Time You Click Settings You Are Calling for API
// Display Fetched Data From < getURLbyID.js > To HTML Form
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

// Convert DATA To HTML
const structHTML = (dataList, status = 0) => {
  let URLs = [];
 
  dataList.forEach((data) => {
    
  
    // Creating New URL
    const template = document.getElementById("fetch-links");
    const templateContent = template.content.cloneNode(true);

    var div = document.createElement("div");
    div.id = data.id;
    div.className = "fetch-links";

    div.appendChild(templateContent);

    if(status == 2) return URLs.push(div); // returning DEFAULT EXAMPLE

    const shortenURL = div.querySelector("#url-shorten > a");
    const originalURL = div.querySelector(".url-original a");
    const clicks = div.querySelector("#url-clicks span");
    
  
    shortenURL.href = data.shortUrl;
   
    shortenURL.innerHTML = "link.short/" + data.shortUrl.slice(-5);

    originalURL.href = data.originalUrl;
    originalURL.innerHTML = isValidURL(data.originalUrl,false);
    clicks.innerHTML = data.clicks + " clicks";

    // Storing The New URL in List
    URLs.push(div);     
    
  });

  if(status == 1)  URLs = Array.from(URLs).reverse();
  return URLs;
}



const removeDefaultEXAMPLE = (node) => {
  if(node == null || node.id != 0) return;
  document.getElementById('shorten-form').classList.remove('disable');
  node.classList.add("fade-out");
  node.style.display = "none";
  node.remove();
}


// Adding New Tab To Store URL Data
// Each Tab Can Hold To Maximum 5 URLs
const addSetHTML = () => {
  const container = document.querySelector('.links-container');
  var div = document.createElement('div');
  div.classList.add('set');

  // Data-size Keep Tracking Of #URLs Inside
  div.setAttribute('data-size', '0');
  container.appendChild(div);
  return div;
}

// Display URLs Fetched From < getURLs.js >
const LoadContent = (URLs) => {

  const container = document.querySelector('.links-container');
  const set = container.querySelectorAll('.set');

  let currSet = !set ? addSetHTML() : set[0];

  for(var i = 0; i < URLs.length; i++) {

    removeDefaultEXAMPLE(document.querySelector(".fetch-links"));
    
    var size = parseInt(currSet.getAttribute('data-size'), 10);

    if(size == 5) {
      container.style = `height:${currSet.offsetHeight + 15}px; overflow-x:scroll;`;
      currSet = addSetHTML();
      size = 0;
    }

    URLs[i].style.animationDelay = `${(i) * 0.4}s`;
    URLs[i].classList.add('fade-up');

    currSet.appendChild(URLs[i]);

    currSet.setAttribute('data-size', `${size + 1}`)
    
  }
}


// Display URL From < createShortURL.js >
const CreateContent = (url, setNumber = 0) => {

  const container = document.querySelector('.links-container');
  const set = container.querySelectorAll('.set');
  

  let currSet = !set || setNumber + 1 > set.length ? addSetHTML() : set[setNumber];

  removeDefaultEXAMPLE(document.querySelector(".fetch-links"));
  
    url.style.animationDelay =  '0.4s';
    url.classList.add('fade-up');

    currSet.prepend(url);

    var size = parseInt(currSet.getAttribute('data-size'), 10);

    if(size == 5) {
      const list = currSet.querySelectorAll('.fetch-links');
      let temp = list[list.length - 1];
      CreateContent(temp, setNumber + 1);
      container.style = `height:${currSet.offsetHeight + 15}px; overflow-x:scroll;`;
      return;
    }

    currSet.setAttribute('data-size', `${size + 1}`)
    
  }






// Main Function To Display The DATA
// Type     = { LOAD        ,   CREATE        } 
// Function = { LoadContent ,   CreateContent }

export const appendURL = async (dataList, type) => {

    if (dataList === null) return;

    if(dataList.length == 0) {
      document.querySelector('.fetch-links').classList.remove('pulsating-element');
      document.getElementById('shorten-form').classList.remove('disable');
      return;
    }

    const status = {
      Load: 1,
      Create: 0
    }

    let URLs = structHTML(dataList, status[type]); // Store The Converted DATA To HTML

    addSettingsListner(URLs); // Give New Elements The Event To Open Settings 

    addCopyFunction(URLs); // Give New Elements Copy Functionality
    
    status[type] ? LoadContent(URLs) : CreateContent(URLs[0]); // Type = {LOAD, CREATE} 

  };
  

// Remove A URL From HTML
export const removeURL = (_id) => {

  const container = document.querySelector('.links-container');
  const target = container.querySelector(`#form-container #${_id}`);

  const sets = document.querySelectorAll('.set');
  const currSet = target.closest('.set');

  // If A Tab Is Left With One URL
  if(currSet.querySelectorAll('.fetch-links').length <= 1) {
    
    // Display Default URL Example
    // To Prevent Empty Container
    if(sets.length == 1) {
      CreateContent(structHTML([{id: 0}], 2)[0]);
      target.remove();
      return;
    }

    // Remove Scrolling If Only One Tab Exist
    if(sets.length == 2) {
      container.style.overflowX = 'hidden';
    }
    
    currSet.remove();
    return;
  }

  // If A Tab Is Left With More Then One URL
  const list = document.querySelectorAll('.set');

  // Find The Index Of Current TAB(SET)
  for (let i = 0; i < list.length; i++) {
    if (list[i] === currSet) {
      target.remove();
      reArrange(i);
      if(document.querySelectorAll('.set').length == 1)
        container.style.overflowX = 'hidden';
      break;
    }
  }

}


// If A URL Is Removed From A Tab 
// We Get The Most Recent URL From Other Tabs IF EXISTS
function reArrange(index) {
  const sets = document.querySelectorAll('.set');
  while(index < sets.length ) {

    // If We Reach The Last TAB(SET)
    // And Its Not Empty
    // Reduce Its Size By One In HTML
    if(index + 1 >= sets.length) {
      var size = parseInt(sets[index].getAttribute('data-size'), 10);
      sets[index].setAttribute('data-size', `${size - 1}`);
      return;
    }

    // Append The Most Recent URL
    sets[index].appendChild(sets[index + 1].querySelector('.fetch-links'));

    // If The Tab Becomes Empty After Taking Its Child
    // We Remove It And Stop The Recursive Call
    if (sets[index + 1].childElementCount === 0) {
      sets[index + 1].remove();
      return;
    }

    // Go To The Next Tab 
    // And Repeat The LOGIC
    index++;    
  }
}


// Update URL In HTML
export const updateURL = (_id, data) => {
  removeURL(_id); // Remove OLD VERSION
  appendURL([data], 'Create'); // Append NEW VERSION
}
