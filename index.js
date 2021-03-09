const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Bihar&appid=3da48b192d83916c6930ff9bce61bad5")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
           // console.log(arrdata[0].main.temp);
           const realTimeData = arrdata
           .map((val) => replaceVal(homeFile, val))
           .join("");
            res.write(realTimeData);
          // console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to errors", err);
            res.end();
           // console.log("end");
        });

    }
    else {
        res.end("File not found");
    }

});

server.listen(8000, "127.0.0.1");