let url = 'https://www.cbr-xml-daily.ru/daily_json.js';
let table = document.querySelector('.table');

let currencyDataObj = {};


async function getCurrencyData(url, prevDays = 0) {
    let response = await fetch(url);

    if (response.ok) {
        let result = await response.json();
        Object.entries(result.Valute).forEach(([key, value]) => {
            if (!currencyDataObj[key]) {
                currencyDataObj[key] = [];
                currencyDataObj[key].push({ [result.Date]: value });
            } else {
                currencyDataObj[key].push({ [result.Date]: value });
            }
        });
        if (prevDays === 0) {
            render(currencyDataObj);
            return;
        } else {
            prevDays--;
            getCurrencyData(`https:${result.PreviousURL}`, prevDays);
        }
    }
}

// function transformData(arr){

// }



function render(obj) {
    Object.entries(obj).forEach(([key, value]) => {
        // console.log(value);
        value.forEach(item => {
            Object.entries(item).forEach(([key, value]) => {
                
                let currentPercents = countPercentDifference(value);
                let colorClass = '';

                if (currentPercents < 0) {
                    currentPercents = `${currentPercents}`;
                    colorClass = 'green';
                } if (currentPercents > 0) {
                    currentPercents = `${currentPercents}`;
                    colorClass = 'red';
                }
                let html = `
                <div class="line">
                    <div class="code">${value.CharCode}</div>
                    <div class="value">${value.Value}</div>
                    <div class="difference ${colorClass}">${currentPercents}%</div>
                    <span class="tooltip">${value.Name}</span>
                </div>
            `;
                table.insertAdjacentHTML('beforeend', html);
            });
        });
    });
}

function countPercentDifference(obj){
    let percent = obj.Previous / 100;
    return ((100 - obj.Value / percent)).toFixed(2) ;
}

table.addEventListener('mousemove', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    let tooltip = e.target.closest('.line')?.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.top = (y + 20) + 'px';
        tooltip.style.left = (x + 20) + 'px';
    }

});


getCurrencyData(url, 10);

// console.log(Math.abs(-2));