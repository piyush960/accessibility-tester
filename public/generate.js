const links = document.querySelectorAll('.results .navigator nav a');
const resultDisplay = document.querySelector('.result-display .accordian');
const errBtn = document.querySelector('.results .dropdown .error-btn.active');
const errLinks = document.querySelector('.results .dropdown .error-links');
const errSpan = document.querySelector('.results .dropdown .error-btn span');
const results = document.querySelectorAll('.result-display .accordian .errors > div');
const allResults = Array.from(resultDisplay.children);



links.forEach(link => {

    link.addEventListener('click', e => {
        if(!link.classList.contains('active')){
            removeActive();

            errLinks.classList.remove('show-drp');
            errSpan.classList.remove('show-spn');
            
            link.classList.add('active');
            allResults.forEach(res => {
                if(res.classList.contains(link.textContent.replace(/[^A-Za-z]/g, '').toLowerCase())){
                    res.style.display = 'block';
                }
            })
        }
    })  
})

errBtn.addEventListener('click', e => {   

    errLinks.classList.toggle('show-drp');
    errSpan.classList.toggle('show-spn');    
})

function removeResults(){
    allResults.forEach(res => {
        res.style.display = 'none';
    })
}




function removeActive(){
    removeResults();
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


function makeChart(){
    const ctx = document.getElementById('doughnut');

    const errnos = [];

    links.forEach( link => {
        errnos.push(Number(link.dataset.l.replace(/\D/g, '')))
    })

    new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Errors', 'Warnings', 'Notices'],
          datasets: [{
            label: '',
            data: [errnos[0], errnos[1], errnos[2]],
            backgroundColor: ['red', 'orange', 'yellow'],
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
}

makeChart();


Array.from(errLinks.children).forEach( child => {
    child.addEventListener('click', e => {
        e.preventDefault();
        const name_class = child.textContent.split(' ')[0];
        showAll();
        
        if(!child.classList.contains('show-all')){
            results.forEach(result => {
                if(!result.classList.contains(name_class)){
                    console.log(result);
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

