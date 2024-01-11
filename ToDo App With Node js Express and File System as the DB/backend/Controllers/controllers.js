const fs = require('fs');
const DBPath = `./database/DB.json`;
// 
// THIS CAN BE TAKEN TO MORE AVANCED AND SECURE WAY.
const todoList = (req, res) => {
    fs.readFile(DBPath, (error, response) => {
        const data = response.toString();
        res.send(data)
    })
}
// 
const todoAdd = (req, res) => {
    const newToDo = req.body;
    const { id, text, timestamp } = newToDo;
    if (text != `` && text.length > 0) {
        fs.readFile(DBPath, (error, response) => {
            let todos = JSON.parse(response.toString());
            todos[0][id] = newToDo;
            todos = JSON.stringify(todos)
            // save
            fs.writeFile(DBPath, todos, (data) => {
                const response = {
                    status: true,
                    statusCode: 200,
                    data: newToDo
                }
                res.send(response);
            });
        })
    }
}
// 
const todoDelete = (req, res) => {
    const id = req.params.id;
    fs.readFile(DBPath, (error, response) => {
        let todos = JSON.parse(response.toString());
        const deleted = todos[0][id];
        delete todos[0][id];
        todos = JSON.stringify(todos)
        // save
        fs.writeFile(DBPath, todos, (data) => {
            const response = {
                status: true,
                statusCode: 200,
                data: deleted
            }
            res.send(response);
        });
    })
}
// 
const todoUpdate = (req, res) => {
    const id = req.params.id;
    const edited = req.body;
    if (id == edited.id) {
        // 
        fs.readFile(DBPath, (error, response) => {
            let todos = JSON.parse(response.toString());
            todos[0][id] = edited;
            todos = JSON.stringify(todos)
            // save
            fs.writeFile(DBPath, todos, (data) => {
                const response = {
                    status: true,
                    statusCode: 200,
                    data: edited
                }
                res.send(response);
            });
        })
    }
}
// 
module.exports = {
    todoList,
    todoAdd,
    todoDelete,
    todoUpdate
}