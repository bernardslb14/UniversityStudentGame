"use strict";

const audioVolume = 1;
var pause = 0;
var pauseTime = 0;
var game_won = 0;
var pauseInit;
var game_time;
var final_time=0;
var current_lvl=1;
var player_name;

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var path = window.location.pathname;
	var page = path.split("/").pop();
	current_lvl = Number(page.charAt(5));

	if(current_lvl!=1){
		final_time = window.parent.final_time;
	}

	player_name=window.parent.player_name;
	console.log(player_name);

	var mainW; //NEW
	var mainMsg = function (ev){
		mainW = ev.source;
	}
	window.addEventListener("message", mainMsg);//Escuta uma mensagem da main

	var next_section = function(ev){
		proximo(ev, mainW);
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	canvas.addEventListener("playgame", next_section); //NEW

	var player; //Player Sprite
	var props; //Array de props
	var mapa; //Regioes de Colisoes
	var spArray;
	var spHelp;

	canvas.addEventListener("initend", initEndHandler); //Acionado apenas dps dos componentes carregarem
	init(ctx);

	//som
	var audio=document.getElementsByTagName("audio")[0];
	audio.play();

	//Funcoes locais para gestao de eventos
	function initEndHandler(ev)
	{
		//Listener do teclado
		window.addEventListener("keydown", kdh);
		window.addEventListener("keyup", kuh);

		ctx.canvas.addEventListener("click", cch);

		player = ev.player;
		props = ev.props;
		mapa = ev.mapa;
		spHelp = ev.spHelp;

		spArray = new Array(1+mapa.n_props);
		spArray[0]=player;
		for(let i=1;i<=mapa.n_props; i++){
			props[i-1].getRandomCoord(ctx, mapa);
			spArray[i]=props[i-1];
		}

		//Iniciar animacao
		startAnim(ctx, spArray, mapa, spHelp);
	}

	//Handlers
	var kdh = function(ev)
	{
		keyDownHandler(ev, spArray);
	}

	var kuh = function(ev)
	{
		keyUpHandler(ev, spArray);
	}
	var cch = function(ev)
	{
		canvasClickHandler(ev, ctx, spHelp, audio);	
	}
}

//init: Carregamento de componentes
function init(ctx)
{
	var nLoad = 0;
	var tLoad = 8;
	var player;
	var mapa;
	var props;
	var spHelp = new Array(5);

	//Estilo de texto para o timer
	ctx.fillStyle = "#993333";
	ctx.font = "14px helvetica";
	ctx.textBaseline = "bottom";
	ctx.textAlign = "center";

	//Carrega a personagem do jogador
	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id = "player";
	img.src = "../resources/nivel1/Main_SpriteSheet.png";

	switch (current_lvl)
	{
		case 1:
			//Carrega o mapa de colisoes do background
			var img2 = new Image();
			img2.addEventListener("load", imgLoadedHandler);
			img2.id = "colisoes";
			img2.src = "../resources/nivel1/Colision_LVL1.png";
			break;
		case 2:
		//Carrega o mapa de colisoes do background
			var img2 = new Image();
			img2.addEventListener("load", imgLoadedHandler);
			img2.id = "colisoes";
			img2.src = "../resources/nivel1/Colision_LVL2.png";
			break;
		case 3:
		//Carrega o mapa de colisoes do background
			var img2 = new Image();
			img2.addEventListener("load", imgLoadedHandler);
			img2.id = "colisoes";
			img2.src = "../resources/nivel1/Colision_LVL3.png";
			break;
	}

	//HELP
	//5 Sprites
	var img3 = new Image();
	img3.addEventListener("load", imgLoadedHandler);
	img3.id="help";
	img3.src = "../resources/menu/DODGE_HELP.png";  //dá ordem de carregamento da imagem

	var img4 = new Image(); 
	img4.addEventListener("load", imgLoadedHandler);
	img4.id="som";
	img4.src = "../resources/menu/DODGE_SOM.png";  //dá ordem de carregamento da imagem

	var img5 = new Image();
	img5.addEventListener("load", imgLoadedHandler);
	img5.id="less";
	img5.src = "../resources/menu/DODGE_LESS.png";  //dá ordem de carregamento da imagem

	var img6 = new Image();
	img6.addEventListener("load", imgLoadedHandler);
	img6.id="more";
	img6.src = "../resources/menu/DODGE_MORE.png";  //dá ordem de carregamento da imagem

	var img7 = new Image();
	img7.addEventListener("load", imgLoadedHandler);
	img7.id="mute";
	img7.src = "../resources/menu/DODGE_MUTE.png";  //dá ordem de carregamento da imagem


	function imgLoadedHandler(ev)
	{
		var img = ev.target;
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		var sp;

		switch (img.id)
		{
			case "player":
				var sp1 = new Sprite(1000, 0, nw, nh,200,6,5, false, img);
				sp1.speed = 2;
				sp1.movement = [];
				player = sp1;
				break;

			case "colisoes":
				var map = new Mapa(nw,nh,NaN, img);
				mapa = map;
				props = new Array(mapa.n_props);
				tLoad = 8 + (mapa.n_props);

				switch (current_lvl)
				{
					case 1:
						//Carrega os props
						var img2 = new Image();
						img2.addEventListener("load", imgLoadedHandler);
						img2.id = "props";
						img2.src = "../resources/nivel1/Props_LVL1.png";
						break;
					case 2:
					//Carrega os props
						var img2 = new Image();
						img2.addEventListener("load", imgLoadedHandler);
						img2.id = "props";
						img2.src = "../resources/nivel1/Props_LVL1.png";
						break;
					case 3:
					//Carrega os props
						var img2 = new Image();
						img2.addEventListener("load", imgLoadedHandler);
						img2.id = "props";
						img2.src = "../resources/nivel1/Props_LVL1.png";
						break;
				}
				break;
			
			case "props":
				for(let i=0; i<mapa.n_props; i++){
					var p1 = new Sprite(0,0,nw,nh,50,2,2,false,img);
					props[i]=p1;
					nLoad++;
				}

			//Help
			case "help":
				sp = new Placas(44, 55, nw, nh, false, img3);
				spHelp[0] = sp;
				break;
			case "som":
				sp = new Placas(939, 116, nw, nh, false, img4);
				spHelp[1] = sp;
				break;
			case "less":
				sp = new Placas(1149, 371, nw, nh, true, img5);
				spHelp[2] = sp;
				break;
			case "more":
				sp = new Placas(1090, 354, nw, nh, true, img6);//New
				spHelp[3] = sp;
				break;
			case "mute":
				sp = new Placas(1209, 354, nw, nh, true, img7);//New
				spHelp[4] = sp;
				break;
		}

		nLoad++;

		if (nLoad == tLoad)
		{
			var ev2 = new Event("initend");
			ev2.player = player;
			ev2.mapa = mapa;
			ev2.props = props;
			ev2.spHelp = spHelp;
			ctx.canvas.dispatchEvent(ev2);
		}
	}
}

//Iniciar animacao
function startAnim(ctx, spArray, map, spHelp)
{
	draw(ctx, spArray);

	var data = new Date();
	var tIni = data.getTime();
	
	animLoop(ctx, spArray, map, tIni, spHelp);
}

function draw(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].draw(ctx);
	}
}

function clear(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].clear(ctx);
	}
}

//Controlo da animacao
function animLoop(ctx, spArray, map, tIni, spHelp)
{
	if (tIni == 0)
	{
		var tempo = new Date();
		tIni = tempo.getTime();
	}

	var data = new Date();
	var dt = data.getTime() - tIni;

	var al = function(time)
	{
		animLoop(ctx, spArray, map, tIni, spHelp);
	}
	var reqID = window.requestAnimationFrame(al);

	render(ctx, spArray, map, reqID, dt, spHelp);
}

function timeOperator(t)
{
	t = Math.round(t/1000);
	var min = Math.floor(t/60);
	var sec = t - min*60;
	min = min > 9 ? "" + min: "0" + min;
	sec = sec > 9 ? "" + sec: "0" + sec; 
	return min + ':' + sec;
}

function animaSprite(spArray, map, dt, cw, ch)
{
	var sp = spArray[0];
	var ini;
	dt = Math.round(dt/300);
	if (sp.movement[sp.movement.length-1] == 'left' && sp.x > -sp.size[0]){
		ini = sp.x;
		sp.x -= sp.speed;
		if(!sp.intersectsPixelCheck(map)){
			sp.sprite = [Math.floor(dt%4)+1,2];
		}else{
			sp.x = ini;
			sp.sprite = [0,0];
		}
	}
	else if (sp.movement[sp.movement.length-1] == 'right' && sp.x < cw){
		ini = sp.x;
		sp.x += sp.speed;
		if(!sp.intersectsPixelCheck(map)){	
			sp.sprite = [Math.floor(dt%4)+1,3];
		}else{
			sp.x = ini;
			sp.sprite = [0,0];
		}
	}
	else if (sp.movement[sp.movement.length-1] == 'up' && sp.y > -sp.size[1]){
		ini = sp.y;
		sp.y -= sp.speed;
		if(!sp.intersectsPixelCheck(map)){
			sp.sprite = [Math.floor(dt%4)+1,1];
		}else{
			sp.y = ini;
			sp.sprite = [0,0];
		}
	}
	else if (sp.movement[sp.movement.length-1] == 'down' && sp.y < ch){
		ini = sp.y;
		sp.y += sp.speed;
		if(!sp.intersectsPixelCheck(map)){
			sp.sprite = [Math.floor(dt%4)+1,0];
		}else{
			sp.y = ini;
			sp.sprite = [0,0];
		}
	}
	else{
		sp.sprite = [0,0];
		if (sp.actionKey)
			for(let i=1; i<=map.n_props; i++){
				if(sp.intersectsPixelCheck(spArray[i])){
					sp.sprite = [Math.floor(dt%4)+1,4];
					if(spArray[i].percent>0){
						spArray[i].percent-=map.difficulty;
						if(spArray[i].percent<25){
							spArray[i].sprite=[1,1]
						}else if(spArray[i].percent>=25 && spArray[i].percent<50){
							spArray[i].sprite=[0,1]
						}else if(spArray[i].percent>=50 && spArray[i].percent<75){
							spArray[i].sprite=[1,0]
						}
					}else{
						spArray.splice(i, 1);
						map.n_props=spArray.length - 1;
						if(map.n_props==0){
							game_won=1;
						}
					}
				}
			}
	}

}

function render(ctx, spArray, map, reqID, dt, spHelp)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	if(game_won){
		ctx.font = "bold 75px serif";
		ctx.fillStyle = "yellow";
		ctx.textAlign = "center";
		if(!game_time){
			game_time = dt - pauseTime;
			final_time+=game_time;
			window.parent.final_time = final_time;
		}
		ctx.fillText("Parabéns!", canvas.width/2, canvas.height/2);
		ctx.fillText("Completaste o nivel "+ current_lvl +" em", canvas.width/2, canvas.height/2+100);
		ctx.fillText(timeOperator(game_time), canvas.width/2, canvas.height/2+200);

		if(dt-game_time>2000){
			var ev4 = new Event("playgame");
			if(current_lvl!=3){
				ctx.canvas.dispatchEvent(ev4);
			}else{
				setCookie(player_name,Math.round(final_time/1000),30); //Criar cookie com nome de utilizador
				x.style.display = "none";
				ctx.canvas.dispatchEvent(ev4);
			}
			
		}

	}else if (pause == 0){
		//Apaga a canvas
		ctx.clearRect(0, 0, cw, ch);

		//Anima sprite
	
		animaSprite(spArray, map, dt, cw, ch);

		draw(ctx, spArray);

		//Transformar msec 'dt' no formato mm:ss -> timeOperator()
		var txt = timeOperator(dt - pauseTime);
		ctx.fillText(txt, cw/2, ch);
	}
	else
	{
		draw(ctx,spHelp);
	}
}

//Handlers do teclado
function keyDownHandler(ev, spArray)
{
	var sp = spArray[0];

	switch (ev.code)
	{
		case "ArrowLeft":
			if (sp.movement.indexOf('left') == -1)
				sp.movement.push('left');
			break;
		case "ArrowRight":
			if (sp.movement.indexOf('right') == -1)
				sp.movement.push('right');
			break;
		case "ArrowUp":
			if (sp.movement.indexOf('up') == -1)
				sp.movement.push('up');
			break;
		case "ArrowDown":
			if (sp.movement.indexOf('down') == -1)
				sp.movement.push('down');
			break;
		case "Space":
			sp.actionKey = true;
			break;

		case "KeyH":
			var data = new Date();
			
			if (pause)
			{
				pauseTime += data.getTime() - pauseInit;
				pause = 0;
			}
			else
			{
				pauseInit = data.getTime();
				pause = 1;
			}

			break;
	}
}

function keyUpHandler(ev, spArray)
{
	var sp = spArray[0];

	switch (ev.code)
	{
		case "ArrowLeft":
			sp.movement.splice(sp.movement.indexOf('left'), 1);
			break;
		case "ArrowRight":
			sp.movement.splice(sp.movement.indexOf('right'), 1);
			break;
		case "ArrowUp":
			sp.movement.splice(sp.movement.indexOf('up'), 1);
			break;
		case "ArrowDown":
			sp.movement.splice(sp.movement.indexOf('down'), 1);
			break;
		case "Space":
			sp.actionKey = false;
			break;
	}
}


//interacção com o rato
function canvasClickHandler(ev, ctx, spHelp, audio)
{
	//diminuir o som
	if (spHelp[2].clickedImage(ev))
	{
		if(audio.volume==0){
			return;
		}
		else{
			audio.volume-=0.25;
		}
	}

	//aumentar o som
	if (spHelp[3].clickedImage(ev))
	{
		if(audio.volume==audioVolume){
			return;
		}
		else{
			audio.volume+=0.25;
		}
	}

	//tirar/report o som
	if (spHelp[4].clickedImage(ev))
	{
		if (audio.volume==audioVolume){
		 	audio.volume=0;
		}
		else {
			audio.volume=audioVolume;
		}
	}
}

function proximo(ev, mainW){
	var event = ev.target;
	mainW.postMessage('nivel'+(current_lvl+1), '*');
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
  	d.setTime(d.getTime() + (exdays*24*60*60*1000));
  	var expires = "expires="+ d.toUTCString();

  	var allCookies = document.cookie.split(';'); 
  	if(allCookies.length==10){
  		var maior=allCookies[9].split("=")[1];
  		if(cvalue>=maior)
  			return 0;
  		else
  			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  	}
  	else
  		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}