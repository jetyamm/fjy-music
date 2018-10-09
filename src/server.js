var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var express = require('express');
var app = express();
// 生成一个静态文件，服务器文件夹
app.use(express.static('www'));
var sql = require('./sql.js');
// 爬取网页结构
function getHTML(){
	return new Promise(function(resolve,reject){
		request('http://www.kugou.com/', function(error, response, body){
			resolve(body);
		})
	})
}
// 爬取歌单信息
function getRecord(body){
	return new Promise(function(resolve,reject){
		var $ = cheerio.load(body);
			$('.cptMid').each(function(i, e) {
				if(i<4){
//					console.log($(e).find('img').attr('_src'));
					request($(e).find('img').attr('_src')).pipe(fs.createWriteStream(`./www/img/${i}.jpg`));
					
					sql.query('insert into record set ?', [{
						title: $(e).text().trim().replace(/\s+/g, ' ').split(' ')[2],
						name: $(e).text().trim().replace(/\s+/g, ' ').split(' ')[3],
						audience: $(e).text().trim().replace(/\s+/g, ' ').split(' ')[0],
						imgUrl: `img/${i}.jpg`
					}], function(data) {
//						console.log(data);
					});
				}else{}
			})
		resolve(body);
	})
}

// 爬取最新歌曲
function getNewMusic(body){
	return new Promise(function(resolve,reject){
		var $ = cheerio.load(body);
		$('.tabC ul li').each((i,e)=>{
			var fileName = JSON.parse($(e).attr('data')).FileName;
			var hash = JSON.parse($(e).attr('data')).Hash;
			var time = JSON.parse($(e).attr('data')).time;
			var albumId = JSON.parse($(e).attr('data')).albumId;
			var timeLen = JSON.parse($(e).attr('data')).timeLen;
			
			request(`http://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${hash}&album_id=11029259&_=${albumId}`, function(error, response, bodyMs){
				sql.query('insert into newMusic set ?',[{
					hash,
					time,
					musicName: fileName,
					albumId,
					url: JSON.parse(bodyMs).data.play_url,
					lyr: JSON.parse(bodyMs).data.lyrics,
					img: JSON.parse(bodyMs).data.img
	//				timeLen
				}],function(data){});
				
			});
		})
	})
}
getHTML().then(getRecord);
getHTML().then(getNewMusic);
// 接受ajax请求返回响应头响应体（相关信息）
app.get('/getRecord',function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	sql.query('select * from record',[],function(data){
		res.send(data);
	})
});

app.get('/getNewMusic',function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	sql.query('select * from newMusic',[],function(data){
		res.send(data);
	})
});

app.listen(3002);
//app.listen(3001);