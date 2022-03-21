let url = 'https://www.cbr-xml-daily.ru/daily_json.js';
let table = document.querySelector('.table');

async function getCurrencyData(url) {
    
    
    let response = await fetch(url);
    
    
    if (response.ok) {
        
        let result = await response.json();
        console.log(result);
        Object.values(result.Valute).forEach(item => {
            let percent = item.Previous / 100;
            let currentPercents = (100 - item.Value / percent).toFixed(2);
            let colorClass = '';

            if (currentPercents > 0) {
                currentPercents = `+${currentPercents}`;
                colorClass = 'green';
            } else {
                colorClass = 'red';
            }

            let html = `
                <div class="line">
                    <div class="code">${item.CharCode}</div>
                    <div class="value">${item.Value}</div>
                    <div class="difference ${colorClass}">${currentPercents}%</div>
                    <span class="tooltip">${item.Name}</span>
                </div>
            `;
            table.insertAdjacentHTML('beforeend', html);
        });
    }
}

getCurrencyData(url);

table.addEventListener('mousemove', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    let tooltip = e.target.closest('.line')?.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.top = (y + 20) + 'px';
        tooltip.style.left = (x + 20) + 'px';
    }

});