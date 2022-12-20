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

function calcu_char_code(str) {
  var sum = 0;
  for (let c of str) { sum += c.charCodeAt(0) }
  return sum;
}

export {
  map_list_insert_key, generate_guid, calcu_char_code,
}