import {tokenRetrive, alertUser, isValidURL, loadScript, addCopyFunction, urlSettings} from './js/utility.js';


// If No Token, Provide Login & Singup Button
// If No Token, No API Scripts Are Provided
// If No Token, Restrict User Operations

// // If  Token, Provide Menu & Logout Button
// // If  Token, Load API Scripts To HTML
const userStatus = () => {

    const token = tokenRetrive();
    const newUser = document.querySelector('.new-user');
    const currUser = document.querySelector('.current-user');

    if(token) {

        currUser.classList.remove('hide');
        newUser.classList.add('hide');

        currUserSession();

    } else {

        currUser.classList.add('hide');
        newUser.classList.remove('hide');

        newUserSession();

    }

}

userStatus();

// IF USER IS NEW
function newUserSession() {
    const token = tokenRetrive();

    if(!token) {
        document.querySelector('.fetch-links').classList.remove('pulsating-element');
        document.getElementById('shorten-form').classList.remove('disable');

        let newUserForm;
        let inputs;
        let isEventExist = false;
        const loginBtn = document.querySelector('.white-button');
        const registerBtn = document.querySelector('.black-button');
        const shortenForm = document.querySelector('#shorten-form');

        // Requiring Login To Submit URL
        shortenForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alertUser('warning', "You Must Login First");
        })

        // User-Form is in <template> tag, we build it here
        const addNewUserForm = () => {
            
            if(document.querySelector('section#user-form') !== null) return;

            // Building Form 
            const section = document.createElement('section');
            const template = document.getElementById('user-form');
            const templateContent = template.content.cloneNode(true);

            section.id = "user-form";
            section.className = "abs";
            section.appendChild(templateContent);

            document.body.appendChild(section);

            newUserForm = section;
            inputs = section.querySelectorAll('#user-form input'); 

            newUserForm.addEventListener('click', (e) => {
                if(e.target == newUserForm) {
                    newUserForm.classList.add('hide');
                    window.location.hash = '';
                }
            })

            // Loading Scripts After Building The Form
            loadScript('./js/login.js');
            loadScript('./js/register.js');
        }

        // Reveal Sign Up Form
        const signUp = () => {

            addNewUserForm();

            window.location.hash = 'signup';

            document.querySelector('.form-title').innerHTML = 'Sign Up';
            document.querySelector('.form-body').children[0].classList.remove('hide')
            document.querySelector('.button-text').innerHTML = 'Create Account';
            document.querySelector('.login-link').innerHTML = 'Already have an account? <span style="cursor: pointer;">Login</span>';
            
            clearInputs();

        }
        
        // Reveal Login Form
        const logIn = () => {

            addNewUserForm();
            
            window.location.hash = 'login';

            document.querySelector('.form-title').innerHTML = 'Login';
            document.querySelector('.form-body').children[0].classList.add('hide')
            document.querySelector('.button-text').innerHTML = 'Login Now';
            document.querySelector('.login-link').innerHTML = 'Don\'t have an account? <span style="cursor: pointer;">Sign up</span>';
           
            clearInputs();

        }
        
        // Toggle Login & Signup while staying in same page
        const clearInputs = () => {
            
            // Add EventsListener Just Once
            if(!isEventExist) {
                
                isEventExist = true;

                const link = document.querySelector('.login-link');
                const password = document.querySelector('.password-toggle');

                // Switch to Login or Sign Up
                link.addEventListener('click', (e) => {
                    if (e.target.tagName === 'SPAN') {
                        if (document.querySelector('.form-title').innerHTML === 'Login') {
                            signUp();
                        } else {
                            logIn();
                        }
                    }
                });
                
                // Show/Hide Password
                password.addEventListener('click', () => {
                    let parent = document.querySelector('.form-body').children[2];
                    let toggle = parent.querySelector('.form-input');
                    toggle.type = toggle.type === "password" ? "text" : "password";
                });

            }
            
            // Clear Inputs After/Before Changes
            newUserForm.classList.remove('hide');
    
            inputs.forEach(input => {
                input.value = "";
            })
    
            let parent = document.querySelector('.form-body').children[2];
            let toggle = parent.querySelector('.form-input');

            toggle.type = "password";
                
        }
    
        loginBtn.addEventListener('click', logIn);
    
        registerBtn.addEventListener('click', signUp);
    
        

    }
}

// IF HAVE AN ACCOUNT
function currUserSession() {

    const token = tokenRetrive();

    if(token) {

        

        // API SCRIPTS
        loadScript('./js/createShortURL.js');
        loadScript('./js/getShortURL.js');
        loadScript('./js/getURLbyID.js');
        loadScript('./js/updateURL.js');
        loadScript('./js/deleteURL.js');
        
        let profileImage = document.querySelector('.profile-image');
        const options = document.querySelector('.profile-settings');
        
        // Show Menu
        profileImage.addEventListener('click', () => {
            options.classList.toggle('hide');
            document.addEventListener('click', closeMenu);
        })

        let buttons = document.querySelectorAll('.card button');
        let card = document.querySelector('.card');

        // Menu Logic (change)
        const closeMenu = (e) => {
            switch(e.target) {
                case profileImage:
                    return;
                case buttons[0]:
                    window.location.href = 'https://github.com/MammarDr'
                    break;
                case buttons[1]:
                    localStorage.removeItem('token');
                    window.location.href = './index.html'
                    break;
                default:
                    if(card.contains(e.target)) return;
                    options.classList.add('hide');
          
        
            document.removeEventListener('click', closeMenu);
          };
        }

        document.addEventListener('click', closeMenu);
        
        

    }
}




const copyButtons = document.querySelectorAll('.copy');

// Smother UX
document.querySelector('input').addEventListener('focus', (e)=> {
    window.scrollBy({ top: 80, behavior: 'smooth' });
})


// Implementing Copy Link To Buttons
addCopyFunction(copyButtons);


// ## URL Settings ## //

const settingsBtn = document.querySelector('#url-option');


// Open URL Settings 
settingsBtn.addEventListener('click', (e)=> {
    urlSettings['Menu'].classList.remove('hide');
});

// Close Settings Popup
urlSettings['Menu'].addEventListener('click', (e) => {
    
    if(e.target == urlSettings['Menu'] || e.target == urlSettings['Cancel']) {
        document.querySelector('body').style.overflowY = "auto";
        urlSettings['Menu'].classList.add('hide');
        return;
    }

    if(tokenRetrive()) return;

    if(urlSettings['Delete'] == e.target  || urlSettings['Save'] == e.target) {
           alertUser('error', "Log-in First To Make Changes.");
           urlSettings['Menu'].classList.add('hide');
       }
});


urlSettings['Open'].addEventListener('click', () => {
    const url = urlSettings['Menu'].querySelector('a').href;
    window.open(url, "_blank");
})



// ## Update URL Input ## //

const updateLinkForm = document.querySelector('.new-url-wrapper');
const updateLinkWrapper = updateLinkForm.querySelector('.new-url');
const updateInput = updateLinkWrapper.querySelector('input');

// Show URL Update Tab
urlSettings['Edit'].addEventListener('click', () => {
    updateLinkForm.classList.remove('hide');
})

// Close URL Update
updateLinkForm.addEventListener('click', (e) => {
    if(e.target === updateLinkForm) {
        updateLinkForm.classList.add('hide');
    }
})



const btn = updateLinkWrapper.querySelector('button');

// Check Before Accepting New URL
updateInput.addEventListener('input', () => {
    if(isValidURL(updateInput.value)) {
        btn.disabled = false;
        btn.style = 'cursor: pointer;';
    } else {
        btn.disabled = true;
        btn.style = 'cursor: auto;';
    }
})

// Decide URL Protocole
const getProtocole = (url) => {
    if(/http:\/\//i.test(url)) {
      return 'http://www.'
    } else {
      return 'https://www.'
    }
  }

// Close URL Update Input
// Only After User Confirm Changes
// API Will Do The Rest
btn.addEventListener('click', () => {

    urlSettings['originalLink'].innerHTML = isValidURL(updateInput.value, false);
    urlSettings['originalLink'].href = getProtocole(updateInput.value) + urlSettings['originalLink'].innerHTML;
    updateInput.value = "";

    // This Indicate That Changes
    // Has Happend To URL
    urlSettings['Save'].setAttribute('data-api-call', 'true');

    updateLinkForm.classList.add('hide');
})

