// JavaScript source code
(function () {
    "use strict";

    window.addEventListener("load", initialize);
    const URL = "https://api.exchangeratesapi.io";
    let CURRENCY = "USD";
    let BASE = "USD";
    let VALUE = 0;
    var request = new XMLHttpRequest()

    // Initialize the page and allow buttons to be functional 
    function initialize() {
        qs(".btn1").addEventListener("click", askForIncome);
        qs(".btn2").addEventListener("click", askForSpending);
    }

    // Ask the income (title, amount, date)
    function askForIncome() {
        var box = $("input_box");
        box.style.display = "block";
        let title = $("income_or_spending");
        title.innerText = "Enter Income";
        qs(".addbtn").addEventListener("click", getCurrency);
        qs(".add-close").addEventListener("click", closingInput);
    }

    // Ask the spending (title, amount, date)
    function askForSpending() {
        var box = $("input_box");
        box.style.display = "block";
        let title = $("income_or_spending");
        title.innerText = "Enter Spending";
        qs(".addbtn").addEventListener("click", getCurrency);
        qs(".add-close").addEventListener("click", closingInput);
    }

    // closing button for income
    function closingInput() {
        var box = $("input_box");
        box.style.display = "none";
    }

    // Using foreign exchange rates API, get the currency rate 
    // and compute the currency to USD 
    function getCurrency() {
        let currencyDom = qs(".currency-select");
        CURRENCY = currencyDom.options[currencyDom.selectedIndex].value;
        let date = $("input-date").value;
        let urlValue = URL + "/" + date + "?base=" + BASE;
        console.log(urlValue);
        request.open('GET', urlValue, true)
        request.responseType = 'json';
        request.send();
        request.onload = function () {
            let data = request.response;
            if (request.status >= 200 && request.status < 400) {
                if (data.rates.length == 0) {
                    console.log("error");
                } else {
                    let flag = false;
                    let currencyList = data.rates;
                    for (let key in currencyList) {
                        if (key == CURRENCY) {
                            addInput(currencyList[key]);
                            flag = true; 
                        }
                    }
                    if (!flag) {
                        alert("Error: currency not found! ");
                    }
                    
                } 
            }
            
        }
    }

    // Add the income to the chart and convert the amount by the 
    // "Base" currency of the date. 
    function addInput(rate) {  
        let oneRow = document.createElement("tr");
        let dateBox = document.createElement("th");
        let titleBox = document.createElement("th");
        let amountBox = document.createElement("th");
        let currencyBox = document.createElement("th");
        let category = document.createElement("th");
        let date = $("input-date").value;
        let title = $("input-title").value;
        let amount = $("input-amount").value;
        dateBox.innerText = date;
        titleBox.innerText = title;
        let amountWithBase = Math.round(amount / rate * 100) / 100;
        
        currencyBox.innerText = CURRENCY;
        oneRow.appendChild(dateBox);
        oneRow.appendChild(titleBox);
        oneRow.appendChild(amountBox);
        oneRow.appendChild(currencyBox);
        oneRow.appendChild(category);
        qs(".table-body").appendChild(oneRow);
        if ($("income_or_spending").innerText == "Enter Income") {
            category.innerText = "Income";
            amountBox.innerText = amountWithBase;
            amountBox.className = "income";
            total('income');
        } else {
            category.innerText = "Spending"
            amountBox.innerText = -1 * amountWithBase;
            amountBox.className = "spending";
            total('spending');
        }
    }

    /**
     * Add every income or spending.
     * @param {String} input - String that represents whether the total should be income or spending
     */
    function total(input) {
        let list = qsa('.' + input);
        console.log(input);
        let total = 0;
        for (let i = 0; i < list.length; i++) {
            console.log("adding to total");
            console.log(list[i].innerText);
            total += eval(list[i].innerText);

        }
        let totalBox = qsa('#' + input + '_total h2');
        totalBox[1].innerText = total;
    }

    // check status of the returned data
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ": " + response.statusText));
        }
    }

    function $(id) {
        return document.getElementById(id);
    }

    function qs(query) {
        return document.querySelector(query);
    }

    function qsa(query) {
        return document.querySelectorAll(query);
    }
})();