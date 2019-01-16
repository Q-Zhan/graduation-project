
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');

const routerCollection = require('./route/index.js');
const GLOBAL_CONSTANT = require('./constant/global');
const tokenVerify = require('./util/tokenVerify');
const socket = require('./util/socket');

var app = express();

// 初始化socket
socket.init(app);

// 设置允许跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  next();
});

// 接口禁止缓存
app.disable('etag');

// 解析请求参数
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
	extended: false,
}));
// 解析cookie
app.use(cookieParser());

// 验证token
app.use(tokenVerify);

// 引入路由表
routerCollection(app);

// 监听路由请求
var server = app.listen(8081, function () {
  console.log('监听express端口：8081');
})