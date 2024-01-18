const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = form.url.value;
  const response = await fetch('/results', {
    method: 'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body: JSON.stringify({ url })
  })

})

