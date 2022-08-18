//node.js读取数据
const http = require("http")
const url = require("url")
const queryString = require("querystring")
const fs = require("fs")

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type'); //可以支持的消息首部列表
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS'); //可以支持的提交方式
  res.setHeader('Content-Type', 'application/json;charset=utf-8'); //响应头中定义的类型

  let methods = req.method
  let params = url.parse(req.url, true, true);

  console.log("⏳", new Date(), params.pathname, methods);

  if (methods == "POST") {
    let data = ""
    req.on("data", (chunk) => {
      data += chunk;
    })
    if (params.pathname == "/api/list") {
      req.on("end", () => {
        const { number } = queryString.parse(data)

        // rawdata length => 26129191
        let rawdata = fs.readFileSync("data/ci.json")
        let data1 = JSON.parse(rawdata)

        var libs = Array(number || 6).fill(null)
        libs = libs.map(() => data1[Math.floor(Math.random() * 26129191)])

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 1, message: 'Add success', list: JSON.parse(libs) }));
      })
    }
  } else if (methods == "OPTIONS") {
    res.writeHead(200)
    res.end('OPTIONS Success!!!')
  }
})

server.listen(3288, function () {
  console.log('server listen at http://127.0.0.1:3288')
})