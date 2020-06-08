function searchEmployeeByFirstName() {
    //get the first name
    var first_name_search_string  = document.getElementById('first_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/employee/search/' + encodeURI(first_name_search_string)
}

function searchWorkOrderByCustomerId() {
    //get the first name
    var work_order_search_customer_id  = document.getElementById('work_order_search_customer_id').value
    //construct the URL and redirect to it
    window.location = '/schedule/search/' + encodeURI(work_order_search_customer_id)
}

function searchServiceByName() {
    //get the first name
    var service_search_name  = document.getElementById('service_search_name').value
    //construct the URL and redirect to it
    window.location = '/service/search/' + encodeURI(service_search_name)
}

function searchPaymentById() {
    //get the first name
    var payment_search_id  = document.getElementById('payment_search_id').value
    //construct the URL and redirect to it
    window.location = '/payment/search/' + encodeURI(payment_search_id)
}

function searchCustomerByFirstName() {
    //get the first name
    var customer_search_first_name  = document.getElementById('customer_search_first_name').value
    //construct the URL and redirect to it
    window.location = '/customer/search/' + encodeURI(customer_search_first_name)
}

function searchInvoiceByNumber() {
    //get the first name
    var invoice_search_number  = document.getElementById('invoice_search_number').value
    //construct the URL and redirect to it
    window.location = '/invoice/search/' + encodeURI(invoice_search_number)
}
