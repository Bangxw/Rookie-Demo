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

// 来自源数据mongodb默认生成的_id替换为key，
// 1. react组件循环渲染就不用再手动添加key
// 2. eslint no-underscore-dangle， eslint也不建议这种命名格式
function map_list_insert_key(list) {
  if (Array.isArray(list)) {
    return list.map(i => {
      let key = i._id || generate_guid();
      delete i._id;
      console.log(key)
      return {
        ...i,
        key,
      }
    })
  } else return []
}

function calcu_char_code(str) {
  var sum = 0;
  for (let c of str) { sum += c.charCodeAt(0) }
  return sum;
}

export {
  map_list_insert_key, generate_guid, calcu_char_code,
}