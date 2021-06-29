let bodyParser = require('body-parser')
let express = require("express")
let app = express()
let router = require("./routes/routes")
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/", router);

app.listen(8686,() => {
    console.log("Servidor rodando")
});
