"use strict";

class Mapa
{
	constructor(w,h,img,regioes)
	{
		this.x = 0;
		this.y = 0;
		this.width = w;
		this.height = h;
		this.img = img;
		this.regioes = regioes;
		this.n_props = 2;
		this.size = [w,h];

		this.difficulty = 1/10;

		this.imgData = this.getImageData(this.regioes);
	}

	getImageData(img){
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, this.width, this.height);
		return ctx.getImageData(0,0, this.width, this.height);
	}
}

class Sprite
{
	constructor(x,y,w,h, tamanho, linhas, colunas, clickable, img)
	{
		this.x = x;
		this.y = y;
		this.width = w/colunas;
		this.height = h/linhas;
		this.img = img;

		this.linhas = linhas;
		this.colunas = colunas;

		this.sprite_w = w;
		this.sprite_h = h;
		this.sprite = [0,0];
		if(tamanho==0){
			this.size=[this.width,this.height]
		}else{
			this.size = [tamanho,tamanho];
		}

		//rato
		this.clickableIni = clickable;
		this.clickable = clickable;

		this.imgData = this.getImageData(this.img);

		this.percent = 0;
	}

	draw(ctx)
	{
		ctx.drawImage(this.img, this.sprite[0] * this.width, this.sprite[1] * this.height, this.width, this.height, this.x, this.y, this.size[0], this.size[1]);
	}


	clear(ctx)
	{
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}	


	reset(ev, ctx)
	{
		this.clear(ctx);
		this.x = this.xIni;
		this.y = this.yIni;
		this.clickable = this.clickableIni;
	}
	
	getImageData(img){
		var canvas = document.createElement("canvas");
		canvas.width = this.size[0];
		canvas.height = this.size[1];

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.size[0], this.size[1]);
		return ctx.getImageData(0,0, this.size[0], this.size[0]);
	}

	mouseOverBoundingBox(ev) //ev.target é a canvas
	{
		var mx = ev.offsetX;  //mx, my = mouseX, mouseY na canvas
		var my = ev.offsetY;

		if (mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height)
			return true;
		else
			return false;
	}


	clickedImage(ev)
	{
		if (!this.clickable)
			return false;
		if (!this.mouseOverBoundingBox(ev))
			return false;
		var imgData=this.imgData;

		var xlocal = Math.round(ev.offsetX - this.x);//posicao na canvas invisível
		var ylocal = Math.round(ev.offsetY - this.y);

		var pixelNum = xlocal + ylocal * this.width;
		var pixelPosArray = pixelNum * 4 + 3;

		if (imgData.data[pixelPosArray]){
			return true;
		}
	}


	clickedBoundingBox(ev) //ev.target é a canvas
	{
		if (!this.clickable)
			return false;
		else
			return this.mouseOverBoundingBox(ev);
	}

	intersectsPixelCheck(s2){
		return Sprite.intersectsPixelCheck(this, s2);
	}

	static intersectsPixelCheck(s1,s2){

		if (Sprite.intersectsBoundingBox(s1, s2)) {//ver qual o nome da funcao

			var xMin = Math.max(s1.x, s2.x);
			var xMax = Math.min(s1.x + s1.size[0], s2.x + s2.size[0]);
			var yMin = Math.max(s1.y, s2.y);
			var yMax = Math.min(s1.y + s1.size[1], s2.y + s2.size[1]);

			var xlocal, ylocal, pixelNum, pixelPosArrayS1, pixelPosArrayS2;

			var s1ImgData = s1.imgData;
			var s2ImgData = s2.imgData;

			for (let i = xMin; i < xMax; i++)
				for (let j = yMin; j < yMax; j++)
				{
					//S1
					xlocal = Math.round(i - s1.x);//posicao na canvas invisível
					ylocal = Math.round(j - s1.y);

					pixelNum = xlocal + ylocal * s1.size[0];
					pixelPosArrayS1 = pixelNum * 4 + 3;

					//S2
					xlocal = Math.round(i - s2.x);//posicao na canvas invisível
					ylocal = Math.round(j - s2.y);

					pixelNum = xlocal + ylocal * s2.size[0];
					pixelPosArrayS2 = pixelNum * 4 + 3;

					if (s1ImgData.data[pixelPosArrayS1] && s2ImgData.data[pixelPosArrayS2])
					{
						return true;
					}
				}
		}
		return false;
	}

	static intersectsBoundingBox(s1,s2){
		var x1 = s1.x;
		var y1 = s1.y;
		var w1 = s1.size[0];
		var h1 = s1.size[1];

		var x2 = s2.x;
		var y2 = s2.y;
		var w2 = s2.size[0];
		var h2 = s2.size[1];

		if ((x1>x2+w2)||(x2>x1+w1))
		{
			return 0
		}
		else if ((y1>y2+h2)||(y2>y1+h1))
		{
			return 0
		}
		else
		{
			return 1
		}
	}

	mouseOverPixel(ev){
		if (!this.mouseOverBoundingBox(ev))
			return false;
		var imgData=this.imgData;

		var xlocal = Math.round(ev.offsetX - this.x);//posicao na canvas invisível
		var ylocal = Math.round(ev.offsetY - this.y);

		var pixelNum = xlocal + ylocal * this.width;
		var pixelPosArray = pixelNum * 4 + 3;

		if (imgData.data[pixelPosArray]){
			return true;
		}
	}

	getRandomCoord(ctx, map){
		this.x = Math.floor(Math.random() * ctx.canvas.width) + 5;
		this.y = Math.floor(Math.random() * ctx.canvas.height) + 5;

		this.sprite=[Math.floor(Math.random() * (this.linhas)),Math.floor(Math.random() * (this.colunas))];
		var percent = this.sprite[0] + this.sprite[1] * this.linhas;
		this.percent = 100-(percent*25 + Math.floor(Math.random() *25));


		while(this.intersectsPixelCheck(map)){
			this.x = Math.floor(Math.random() * (ctx.canvas.width-10)) + 10;
			this.y = Math.floor(Math.random() * (ctx.canvas.height-10)) + 10;
		}
	}
}

class Placas
{
	constructor(x,y,w,h, clickable, img)
	{
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.img = img;

		//rato
		this.clickableIni = clickable;
		this.clickable = clickable;

		this.imgData = this.getImageData(this.img);
	}

	draw(ctx)
	{
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}


	clear(ctx)
	{
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}	

	getImageData(img){
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, this.width, this.height);
		return ctx.getImageData(0,0, this.width, this.height);
	}

	mouseOverBoundingBox(ev) //ev.target é a canvas
	{
		var mx = ev.offsetX;  //mx, my = mouseX, mouseY na canvas
		var my = ev.offsetY;

		if (mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height)
			return true;
		else
			return false;
	}
	
	clickedImage(ev)
	{
		if (!this.clickable)
			return false;
		if (!this.mouseOverBoundingBox(ev))
			return false;
		var imgData=this.imgData;

		var xlocal = Math.round(ev.offsetX - this.x);//posicao na canvas invisível
		var ylocal = Math.round(ev.offsetY - this.y);

		var pixelNum = xlocal + ylocal * this.width;
		var pixelPosArray = pixelNum * 4 + 3;

		if (imgData.data[pixelPosArray]){
			return true;
		}
	}
}