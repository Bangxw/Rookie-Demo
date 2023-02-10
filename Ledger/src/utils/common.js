export const generate_guid = () => {
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
export const map_list_insert_key = (list) => {
  if (Array.isArray(list)) {
    return list.map((i) => {
      const key = i._id || generate_guid();
      delete i._id;
      console.log(key);
      return {
        ...i,
        key,
      };
    });
  } return [];
};


// 改进版fetch, 支持timeout
export async function fetch_plus(resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(timer);
  return response;
}