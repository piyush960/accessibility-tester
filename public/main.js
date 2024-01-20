const pathName = window.location.pathname;

const homelink = document.querySelector('header .navbar ul .home');
const historylink = document.querySelector('header .navbar ul .history');

homelink.classList.remove('current');
historylink.classList.remove('current');

if(pathName === '/'){
    homelink.classList.add('current');
}

if(pathName === '/history'){
    historylink.classList.add('current');
}


if(pathName === '/history'){
const removeBtns = document.querySelectorAll('.hist-card a.remove');

removeBtns.forEach( btn => {
    btn.addEventListener('click',async (e) => {
        const name = btn.parentElement.firstElementChild.textContent;
        
        try{
            const response = await fetch('/history', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            });
    
            const result = await response.json();
            if(result.success){
                btn.parentElement.style.display = 'none';
            }
        }catch(e){
            console.log(e);
        }
        
    })
})



}
