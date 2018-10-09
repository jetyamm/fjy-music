$(function(){
	// 请求歌单
	$.ajax({
		type:"get",
		url:"http://localhost:3002/getRecord",
		async:true,
		success: function(data){
//			console.log(data);
			var content = data.map((item,idex)=>{
				return `
						<li style="flex:1;font-size:0.8rem;"><a href="#"><div style="background: url('./img/${idex}.jpg') no-repeat; width: 6.6rem;height: 6.15rem;margin-left: 0.75rem"><p style="color:#fff;float:right;"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-erji"></use></svg>${item.audience}</p></div><p style="color:#000;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;overflow: hidden;">${item.title}</p></a></li>
						`
			});
			$('.getRecord').html(content);
		}
	});
	
	// 请求最新音乐
	$.ajax({
		type:"get",
		url:"http://localhost:3002/getNewMusic",
		async:true,
		success: function(data){
			var msContent = data.map((item,idex)=>{
				var singerName = item.musicName.split('-')[0].trim();
				var musicName = item.musicName.split('-')[1].trim();
				var lyr = item.lyr;
				var img = item.img;
//				console.log(singerName,musicName);
				return `
						<li style="margin: 0 0.5rem;color:#000000;font-size: 0.9rem;padding: 1.5rem 0;border-bottom: 0.05rem solid #ccc;"><a href="#" data-src="${item.url}" data-singer="${singerName}" data-musicName="${musicName}" data-img="${img}" data-lyr="${lyr}">${item.musicName}<svg class="icon fr" aria-hidden="true" style="padding-top: 0.2rem;color:red;"><use xlink:href="#icon-tubiaozhizuomoban" ></use></svg><span class="fr" style="margin-right: 0.5rem;"> ${item.time} </span></a></li>
				`
			});
			$('.newMusic').html(msContent);
			
			
			
		}
	});
	
	
	$('.newMusic').on('click','a',function(){
//				this.href = $(this).attr('data-src');
//				console.log($(this).attr('data-src'));
				Cookie.set('mp3',$(this).attr('data-src'),{});
				
				Cookie.set('singerName',$(this).attr('data-singer'),{});
				Cookie.set('musicName',$(this).attr('data-musicName'),{});
				Cookie.set('img',$(this).attr('data-img'),{});
				Cookie.set('lyr',$(this).attr('data-lyr'),{});
				location = `html/player.html`;

				
			});
})

//http://www.kugou.com/song/#hash=${item.hash}&album_id=${item.albumId}
