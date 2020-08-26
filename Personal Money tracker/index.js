// JavaScript source code
(function () {
    "use strict";

    window.addEventListener("load", initialize);


    function initialize() {
        qs(".btn1").addEventListener("click", askForIncome);
        qs(".btn2").addEventListener("click", askForSpending);
    }

    function askForIncome() {
        var box = $("addi");
        box.style.display = "block";
        qs(".addbtn").addEventListener("click", addIncome);
    }

    function askForSpending() {
        var box = $("adds");
        box.style.display = "block";
        qsa(".addbtn")[1].addEventListener("click", addSpending);
    }

    // Add the income or spending 
    function addIncome() {  
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
        amountBox.innerText = amount;
        category.innerText = "Income";  
        currencyBox.innerText = currency;
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