module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get invoice to populate in dropdown */
    function getInvoice(res, mysql, context, complete){
        mysql.pool.query("SELECT invoice_number FROM invoices", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.invoice = results;
            complete();
        });
    }


    /* get services to populate in dropdown */
    function getService(res, mysql, context, complete){
        sql = "SELECT service_id, service_name FROM services";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.services = results
            complete();
        });
    }

    /* get invoice with its services  */
    function getIvoiceNumberWithService(res, mysql, context, complete){
        sql = "SELECT invoices.invoice_number, services.service_id, service_name FROM invoices INNER JOIN jobs on invoices.invoice_number = jobs.invoice_number INNER JOIN services on services.service_id = jobs.service_id ORDER BY invoice_number"
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.invoice_with_service = results
            complete();
        });
    }


    /* List invoice with service along with
     * displaying a form to associate a invoice with multiple services
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete_item.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'job'

        getInvoice(res, mysql, context, complete);
        getService(res, mysql, context, complete);
        getIvoiceNumberWithService(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate services with an invoice and
     * then redirect to the job page after adding
     */
    router.post('/', function(req, res){
        //console.log("We get the multi-select services dropdown as ", req.body.servs)
        var mysql = req.app.get('mysql');
        var services = req.body.servs
        var invoice = req.body.invoice_number
        for (let service of services) {
          var sql = "INSERT INTO jobs (invoice_number, service_id) VALUES (?,?)";
          var inserts = [invoice, service];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
            }
          });
        } //for loop ends here
        res.redirect('/job');
    });

    /* Delete invoice's services record */
    router.delete('/invoice_number/:invoice_number/service/:service_id', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log(req.params.invoice_number)
        console.log(req.params.service_id)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM jobs WHERE invoice_number = ? AND service_id = ?";
        var inserts = [req.params.invoice_number, req.params.service_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
