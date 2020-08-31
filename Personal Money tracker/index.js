// JavaScript source code
(function () {
    "use strict";

    window.addEventListener("load", initialize);
    const URL = "https://api.exchangeratesapi.io";
    let CURRENCY = "USD";
    let BASE = "USD";
    let VALUE = 0;


    function initialize() {
        qs(".btn1").addEventListener("click", askForIncome);
        qs(".btn2").addEventListener("click", askForSpending);
    }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ": " + response.statusText));
        }
    }

    function askForIncome() {
        var box = $("addi");
        box.style.display = "block";
        qs(".addbtn").addEventListener("click", getCurrency);
        qs(".add-close").addEventListener("click", closingIncome);
    }

    function askForSpending() {
        var box = $("adds");
        box.style.display = "block";
        qsa(".addbtn")[1].addEventListener("click", addSpending);
        qs(".spend-close").addEventListener("click", closingSpend);
    }

    function closingIncome() {
        var box = $("addi");
        box.style.display = "none";
    }

    function closingSpend() {
        var box = $("adds");
        box.style.display = "none";
    }

    function getCurrency() {
        let currencyDom = qs(".currency-select");
        CURRENCY = currencyDom.options[currencyDom.selectedIndex].value;
        let date = $("income-date").value;
        let urlValue = URL + "/" + date + "?base=" + BASE;
        console.log(urlValue);
        fetch(urlValue, { mode: "no-cors" })
            .then(checkStatus)
            .then(JSON.parse)
            .then(findCurrency)
            .catch(console.log)
    }

    function findCurrency(currencyList) {
        if (currencyList.length == 0) {
            console.log("error");
        } else {
            let list = currencyList[0].rates;
            for (let i = 0; i < list.length; i++) {
                if (CURRENCY == list[i]) {
                    let rate = list[i].CURRENCY;
                    addIncome(rate);
                }
            }
            console.log("not found");
        }
    }


    // Add the income or spending 
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
        let currencyDom = qs(".currency-select");
        let currency = currencyDom.options[currencyDom.selectedIndex].text;
        dateBox.innerText = date;
        titleBox.innerText = title;
        amountBox.innerText = amount * rate;
        category.innerText = "Income";  
        currencyBox.innerText = currency;
        getCurrency(urlValue);
        oneRow.appendChild(dateBox);
        oneRow.appendChild(titleBox);
        oneRow.appendChild(amountBox);
        oneRow.appendChild(currencyBox);
        oneRow.appendChild(category);
        qs(".table-body").appendChild(oneRow);
    }

    

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