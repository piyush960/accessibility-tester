const form = document.getElementById('form');
const abortBtn = document.getElementById('abort-btn');
const controller = new AbortController();
const loader = document.querySelector('.loading-screen');
const errmsg = document.querySelector('#form .error-msg');
const signal = controller.signal;




form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = form.url.value.trim();
  document.getElementById('container').style.display = 'none';
  removeErr();
  if(url){
    reset();

    try{
      const response = await fetch('/results', {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ url }),
        signal,
      })
      
      const result = await response.json();

      if(result.success){
        document.querySelector('.loading-screen .scan-success').style.display = 'block';
        document.querySelector('.loading-screen .scanning').style.display = 'none';
        setTimeout(redirect, 1000, `/results?name=${result.name}`);
      }else{
        set();
        showErr(result.msg);
      }
      
      
    }catch(e){
      showErr(e);
      console.log(e);
    }

}else{
  showErr('Please enter a URL')
}

})

function showErr(msg){
  errmsg.textContent = msg;
}

function removeErr(){
  errmsg.innerHTML = ''
}

function redirect(loc){
  set();
  location.assign(loc);
}

function set(){
    loader.style.display = 'none';
    document.querySelector('body').style.overflow = 'auto';
    document.querySelector('body').style.overflowX = 'hidden';
    document.querySelector('body').style.height = 'auto';
    document.querySelector('.loading-screen .scan-success').style.display = 'none';
    document.querySelector('.loading-screen .scanning').style.display = 'block';
}

function reset(){
    loader.style.display = 'flex';
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('body').style.height = '100vh';
}

abortBtn.addEventListener("click", (e) => {
  
  controller.abort();
  set();
  setTimeout(redirect, 1000, '/');
  console.log("Download aborted");
});

