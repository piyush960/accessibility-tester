const loginForm = document.querySelector('.login form');
const signupForm = document.querySelector('.signup form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();
    clearErrors(signupForm);
    clearSuccess(signupForm);
    try{
        const response = await fetch('/signup', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, email, password
            })
        });

        const result = await response.json();
        if(result.errors){
            showErrors(signupForm, result.errors);
        }

        if(result.user){
            showSuccess(signupForm);
            setTimeout(redirect, 500);
        }
    }catch(e){
        console.log(e);
    }
})

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailname = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();
    clearErrors(loginForm);
    clearSuccess(loginForm);
    try{
        const response = await fetch('/login', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailname, password
            })
        });

        const result = await response.json();
        if(result.errors){
            showErrors(loginForm, result.errors);
        }

        if(result.user){
            showSuccess(loginForm);
            setTimeout(redirect, 500);
        }
    }catch(e){
        console.log(e);
    }
})

function redirect(){
    location.assign('/');
}

function showErrors ( form, errors ){
    if(form.parentElement.classList.contains('signup')){
        const username = form.username.nextElementSibling;
        username.textContent = errors.username;
    }
    const email = form.email.nextElementSibling;
    const password = form.password.nextElementSibling;
    email.textContent = errors.email;
    password.textContent = errors.password;
}

function clearErrors(form){
    if(form.parentElement.classList.contains('signup')){
        const username = form.username.nextElementSibling;
        username.textContent = '';
    }
    const email = form.email.nextElementSibling;
    const password = form.password.nextElementSibling;
    email.textContent = '';
    password.textContent = '';
}

function showSuccess(form){
    if(form.parentElement.classList.contains('signup')){
        const username = form.username;
        username.style.border = '2px solid green';
    }
    const email = form.email;
    const password = form.password;
    email.style.border = '2px solid green';
    password.style.border = '2px solid green';
}

function clearSuccess(form){
    if(form.parentElement.classList.contains('signup')){
        const username = form.username;
        username.style.border = 'none';
    }
    const email = form.email;
    const password = form.password;
    email.style.border = 'none';
    password.style.border = 'none';
}