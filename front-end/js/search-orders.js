import {showProgress, showToast} from "./main.js";

const tbodyElm = $("#tbl-search-orders tbody");

tbodyElm.empty();

function getAllOrders(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange',() => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                tbodyElm.empty();
                const orderList = JSON.parse(xhr.responseText);
                orderList.forEach(order => {
                    tbodyElm.append(`
                    <tr>
                        <td class="contact text-center">${order.orderId}</td>
                        <td class="contact text-center">${order.orderDate}</td>
                        <td class="contact text-center">${order.customerId}</td>
                        <td class="contact text-center">${order.customerName}</td>
                        <td class="contact text-center">${order.orderTotal}</td>
                    </tr>
                `);
                });
                if (!orderList.length){
                    $('#tbl-search-orders tfoot').show();
                }
                else {
                    $('#tbl-search-orders tfoot').hide();
                }
            }
            else{
                tbodyElm.empty();
                $('#tbl-search-orders tfoot').show();
                showToast('error','Failed','Failed to fetch orders');
                console.log(JSON.parse(xhr.responseText));
            }
        }
    });
    const  searchText = $('#txt-search').val().trim();
    const  query = (searchText) ? `?q=${searchText}` : "";
    xhr.open('GET','http://localhost:8080/pos/api/v1/orders' + query,true);

    const tFoot = $('#tbl-search-orders tfoot tr td:first-child');
    xhr.addEventListener('loadstart',() => {
        tFoot.text('Please wait');
    });
    xhr.addEventListener('loadend',() => {
        tFoot.text('No order records are found!');
    });
    xhr.send();
}
getAllOrders();