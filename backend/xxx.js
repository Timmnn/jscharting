const fs = require('fs');

let data = JSON.parse(fs.readFileSync("./xxx.json"))
let new_data = {
    "ohlcv": []
}

for (let line of data.ohlcv) {
    new_data.ohlcv.push(
        {
            "time": line[0],
            "ohlcv": [line[1], line[2], line[3], line[4], line[5]]
        }
    )
}


fs.writeFileSync("yyy.json", JSON.stringify(new_data))