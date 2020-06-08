function deleteEmployee(id){
    $.ajax({
        url: '/employee/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteWorkOrder(id){
    $.ajax({
        url: '/schedule/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteInvoice(id){
    $.ajax({
        url: '/invoice/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCustomer(id){
    $.ajax({
        url: '/customer/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteService(id){
    $.ajax({
        url: '/service/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePayment(id){
    $.ajax({
        url: '/payment/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteInvoiceService(invoice_number, service_id){
  $.ajax({
      url: '/job/invoice_number/' + invoice_number + '/service/' + service_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          }
      }
  })
};
