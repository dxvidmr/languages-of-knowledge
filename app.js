
let stepsData = [];


// Construir steps

function buildSteps(steps) {
  const container = document.getElementById('steps');

  steps.forEach(step => {
    const div = document.createElement('div');
    div.className = 'step';
    div.dataset.chart   = step.chart;
    div.dataset.caption = step.caption || '';

    div.innerHTML = `
      <div class="step-content">
        <h2>${step.title}</h2>
        <p>${step.text}</p>
      </div>
    `;
    container.appendChild(div);
  });
}


// ACTUALIZAR PANEL DERECHO

const chartDisplay = document.getElementById('chart-display');
const chartCap     = document.getElementById('chart-caption');

function updateChart(src, caption) {
  const isSvg = src.toLowerCase().endsWith('.svg');

  if (isSvg) {
    chartDisplay.innerHTML =
      `<object data="${src}" type="image/svg+xml" aria-label="${caption}"></object>`;
  } else {
    chartDisplay.innerHTML =
      `<img src="${src}" alt="${caption}" />`;
  }

  chartCap.textContent = caption;
}

function highlightStep(element) {
  document.querySelectorAll('.step-content')
          .forEach(el => el.classList.remove('active'));
  element.querySelector('.step-content').classList.add('active');
}


// SCROLLAMA

function initScrollama() {
  const scroller = scrollama();

  scroller
    .setup({
      step:   '.step',
      offset: 0.5
    })
    .onStepEnter(({ element }) => {
      updateChart(element.dataset.chart, element.dataset.caption);
      highlightStep(element);
    });

  window.addEventListener('resize', scroller.resize);
}


// Iniciar

fetch('data/steps.json')
  .then(r => r.json())
  .then(steps => {
    stepsData = steps;
    buildSteps(steps);

    // Cargar primer gráfico
    updateChart(steps[0].chart, steps[0].caption);

    initScrollama();
  })
  .catch(err => console.error('Error cargando steps.json:', err));
