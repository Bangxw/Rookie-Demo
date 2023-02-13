// 导入fs模块
const fs = require('fs')
const axios = require('axios').default;

module.exports = {
  exportLedgerList: function () {
    axios.get('http://127.0.0.1:8800/ledger/sub_types', 'http://127.0.0.1:8800/ledger/bill_list')
      .then(function (response) {
        const subtypes = response.data.data

        axios.get('http://127.0.0.1:8800/ledger/bill_list')
          .then(function (response) {
            let data = response.data.data.sort((a, b) => b.date - a.date).map(item => {
              let _date = new Date(item.date)
              _date = `${_date.getFullYear()}.${_date.getMonth() + 1}.${_date.getDate()}`

              let _payway = item.payway.replace(/Alipay/, '支付宝')
                .replace(/WeChat_pay/, '微信')
                .replace(/Credit_Card/, '信用卡')

              let _subtype = subtypes.find(_ => _._id === item.subtype_id).text

              return `${_date} ${_payway} ${_subtype} ${item.amount} \n`
            })

            // 调用fs.writeFile()方法
            // fs.writeFile("./export.txt", data.join(''), function (err) {
            //   if (err) {
            //     return console.log('文件写入失败！' + err.message)
            //   }
            //   console.log('文件写入成功！')
            // })
          })
      })
  }
}