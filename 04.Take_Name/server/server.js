//node.js读取数据
const http = require("http")
const url = require("url")
const fs = require("fs")

const database = {};
(function () {
  database.libsAChar = JSON.parse(fs.readFileSync("data/libsA/word.json"))   // 16142
  // database.commonChar = JSON.parse(fs.readFileSync("data/libsB/character/char_common.json"))   // 3500
})();


function append_file(content) {
  fs.appendFile('data/word-index.database', content, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}


function get_words(stroke) {
  let data = {
    index: [],
    words: []
  }

  while (data.words.length < 2) {
    let index = Math.floor(Math.random() * 3500)
    let word = commonChar[index]

    // if (word.strokes < stroke) {
    data.words.push(word)
    data.index.push(index)
    // }
  }

  return data
}


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

        const { number } = JSON.parse(data)


        const options = {
          number: 10,
          stroke: 10,
          nameTemp: '***'
        }

        const groupWordsIndex = []
        let libs = Array(number || 6).fill(null).map(() => {
          var res = get_words({
            maxStroke: 15
          })
          groupWordsIndex.push(res.indexs)

          return res.words
        })

        append_file(groupWordsIndex.join(';') + '\r\n')

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 1, message: 'Add success', list: libs }));
      })
    }
  } else if (methods == "OPTIONS") {
    res.writeHead(200)
    res.end('OPTIONS Success!!!')
  }
})


server.listen(8800, function () {
  console.log('server listen at http://127.0.0.1:8800')
})