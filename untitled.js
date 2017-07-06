// const dgram = require('dgram');
// const server = dgram.createSocket('udp4');
// server.on('error', (err) => {
// 	console.log(`服务器异常：\n${err.stack}`);
// 	server.close();
// });
// server.on('message', (msg,rinfo) => {
// 	console.log(`服务器收到：${msg} 来自 ${rinfo.address}:${rinfo.port}`);
// });
// server.on('listening', () => {
// 	var address = server.address();
// 	console.log(`服务器监听 ${address.address}:${address.port}`);
// });
// server.bind(41234);
// server.close();
const dgram = require('dgram');
var client = dgram.createSocket('udp4');
client.bind(41239,'localhost');
var buf = Buffer.from('你好');
client.send(buf,0,buf.length,41234,'192.168.1.100');
client.on('message', function(msg, rinfo) {
	console.log('已接收到服务器发送的数据：%s',msg);
});