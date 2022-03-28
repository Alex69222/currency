let url = 'https://www.cbr-xml-daily.ru/daily_json.js';
// let url = 'https://www.cbr-xml-daily.ru/archive/2022/03/17/daily_json.js';
let table = document.querySelector('.table');
let today = new Date();
let date = new Date();
// console.log(today.getMonth());
let datesArr = [];

for (let i = 1; i < 11; i++) {

    let tempDate = new Date(today.setDate(date.getDate() - i));
    let month = tempDate.getMonth() < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1;
    let day = tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate();
    datesArr.push([tempDate.getFullYear(), month, day]);

}
console.log(datesArr);
datesArr.forEach(data =>{
    getTenDaysCurrencyData(data[0], data[1], data[2]);
});
// getTenDaysCurrencyData(2022, '03', 19);


async function getTenDaysCurrencyData(year, month, day) {
    let response = await fetch(`https://www.cbr-xml-daily.ru/archive/${year}/${month}/${day}/daily_json.js`);
    if (response.ok) {
        let result = await response.json();
        console.log(result);
    }
} 
async function getCurrencyData(url) {


    let response = await fetch(url);


    if (response.ok) {

        let result = await response.json();
        // console.log(result);
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