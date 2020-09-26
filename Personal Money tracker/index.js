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
        var box = $("addi");
        box.style.display = "block";
        qs(".addbtn").addEventListener("click", getCurrency);
        qs(".add-close").addEventListener("click", closingIncome);
    }

    // Ask the spending (title, amount, date)
    function askForSpending() {
        var box = $("adds");
        box.style.display = "block";
        qsa(".addbtn")[1].addEventListener("click", addSpending);
        qs(".spend-close").addEventListener("click", closingSpend);
    }

    // closing button for income
    function closingIncome() {
        var box = $("addi");
        box.style.display = "none";
    }

    // closing button for spending
    function closingSpend() {
        var box = $("adds");
        box.style.display = "none";
    }

    // Using foreign exchange rates API, get the currency rate 
    // and compute the currency to USD 
    function getCurrency() {
        let currencyDom = qs(".currency-select");
        CURRENCY = currencyDom.options[currencyDom.selectedIndex].value;
        let date = $("income-date").value;
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
                            console.log("found the currency rate!");
                            addIncome(currencyList[key]);
                            flag = true; 
                        }
                    }
                    if (!flag) {
                        alert("currency not found! ");
                    }
                    
                } 
            }
            
        }
    }

    function testing() {
        console.log(currencyList[i] + "is not currency that I am looking for, " + CURRENCY);
        if (CURRENCY == currencyList[i]) {
            let rate = currencyList[i].CURRENCY;
            addIncome(rate);
            console.log("successfully added! " + rate);
        }
    }

    // Add the income to the chart and convert the amount by the 
    // "Base" currency of the date. 
    function addIncome(rate) {  
        let oneRow = document.createElement("tr");
        let dateBox = document.createElement("th");
        let titleBox = document.createElement("th");
        let amountBox = document.createElement("th");
        let currencyBox = document.createElement("th");
        let category = document.createElement("th");
        let date = $("income-date").value;
        let title = $("income-title").value;
        let amount = $("income-amount").value;
        dateBox.innerText = date;
        titleBox.innerText = title;
        amountBox.innerText = Math.round(amount / rate * 100) / 100;
        category.innerText = "Income";  
        currencyBox.innerText = CURRENCY;
        oneRow.appendChild(dateBox);
        oneRow.appendChild(titleBox);
        oneRow.appendChild(amountBox);
        oneRow.appendChild(currencyBox);
        oneRow.appendChild(category);
        qs(".table-body").appendChild(oneRow);
    }

    // Add the spending to the chart and convert the amount by the 
    // "Base" currency of the date.
    function addSpending() {
        let oneRow = document.createElement("tr");
        let dateBox = document.createElement("th");
        let titleBox = document.createElement("th");
        let amountBox = document.createElement("th");
        let currencyBox = document.createElement("th");
        let category = document.createElement("th");
        let date = $("spending-date").value;
        let title = $("spending-title").value;
        let amount = $("spending-amount").value;
        let currencyDom = qsa(".currency-select")[1];
        let currency = currencyDom.options[currencyDom.selectedIndex].text;
        dateBox.innerText = date;
        titleBox.innerText = title;
        amountBox.innerText = amount;
        category.innerText = "Spending";
        currencyBox.innerText = currency;
        oneRow.appendChild(dateBox);
        oneRow.appendChild(titleBox);
        oneRow.appendChild(amountBox);
        oneRow.appendChild(currencyBox);
        oneRow.appendChild(category);
        qs(".table-body").appendChild(oneRow);
    }

    // for test purpose! 
    function myFunction() {
        alert("Hi");
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