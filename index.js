const mysql = require('mysql');

const express = require('express');

var app = express();

const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employeesdb',
    multipleStatements:true

});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(5000, () => console.log('Express server is runnig in 5000'));




                      //request,response
app.get('/employees', (req, res) => {  //get all employees
    mysqlConnection.query('select * from employees', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});




app.get('/employees/:id',(req,res)=>{  //get specific employee: id -->1
                                                                     
    mysqlConnection.query(' select * from employees where EmpID =?',[req.params.id],
    (err,rows,fields)=>{
        if(!err)
           res.send(rows);
        else
           console.log(err);
    }

    )
});




//delete specific employee: id -->1

app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('delete from employees where EmpID =?', [req.params.id],
    (err, rows, fields) => {
        if (!err)
            res.send('successfully Deleted.');
        else
            console.log(err);
    })
});




// insert employee

app.post('/employees', (req, res) => {
    let emp = req.body;

    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";

    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted Sucessfully. Employee ID: '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});




//update an employee

app.put('/employees', (req, res) => {  
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
}

);

