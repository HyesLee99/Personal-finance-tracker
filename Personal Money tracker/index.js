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
        qs(".addbtn").addEventListener("click", addTheData);
    }

    // Add the income or spending 
    function addTheData() {

    }

    // for test purpose! 
    function myFunction() {
        alert("Hi");
    }

    function askForSpending() {
        var box = $("adds");
        box.style.display = "block";
    }

    function $(id) {
        return document.getElementById(id);
    }

    function qs(query) {
        return document.querySelector(query);
    }
})();