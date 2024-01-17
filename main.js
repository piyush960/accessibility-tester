const links = document.querySelectorAll('.results .navigator nav a');

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