const links = document.querySelectorAll('.results .navigator nav a');
const resultDisplay = document.querySelector('.result-display');
const allResults = Array.from(resultDisplay.children);

links.forEach(link => {
    link.addEventListener('click', e => {
        removeActive();
        link.classList.add('active');
    })
})

function removeActive(){
    links.forEach(link => {
        link.classList.remove('active');
    })
}

const accordians = document.querySelectorAll('.results .accordian .content-box');

accordians.forEach(acc => {
    acc.addEventListener('click', e => {
        acc.classList.toggle('active');
    })
})

const ctx = document.getElementById('doughnut');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Errors', 'Warnings', 'Notices'],
    datasets: [{
      label: '',
      data: [1, 0, 0],
      backgroundColor: ['red', 'magenta', 'orange', 'green'],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


const errBtn = document.querySelector('.results .dropdown .error-btn.active');
const errLinks = document.querySelector('.results .dropdown .error-links');
const errSpan = document.querySelector('.results .dropdown .error-btn span');
const results = document.querySelectorAll('.result-display .accordian > div');

errBtn.addEventListener('click', e => {
    errLinks.classList.toggle('show-drp');
    errSpan.classList.toggle('show-spn');
})

Array.from(errLinks.children).forEach( child => {
    child.addEventListener('click', e => {
        const name_class = child.textContent.split(' ')[0];
        showAll();
        if(!child.classList.contains('show-all')){
            results.forEach(result => {
                if(!result.classList.contains(name_class)){
                    result.style.display = 'none';
                }   
            })
        }
        errLinks.classList.remove('show-drp');
        errSpan.classList.remove('show-spn');
    })
})

function showAll(){
    results.forEach(result => {
        result.style.display = 'block';
    })
}

