const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;
const JO = require("javascript-obfuscator");


let TARGET_DIR = null, FILTER_PATH = null, COMPILED_DIR = null, HTML_MINIFIER = null, JS_OBFUSCATOR = null;
try {
  const config = fs.readFileSync('config.json')
  const { target_dir, compiled_dir, filter_path, html_minifier_config, js_obfuscator_config } = JSON.parse(config)
  TARGET_DIR = target_dir;
  FILTER_PATH = filter_path;
  COMPILED_DIR = compiled_dir;
  HTML_MINIFIER = html_minifier_config;
  JS_OBFUSCATOR = js_obfuscator_config;

  clear_dir(COMPILED_DIR)
  setTimeout(function() {
    travel_dir(TARGET_DIR)
  }, 1000)
} catch (error) { console.log(error) }


function travel_dir(dir) {
  fs.readdirSync(dir, 'utf8').forEach(file => {
    const pathname = path.join(dir, file)
    const bIsHandle = FILTER_PATH.some(item => pathname.includes(item));
    if (!bIsHandle) {
      const stats = fs.statSync(pathname);
      if (stats.isDirectory()) travel_dir(pathname)
      else {
        try {
          if (pathname.endsWith('js')) obfuscator_Js(pathname)
          else compress_html_css(pathname)
        } catch (e) {
          console.error("压缩失败：" + pathname);
          console.error(e);
        }
      }
    } else {
      fs.copyFile(pathname, pathname.replace(TARGET_DIR, COMPILED_DIR), function (err) { })
    }
  })
}

function compress_html_css(path) {
  let sTargetPath = path.replace(TARGET_DIR, COMPILED_DIR),
    sCompressData = null, data = null;
  if (!path.includes('img') && !path.includes('fonts')) {
    data = fs.readFileSync(path, 'utf8')
    if (!path.endsWith('.min.css')) {
      sCompressData = minify(data, HTML_MINIFIER)
    }
  }
  let result = sCompressData ? sCompressData : data;
  write_file_recursive(path, sTargetPath, result, (err) => {
    if (err) console.error(err);
  })
}

function obfuscator_Js(path) {
  let sTargetPath = path.replace(TARGET_DIR, COMPILED_DIR), sObfuscateCode = null;
  let data = fs.readFileSync(path, 'utf8')
  if (!sTargetPath.endsWith('.min.js')) {
    sObfuscateCode = JO.obfuscate(data, JS_OBFUSCATOR);
  }
  let sResultCode = sObfuscateCode ? sObfuscateCode.getObfuscatedCode() : data;
  write_file_recursive(path, sTargetPath, sResultCode, (err) => {
    if (err) console.error(err);
  })
}

function write_file_recursive(sFromPath, sTargetPath, buffer, callback) {
  let lastPath = sTargetPath.substring(0, sTargetPath.lastIndexOf("\\"));
  fs.mkdir(lastPath, { recursive: true }, (err) => {
    if (err) return callback(err);
    else console.log('compress--[' + sTargetPath + ']--success');

    if (sTargetPath.includes('img') || sTargetPath.includes('fonts')) {
      let readStream = fs.createReadStream(sFromPath);
      let writeStream = fs.createWriteStream(sTargetPath);
      readStream.pipe(writeStream);
    } else {
      fs.writeFileSync(sTargetPath, buffer, function (err) {
        if (err) return callback(err);
      });
    }
  });
}

function clear_dir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) clear_dir(curPath)
      else fs.unlinkSync(curPath)
    });
    if(path != COMPILED_DIR) fs.rmdirSync(path);
  }
}