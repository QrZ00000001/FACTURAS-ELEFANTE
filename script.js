const ctx = document.getElementById('invoiceChart').getContext('2d');

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const rawData = {
    "2023": {
        "amounts": [0, 4684971, 3291153, 1514922, 1758749, 3258710, 612659, 5263921, 1890085, 6769482, 8144185, 8633850],
        "counts": [0, 39, 30, 32, 41, 20, 29, 50, 37, 17, 19, 53],
        "color": "#ff3b30"
    },
    "2024": {
        "amounts": [2846751, 7571498, 692223, 10162530, 1704104, 1886150, 6545179, 1384811, 7358915, 2431641, 1090278, 5338773],
        "counts": [63, 14, 83, 57, 14, 5, 8, 7, 10, 12, 6, 18],
        "color": "#ff9500"
    },
    "2025": {
        "amounts": [957855, 34652526, 7184613, 2016488, 5845436, 4729058, 2800190, 7552230, 4759550, 3669008, 12823380, 10827656],
        "counts": [3, 18, 21, 8, 20, 14, 21, 24, 23, 16, 28, 32],
        "color": "#34c759"
    },
    "2026": {
        "amounts": [1099229, 33299239, 7969754, 47600, 0, 0, 0, 0, 0, 0, 0, 0],
        "counts": [16, 16, 22, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        "color": "#007aff"
    }
};

let currentChart;

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function initChart(view = 'comparison') {
    if (currentChart) {
        currentChart.destroy();
    }

    let datasets = [];
    const yearsToShow = view === 'comparison' ? Object.keys(rawData) : [view];
    
    yearsToShow.forEach(year => {
        const data = rawData[year];
        // Line for amount
        datasets.push({
            label: `Monto ${year}`,
            data: data.amounts,
            borderColor: data.color,
            backgroundColor: `${data.color}22`,
            borderWidth: view === 'comparison' ? 2 : 4,
            tension: 0.4,
            fill: view !== 'comparison',
            yAxisID: 'y'
        });
        
        // Bar for quantity (only if single year view or very subtle)
        if (view !== 'comparison') {
            datasets.push({
                label: `Facturas ${year}`,
                data: data.counts,
                type: 'bar',
                backgroundColor: `${data.color}44`,
                borderColor: data.color,
                borderWidth: 1,
                yAxisID: 'y1',
                borderRadius: 6
            });
        }
    });

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#a1a1a6', usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label.includes('Monto')) {
                                return label + ': ' + formatCurrency(context.parsed.y);
                            }
                            return label + ': ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#a1a1a6',
                        callback: (value) => formatCurrency(value)
                    }
                },
                y1: {
                    display: view !== 'comparison',
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#a1a1a6' },
                    title: { display: true, text: 'Cant. Facturas', color: '#a1a1a6' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a1a1a6' }
                }
            }
        }
    });
}

function updateView(view) {
    const title = document.getElementById('view-title');
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(view)) {
            item.classList.add('active');
        }
    });
    
    title.innerText = view === 'comparison' ? 'Comparativa Histórica (2023-2026)' : `Facturación Año ${view}`;
    initChart(view);
}

initChart();
