function generate_guid() {
  /* eslint-disable */
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

function map_list_insert_key(list) {
  if (Array.isArray(list)) list.map(i => i.key = i._id || generate_guid())
  return list
}


Date.prototype.Format = function (fmt) {
  const week_strings = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length));
  if (/(w+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, week_strings[this.getDay()]);
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
 * @description: 日期格式转换
 * @param  {*}
 * @return {*}
 * @param {*} date new Date()参数:
 * new Date();无
 * new Date(value);Unix时间戳：1652054400000
 * new Date(dateString);时间戳字符串：'2020-05-09'
 * new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);分别提供日期与时间的每一个成员
 * @param {*} type 日期格式(英文按示例用，区分字母大小写) e.g "yyyy年MM月dd日 HH:mm:ss"
 */
function get_format_date(date, type) {
  let curDate = date || new Date()
  let newDate = new Date(curDate).Format(type)
  return newDate
}

/**
 * @description: 获取n年前指定日期
 * @param {*} n
 * @return {*} Unix Time Stamp e.g: 1652054400000
 */
function get_year_ago_date(n = 0) {
  let curDate = new Date()
  curDate.setFullYear(curDate.getFullYear() - n)
  const ts = + curDate
  return ts
}

/**
 * @description: 获取n月前指定日期
 * @param {*} n
 * @return {*} Unix Time Stamp e.g: 1652054400000
 */
function get_month_ago_date(n = 0) {
  let curDate = new Date()
  curDate.setMonth(curDate.getMonth() - n)
  const ts = + curDate
  return ts
}

/**
 * @description: 获取n天前指定日期
 * @param {*} n
 * @return {*} Unix Time Stamp e.g: 1652054400000
 */
function get_day_ago_date(n = 0) {
  let curDate = new Date();
  let newDate = new Date(curDate - 1000 * 60 * 60 * 24 * n);
  const ts = + newDate
  return ts
}


export {
  map_list_insert_key, generate_guid,
  get_format_date, get_year_ago_date, get_month_ago_date, get_day_ago_date
}