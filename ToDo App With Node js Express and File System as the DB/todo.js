const express = require('express')
const app = express();
const todoRouter = require(`./backend/Routes/todoRoutes`)
// 
app.use(express.json());
app.use(express.static(`frontend`));
// app.use(express.urlencoded({ extended: true }))
// 
app.get(`/`, (req, res) => {
    res.sendFile(`./frontend/index.html`, {
        root: __dirname
    })
})
// 
app.use(`/todos/`,todoRouter)
// 
const port = process.env.PORT || 7700;
app.listen(port, () => {
    console.log(`Listening on port: ${port}.`)
})