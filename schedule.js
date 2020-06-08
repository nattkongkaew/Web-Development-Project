module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //query database from work_orders table
    function getSchedule(res, mysql, context, complete){
        mysql.pool.query("SELECT work_orders.work_order_number as id, call_reason, date, arrival_windows_1, arrival_windows_2, status, work_orders.customer_id FROM work_orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.schedule = results;
            complete();
        });
    }

    //get specific work_order to use for update
    function getUpdate(res, mysql, context, id, complete){
            var sql = "SELECT work_order_number as id, call_reason, date, arrival_windows_1, arrival_windows_2, status, customer_id FROM work_orders WHERE work_order_number = ?";
            var inserts = [id];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.item = results[0];
                complete();
            });
        }

        //query to get service by customer ID
        function getServiceByCustomerName(req, res, mysql, context, complete) {
           var query = "SELECT work_orders.work_order_number as id, call_reason, date, arrival_windows_1, arrival_windows_2, status, work_orders.customer_id FROM work_orders WHERE work_orders.customer_id LIKE " + mysql.pool.escape(req.params.s + '%');
          //console.log(query)

          mysql.pool.query(query, function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.schedule = results;
                complete();
            });
        }


    //display all work order
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["search_item.js", "delete_item.js"];
        var mysql = req.app.get('mysql');
        getSchedule(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('schedule', context);
            }

        }
    });


    //Search work order by customer id
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["search_item.js"];
        context.css = ["styles.css"]
        var mysql = req.app.get('mysql');
        getServiceByCustomerName(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('schedule', context);
            }
        }
    });

    //add work order
    router.post('/', function(req, res){
        //console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO work_orders (call_reason, date, arrival_windows_1, arrival_windows_2, status, customer_id) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.call_reason, req.body.date, req.body.arrival_windows_1, req.body.arrival_windows_2, req.body.status, req.body.customer_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/schedule');
            }
        });
    });

        //display one work order for update
        router.get('/:id', function(req, res){
          callbackCount = 0;
          var context = {};
          context.jsscripts = ["update_item.js"];
          context.css = ["styles.css"]
          var mysql = req.app.get('mysql');
          getUpdate(res, mysql, context, req.params.id, complete);
          function complete(){
              callbackCount++;
              if(callbackCount >= 1){
                  res.render('update-schedule', context);
              }

          }
      });

        //update work order
        router.put('/:id', function(req, res){
            var mysql = req.app.get('mysql');
            //console.log(req.body)
            //console.log(req.params.id)
            var sql = "UPDATE work_orders SET call_reason=?, date=?, arrival_windows_1=?, arrival_windows_2=?, status=?, customer_id=? WHERE work_order_number=?";
            var inserts = [req.body.call_reason, req.body.date, req.body.arrival_windows_1, req.body.arrival_windows_2, req.body.status,req.body.customer_id, req.params.id];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.status(200);
                    res.end();
                }
            });
        });

        //delete work order using Ajax
        router.delete('/:id', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM work_orders WHERE work_order_number = ?";
            var inserts = [req.params.id];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    console.log(error)
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
