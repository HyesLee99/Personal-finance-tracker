// JavaScript source code
(function () {
    "use strict";

    window.addEventListener("load", initialize);
    const URL = "https://api.apilayer.com/exchangerates_data/";
    const THEKEY = "CflOCpRUR1T60LKz7dlrnMG6CHeeZyyH";
    const myHeaders = new Headers();
    let CURRENCY = "USD";
    let BASE = "USD";
    let downSorted = true;

    // Initialize the page and allow buttons to be functional 
    function initialize() {
        myHeaders.append("apikey", THEKEY);
        qs(".btn1").addEventListener("click", askForIncome);
        qs(".btn2").addEventListener("click", askForSpending);
        $("changebtn").addEventListener("click", changeBaseCurrency);
        $("close").addEventListener("click", closeForm);
        $("csv").addEventListener("click", downloadCSV);
        $("select-all").addEventListener("click", selectAllCheckBox);
        $("delete").addEventListener("click", deleteList);
        $("amount-in").innerHTML = "Amount in </br> " + BASE;
        $("down-arrow").addEventListener("click", () => {
            downSorted = true;
            $("down-arrow").style.display = "none";
            $("up-arrow").style.display = "inline-block";
            sortingDown();
        });
        $("up-arrow").addEventListener("click", ()=> {
            downSorted = false;
            $("up-arrow").style.display = "none";
            $("down-arrow").style.display = "inline-block";
            sortingUp();
        })
    }

    function sortingDown() {
        let lists = qsa(".list_of_bill");
        deleteAll(qsa(".list_of_bill"));
        var arr = Array.prototype.slice.call(lists, 0);
        for(let i =  1; i < arr.length; i++) {
            let list = arr[i];
            let j = i-1;
            
            while (j>=0 && (parseInt(arr[j].id) > parseInt(list.id))) {
                arr[j+1] = arr[j];
                j = j-1
            }
            arr[j+1] = list;
        }
        for (let i = 0; i < arr.length; i++) {
            qs(".table-body").appendChild(arr[i]);
        }
    }

    function sortingUp() {
        let lists = qsa(".list_of_bill");
        deleteAll(qsa(".list_of_bill"));
        var arr = Array.prototype.slice.call(lists, 0);
        for(let i =  1; i < arr.length; i++) {
            let list = arr[i];
            let j = i-1;
            while (j>=0 && (parseInt(arr[j].id) < parseInt(list.id))) {
                arr[j+1] = arr[j];
                j = j-1
            }
            arr[j+1] = list;
        }
        for (let i = 0; i < arr.length; i++) {
            qs(".table-body").appendChild(arr[i]);
        }
    }



    function deleteList() {
        let checkboxes = qsa(".checkbox");
        let arr = [];
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                arr.push(checkboxes[i].parentElement.parentElement);
            }
        }
        deleteAll(arr);
        total('income');
        total('spending');
    }

    // Select all the checkboxes in the saved-search page
    function selectAllCheckBox() {
        let checkboxes = qsa(".checkbox");
        if (this.checked) {
            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = true;
            } 
        } else {
            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = false;
            } 
        }
    }

    function downloadCSV() {
        if (qsa(".list_of_bill").length == 0) {
            alert('There is no entry to export');
            return;
        }

        // parse the chart accordingly
        // 
        let A = [['Date','Title', 'Amount in base currency', 'Paid in', 'Category']];
        let lists = qsa(".list_of_bill");
        for(let i=0; i<lists.length; i++){ 
            let list = lists[i].childNodes;
            A.push([list[0].innerText, list[1].innerText, list[2].innerText, list[3].innerText, list[4].innerText]);
        }
        
        var csvRows = [];
        
        for(var i=0; i<A.length; i++){
            csvRows.push(A[i].join(','));
        }
        
        var csvString = csvRows.join("\r\n");
        $("csv").href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
        $("csv").target      = '_blank';
        $("csv").download    = 'financeU.csv';
    }

    function closeForm() {
        $("forms-container").style.display = "none";
    }

    // Ask the income (title, amount, date)
    function askForIncome() {
         var box = $("input_box");
        $("forms-container").style.display = "flex";
        let title = $("income_or_spending");
        title.innerText = "Enter Income";
        box.classList.add("income_box");
        qs(".addbtn").addEventListener("click", validateInput);
    }

    // Ask the spending (title, amount, date)
    function askForSpending() {
        var box = $("input_box");
        $("forms-container").style.display = "flex";
        let title = $("income_or_spending");
        title.innerText = "Enter Spending";
        box.classList.add("spending_box");
        qs(".addbtn").addEventListener("click", validateInput);
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
            getAmountInRightRate();
        }
    }

    function getAmountInRightRate() {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow',
          headers: myHeaders
        };

        let currencyDom = qs(".currency-select");
        let from = currencyDom.options[currencyDom.selectedIndex].value;
        let amount = $("input-amount").value;
        let date = $("input-date").value;
        let endPoint = URL + "convert?to=" + BASE + "&from=" + from + "&amount=" + amount + "&date=" + date;

        fetch(endPoint, requestOptions)
            .then(checkStatus)
            .then(JSON.parse)
            .then(addInput)
            .catch(console.log);
    }

    // Add the income to the chart and convert the amount by the 
    // "Base" currency of the date. 
    // amount == value in base currency
    function addInput(data) {  
        let oneRow = document.createElement("tr");
        let dateBox = document.createElement("th");
        let titleBox = document.createElement("th");
        let amountBox = document.createElement("th");
        let currencyBox = document.createElement("th");
        let category = document.createElement("th");
        let checkboxContainer = document.createElement("th");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList = "checkbox";
        let date = data["date"];
        let title = $("input-title").value;
        let amountWithBase = data["result"];
        dateBox.innerText = date;
        titleBox.innerText = title;
        console.log(data["query"]["from"]);
        currencyBox.innerText = data["query"]["from"];

        checkboxContainer.appendChild(checkbox);
        oneRow.appendChild(dateBox);
        oneRow.appendChild(titleBox);
        oneRow.appendChild(amountBox);
        oneRow.appendChild(currencyBox);
        oneRow.appendChild(category);
        oneRow.appendChild(checkboxContainer);
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
        oneRow.id = date.replaceAll("-", "");
        $("input-title").value = "";
        $("input-amount").value = "";
        $("input-date").value = "";
        let currencyDom = qs(".currency-select");
        currencyDom.options[0].selected = true;
        closeForm();
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

        let requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
          };
  
        for (let i = 0; i < list.length; i++) {
            let listVal = list[i].getElementsByTagName('th');
            console.log("Date is " + listVal[0].innerText);
            console.log("Amount is " + listVal[2].innerText);
            
            let isPos = true;
            let amount = listVal[2].innerText;
            if (amount < 0) {
                isPos = false;
                amount *= -1;
            }
            let date = listVal[0].innerText;
            let endPoint = URL + "convert?to=" + newBase + "&from=" + BASE + "&amount=" + amount + "&date=" + date;
    
            fetch(endPoint, requestOptions)
                .then(checkStatus)
                .then(JSON.parse)
                .then(data => {
                    let val = Math.round(data["result"] * 100) / 100;
                    if (!isPos) {
                        val *= -1;
                    }
                    listVal[2].innerText = val;
                })
                .catch(console.log);

        }
        BASE = newBase;
        total('income');
        total('spending');
        alert('Changed the base currency to ' +  currency.options[currency.selectedIndex].innerText);
        $("amount-in").innerHTML = "Amount in </br> " + BASE;
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

    function deleteAll(arr) {
        for(let i = 0; i < arr.length; i++) {
            arr[i].parentElement.removeChild(arr[i]);
        }
    }



    // check status of the returned data
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ": " + response.statusText));
        }
    }

    
//----------------------------Helper functions -------------------------------------------------------------
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