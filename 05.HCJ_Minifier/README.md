# Readme

> 可以用来压缩混淆原始的html/css/javascript前端项目

## 配置

1. target_dir：目标目录
2. compiled_dir：压缩后的目录
3. filter_path：不用压缩的文件列表
4. html_minifier_config: html/css等文件压缩配置（[详见html-minifier#options-quick-reference](https://www.npmjs.com/package/html-minifier#options-quick-reference)）
    - "collapseWhitespace": true,
    - "removeAttributeQuotes": true, 
    - "removeComments": true, 
    - "removeCommentsFromCDATA": true, 
    - "minifyCSS": true,  // 压缩css
    - "minifyJS": true  // 压缩Javascript
    - ...

## 环境

- nodejs: 18.10.0可以正常运行，其它版本未验证

## 运行

```
npm run build
```