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
        $("changebtn").addEventListener("click", changeBaseCurrency);
    }

    // Ask the income (title, amount, date)
    function askForIncome() {
        var box = $("input_box");
        box.style.display = "block";
        let title = $("income_or_spending");
        title.innerText = "Enter Income";
        box.classList.add("income_box");
        qs(".btn1").removeEventListener("click", askForIncome);
        qs(".btn1").addEventListener("click", closingInput);
        qs(".addbtn").addEventListener("click", validateInput);
    }

    // Ask the spending (title, amount, date)
    function askForSpending() {
        var box = $("input_box");
        box.style.display = "block";
        let title = $("income_or_spending");
        title.innerText = "Enter Spending";
        box.classList.add("spending_box");
        qs(".btn2").removeEventListener("click", askForSpending);
        qs(".btn2").addEventListener("click", closingInput);
        qs(".addbtn").addEventListener("click", validateInput);
    }

    // closing button for income
    function closingInput() {
        $("input-date").value = "";
        $("input-title").value = "";
        $("input-amount").value = "";
        var box = $("input_box");
        box.style.display = "none";
        if (box.classList.contains("income_box") && box.classList.contains("spending_box")) {
            qs(".btn1").removeEventListener("click", closingInput);
            qs(".btn1").addEventListener("click", askForIncome);
            box.classList.remove("income_box");
            qs(".btn2").removeEventListener("click", closingInput);
            qs(".btn2").addEventListener("click", askForSpending);
            box.classList.remove("spending_box");
        } else if (box.classList.contains("spending_box")) {
            qs(".btn2").removeEventListener("click", closingInput);
            qs(".btn2").addEventListener("click", askForSpending);
            box.classList.remove("spending_box");
        } else {
            qs(".btn1").removeEventListener("click", closingInput);
            qs(".btn1").addEventListener("click", askForIncome);
            box.classList.remove("income_box");
        }
        
    }

    // Using foreign exchange rates API, get the currency rate 
    // and compute the currency to USD 
    function getCurrency(type) {
        let currencyDom = qs(".currency-select");
        CURRENCY = currencyDom.options[currencyDom.selectedIndex].value;
        let date = $("input-date").value;
        let urlValue = URL + "/" + date + "?base=" + BASE;
        console.log(urlValue);
        gettingData(urlValue, type);   
    }

    function gettingData(urlValue, type) {
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
                            if (type == "adding") {
                                addInput(currencyList[key]);
                            } else {
                                console.log("Found the rate " + currencyList[key])
                                callback(currencyList[key]);
                            }
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
        let amountWithBase = amount / rate;
        
        currencyBox.innerText = CURRENCY;
        oneRow.appendChild(dateBox);
        oneRow.appendChild(titleBox);
        oneRow.appendChild(amountBox);
        oneRow.appendChild(currencyBox);
        oneRow.appendChild(category);
        qs(".table-body").appendChild(oneRow);
        dateBox.classList.add('dates');
        amountBox.classList.add('amounts');
        if ($("income_or_spending").innerText == "Enter Income") {
            category.innerText = "Income";
            amountBox.innerText = Math.round(amountWithBase * 100) / 100;
            amountBox.className = "income";
            let totalBox = qsa('#income_total h2');
            totalBox[1].innerText = Math.round((parseInt(totalBox[1].innerText) + amountWithBase) * 100) / 100;
            console.log(amountWithBase);
        } else {
            category.innerText = "Spending"
            amountBox.innerText = -1 * amountWithBase;
            amountBox.className = "spending";
            let totalBox = qsa('#spending_total h2');
            totalBox[1].innerText = Math.round((parseInt(totalBox[1].innerText) + -1 * amountWithBase) * 100) / 100;
        }
        oneRow.classList.add("list_of_bill");
        closingInput();
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


    function changeBaseCurrency() {

        let oldBase = BASE;
        let currency = qs('.base_currency');
        let newBase = currency.options[currency.selectedIndex].value;
        let list = qsa('.list_of_bill');
        console.log(newBase);

        CURRENCY = newBase;
        BASE = newBase;
        for (let i = 0; i < list.length; i++) {
            let listVal = list[i].getElementsByTagName('th');
            console.log("Date is " + listVal[0].innerText);
            console.log("Amount is " + listVal[2].innerText);
            let urlValue = URL + "/" + listVal[0].innerText + "?base=" + oldBase;
            let newRate = gettingData(urlValue, "changing");
            console.log(newRate);// error happens
            console.log(parseFloat(listVal[2].innerText));  
            listVal[2].innerText = parseFloat(listVal[2].innerText) * newRate;
        }
        // go though every list in the chart and change the amount value to new base....  
        // change the total income and totla spending

        total('income');
        total('spending');
    }

    function changeInput(rate) {
        let oneRow = document.createElement("tr");
        let dateBox = document.createElement("th");
        let titleBox = document.createElement("th");
        let amountBox = document.createElement("th");
        let currencyBox = document.createElement("th");
        let category = document.createElement("th");
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
            let totalBox = qsa('#income_total h2');
            totalBox[1].innerText = parseInt(totalBox[1].innerText) + amountWithBase;
        } else {
            category.innerText = "Spending"
            amountBox.innerText = -1 * amountWithBase;
            amountBox.className = "spending";
            let totalBox = qsa('#spending_total h2');
            totalBox[1].innerText = parseInt(totalBox[1].innerText) + -1 * amountWithBase;
        }
        closingInput();
    }




    // check status of the returned data
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ": " + response.statusText));
        }
    }

    /**
     * Validate the input including title, amount, date
     * */
    function validateInput() {
        let date = $("input-date").value;
        let title = $("input-title").value;
        let amount = $("input-amount").value;
        if (title == "") {
            alert("Please fill out the title!");
        } else if (amount == "") {
            alert("Please fill out the amount!");
        } else if(date == "") {
            alert("Please fill out the date!");
        } else {
            getCurrency("adding");
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