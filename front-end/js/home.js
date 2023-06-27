import {LocalDate} from '../node_modules/@js-joda/core/dist/js-joda.esm.js';
import {Big} from '../node_modules/big.js/big.mjs';
import {showToast} from "./main.js";

const totalCustomers = $("#total-customers");
const totalItems = $("#total-items");
const totalOrders = $("#total-orders");

const numberOfCustomers = $("#customer-number");
const numberOfItems = $("#item-number");
const numberOfOrders = $("#order-number");

$(document).ready(function(){
    $(window).scroll(function (event) {
        totalCustomers.removeClass('animate__zoomIn');
        totalItems.removeClass('animate__zoomIn animate__delay-1s');
        totalOrders.removeClass('animate__zoomIn animate__delay-1s');
        const sc = $(window).scrollTop();

        setTimeout(() => {
            totalCustomers.addClass('animate__zoomIn');
            totalItems.addClass('animate__zoomIn animate animate__delay-1s');
            totalItems.css('--animate-delay','0.1s');
            totalOrders.addClass('animate__zoomIn animate animate__delay-1s');
            totalOrders.css('--animate-delay','0.2s');
        },0);
    });
});

countCustomers();
countItems();
countOrders();
getAllOrders();

function countCustomers(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                const customerCount = xhr.responseText;
                numberOfCustomers.text(customerCount);
            }else{
                showToast('error', 'Failed', 'Failed to count customers');
                console.log(xhr.responseText);
            }
        }
    });

    xhr.open('GET', 'http://localhost:8080/pos/api/v1/customers/count', true);
    xhr.send();
}
function countItems(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                const itemCount = xhr.responseText;
                numberOfItems.text(itemCount);
            }else{
                showToast('error', 'Failed', 'Failed to count items');
                console.log(xhr.responseText);
            }
        }
    });

    xhr.open('GET', 'http://localhost:8080/pos/api/v1/items/count', true);
    xhr.send();
}
function countOrders(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                const orderCount = xhr.responseText;
                numberOfOrders.text(orderCount);
            }else{
                showToast('error', 'Failed', 'Failed to count orders');
                console.log(xhr.responseText);
            }
        }
    });

    xhr.open('GET', 'http://localhost:8080/pos/api/v1/orders/count', true);
    xhr.send();
}

let xValues = ["", "", "", "", "", "", ""];
let yValues = [0, 0, 0, 0, 0, 0, 0];
let barColors = ["red", "green","blue","orange","brown","pink","gray"];

function getAllOrders(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                const orderList = JSON.parse(xhr.responseText);
                let j = 6;
                let a = orderList.length - 1;
                let i = orderList.length - 1;
                for (i; i >= 0;) {
                    let totalSaleOfaDay = +(orderList[i].orderTotal);
                    if (i > 0){
                        let latestDate = LocalDate.parse(((orderList[i].orderDate).toString().split(' '))[0]);
                        let previousDate = LocalDate.parse(((orderList[i-1].orderDate).toString().split(' '))[0]);
                        console.log(i);
                        while ((latestDate.year() === previousDate.year()) && (latestDate.month() === previousDate.month()) && (latestDate.dayOfMonth() === previousDate.dayOfMonth())){
                            totalSaleOfaDay += +(orderList[i-1].orderTotal);
                            i--;
                            latestDate = LocalDate.parse(((orderList[i].orderDate).toString().split(' '))[0]);
                            previousDate = LocalDate.parse(((orderList[i-1].orderDate).toString().split(' '))[0]);
                        }
                        console.log(yValues);
                        i--;
                    }
                    yValues[j] = +totalSaleOfaDay;
                    xValues[j] = ((orderList[i].orderDate).toString().split(' '))[0];
                    j--;
                    if (j < 0){
                        break;
                    }
                }
                new Chart("my-graph", {
                    type: "bar",
                    data: {
                        labels: xValues,
                        datasets: [{
                            backgroundColor: barColors,
                            data: yValues
                        }]
                    },
                    options: {
                        legend: {display: false},
                        title: {
                            display: true,
                        },
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Days'
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Total Sale (LKR)'
                                },
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                        responsive: true,
                        aspectRatio: 2.5,
                    }
                });
            }
            else{
                showToast('error', 'Failed', 'Failed to get orders');
                console.log(xhr.responseText);
            }
        }
    });

    xhr.open('GET', 'http://localhost:8080/pos/api/v1/orders', true);
    xhr.send();
}
