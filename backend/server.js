const app = require("express")()
const fs = require("fs")

app.get("/data", (req, res) => {
    res.send(fs.readFileSync('./data.json'));
})


app.listen(8082)