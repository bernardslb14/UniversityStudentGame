"use strict";

const audioVolume = 1;

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var cw = canvas.width;
	var ch = canvas.height;
	var spArray = new Array(4);  //sprite array

	//form
	var x = document.getElementById("fname");
	x.style.display = "none";
	//O enter no formulário dava refresh
	x.addEventListener("keydown", function(event) {
	  if (event.keyCode === 13) {
	    event.preventDefault();
	  }
	});

	//som
	var audio=document.getElementsByTagName("audio")[0];
	audio.play();

	var mainW; //NEW
	var mainMsg = function (ev){
		mainW = ev.source;
	}
	window.addEventListener("message", mainMsg);//Escuta uma mensagem da main

	var confirmar = function(ev){
		play_jogo(ev, mainW);
	}
	canvas.addEventListener("playgame", confirmar); //NEW

	//Desenhar butoes do menu
	canvas.addEventListener("initend", initEndHandler);//Triggered depois de os elementos carregarem
	init(ctx);  //carregar todos os componentes

	function initEndHandler(ev)
	{
		//instalar listeners do rato	
		ctx.canvas.addEventListener("click", cch);

		spArray[0] = ev.spMenu;
		spArray[1] = ev.spRank;
		spArray[2] = ev.spHelp;
		spArray[3] = ev.spBegin;
		clear(ctx, spArray[1]);
		clear(ctx, spArray[2]);
		clear(ctx, spArray[3]);
		draw(ctx, spArray[0]);
	}

	var cch = function(ev)
	{
		canvasClickHandler(ev, ctx, spArray[0], spArray[1], spArray[2], spArray[3], audio);	
	}
}


//init: carregamento de componentes
function init(ctx)
{
	var nLoad = 0;
	var totLoad = 17;
	var spMenu = new Array(6);
	var spRank = new Array(2);
	var spHelp = new Array(6);
	var spBegin = new Array(3);
	var img;

	//carregar imagens e criar sprites
	//MENU
	//6 Sprites
	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="title";
	img.src = "../resources/menu/DODGE_TITLE.png";  //dá ordem de carregamento da imagem

	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="pole";
	img.src = "../resources/menu/DODGE_POLE.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="jogar";
	img.src = "../resources/menu/DODGE_JOGAR.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="ranking";
	img.src = "../resources/menu/DODGE_RANKING.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="ajuda";
	img.src = "../resources/menu/DODGE_AJUDA.png";  //dá ordem de carregamento da imagem

	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="sair";
	img.src = "../resources/menu/DODGE_SAIR.png";  //dá ordem de carregamento da imagem

	//RANKING
	//2 Sprites
	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="rank";
	img.src = "../resources/menu/DODGE_RANK.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="rank_back";
	img.src = "../resources/menu/DODGE_BACK.png";  //dá ordem de carregamento da imagem

	//HELP
	//6 Sprites
	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="help";
	img.src = "../resources/menu/DODGE_HELP.png";  //dá ordem de carregamento da imagem

	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="som";
	img.src = "../resources/menu/DODGE_SOM.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="less";
	img.src = "../resources/menu/DODGE_LESS.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="more";
	img.src = "../resources/menu/DODGE_MORE.png";  //dá ordem de carregamento da imagem

	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="mute";
	img.src = "../resources/menu/DODGE_MUTE.png";  //dá ordem de carregamento da imagem

	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="help_back";
	img.src = "../resources/menu/DODGE_BACK.png";  //dá ordem de carregamento da imagem

	//BEGIN
	//3 Sprites
	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.id="confirm";
	img.src = "../resources/menu/DODGE_JOGAR.png";  //dá ordem de carregamento da imagem

	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="begin_back";
	img.src = "../resources/menu/DODGE_BACK.png";  //dá ordem de carregamento da imagem

	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="insert_name";
	img.src = "../resources/menu/DODGE_INSERT_NAME.png";  //dá ordem de carregamento da imagem

	function imgLoadedHandler(ev)
	{
		var img = ev.target;
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		var sp;

		switch (ev.target.id)
		{
			//Menu
			case "title":
				sp = new Placas(361, 18, nw, nh, false, img);
				spMenu[0] = sp;
				break;
			case "pole":
				sp = new Placas(156, 291, nw, nh, false, img);
				spMenu[1] = sp;
				break;
			case "jogar":
				sp = new Placas(35, 300, nw, nh, true, img);
				spMenu[2] = sp;
				break;
			case "ranking":
				sp = new Placas(43, 442, nw, nh, true, img);//New
				spMenu[3] = sp;
				break;
			case "ajuda":
				sp = new Placas(38, 529, nw, nh, true, img);//New
				spMenu[4] = sp;
				break;
			case "sair":
				sp = new Placas(43, 630, nw, nh, true, img);//New
				spMenu[5] = sp;
				break;
			//Rank
			case "rank":
				sp = new Placas(79, 29, nw, nh, false, img);//New
				spRank[0] = sp;
				break;
			case "rank_back":
				sp = new Placas(740, 587, nw, nh, true, img);//New
				spRank[1] = sp;
				break;
			//Help
			case "help":
				sp = new Placas(44, 55, nw, nh, false, img);
				spHelp[0] = sp;
				break;
			case "som":
				sp = new Placas(939, 116, nw, nh, false, img);
				spHelp[1] = sp;
				break;
			case "less":
				sp = new Placas(1149, 371, nw, nh, true, img);
				spHelp[2] = sp;
				break;
			case "more":
				sp = new Placas(1090, 354, nw, nh, true, img);//New
				spHelp[3] = sp;
				break;
			case "mute":
				sp = new Placas(1209, 354, nw, nh, true, img);//New
				spHelp[4] = sp;
				break;
			case "help_back":
				sp = new Placas(740, 587, nw, nh, true, img);//New
				spHelp[5] = sp;
				break;
			//Begin
			case "confirm":
				sp = new Placas(900, 350, nw, nh, true, img);//New
				spBegin[0] = sp;
				break;
			case "begin_back":
				sp = new Placas(850, 587, nw, nh, true, img);//New
				spBegin[1] = sp;
				break;
			case "insert_name":
				sp = new Placas(51, 286, nw, nh, false, img);//New
				spBegin[2] = sp;
				break;
		}

		nLoad++;	

		if (nLoad == totLoad)
		{
			var ev2 = new Event("initend");
			ev2.spMenu = spMenu;
			ev2.spRank = spRank;
			ev2.spHelp = spHelp;
			ev2.spBegin = spBegin;
			ctx.canvas.dispatchEvent(ev2);
		}
	}
}

//desenhar sprites
function draw(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].draw(ctx);
		spArray[i].clickable = spArray[i].clickableIni;//NEW
	}
}

//apagar sprites
function clear(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].clear(ctx);
		spArray[i].clickable = false;//NEW
	}
}


function bubbleSort(list){
    var length = list.length;

    for (var i = length-1; i >= 0; i--){
       for(var j = 1; j <= i; j++){
       	var l1 = list[j-1].split("=");
       	var l2 = list[j].split("=");
       	//console.log(l1);
       	//console.log(l2);
        if(l1[1] > l2[1]){
            var aux = list[j-1];
            list[j-1] = list[j];
            list[j] = aux;
        }
       }
    }
    
    console.log(list);
    return list;
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

function deleteCookies() { 
    var allCookies = document.cookie.split(';');
                
    for (var i = 0; i < allCookies.length; i++) 
        document.cookie = allCookies[i] + "=;expires=" + new Date(0).toGMTString() + ";path=/"; 
} 

function getCookie(ind,ca) {
  	for(var i = 0; i < ca.length; i++) {
    	var c = ca[i];
    	while (c.charAt(0) == ' ') {
      		c = c.substring(1);
    	}
    	if (i==ind && c!=''){
      		return c;
    	}
  	}
  	return "";
}


//interacção com o rato
function canvasClickHandler(ev, ctx, spMenu, spRank, spHelp, spBegin, audio)
{
	//jogar
	if (spMenu[2].clickedImage(ev))
	{
		clear(ctx,spMenu);
		draw(ctx,spBegin);
		var x = document.getElementById("fname");
		x.style.display = "block";
	}
	//ir para o menu "Rank"
	if (spMenu[3].clickedImage(ev))
	{
		clear(ctx,spMenu);
		
		//deleteCookies(); //limpar o ranking
		//EXEMPLOS
		// setCookie("UTILIZADOR_1",5.25,30);
		// setCookie("UTILIZADOR_2",6.55,30);
		// setCookie("UTILIZADOR_3",4.12,30);
		// setCookie("UTILIZADOR_4",3.12,30);
		// setCookie("UTILIZADOR_5",4.13,30);
		// setCookie("UTILIZADOR_6",5.41,30);
		// setCookie("UTILIZADOR_7",3.88,30);
		// setCookie("UTILIZADOR_8",2.22,30);
		// setCookie("UTILIZADOR_9",7.01,30);
		// setCookie("UTILIZADOR_10",6.34,30);
		// setCookie("AAA",10.13,30);

        var utilizador;
        var allCookies = document.cookie.split(';');
  		allCookies=bubbleSort(allCookies);

	    draw(ctx,spRank);
	    ctx.font = "bold 30px serif";
	    ctx.fillStyle = 'yellow';
	    for(var i=0;i<10;i++){
	    	utilizador=getCookie(i,allCookies);
	    	if(utilizador==''){
	    		ctx.fillText("---", 225, 115+i*60);
	    		ctx.fillText("---", 600, 115+i*60);
	    	}
	    	else{
	    		let aux=utilizador.split("=");
	    		if(aux[1]!="undefined"){
			    	ctx.fillText(aux[0], 225, 115+i*60);
			    	ctx.fillText(aux[1], 600, 115+i*60);
		    	}else{
		    		ctx.fillText("---", 225, 115+i*60);
	    			ctx.fillText("---", 600, 115+i*60);
		    	}
		    }
	    }

	}
	//ir para o menu "Help"
	if (spMenu[4].clickedImage(ev))
	{
		clear(ctx,spMenu);
		draw(ctx,spHelp);
	}
	//sair do jogo
	if (spMenu[5].clickedImage(ev))
	{
		clear(ctx,spMenu);
		audio.pause();
	}

	//voltar ao menu principal
	if (spRank[1].clickedImage(ev))
	{
		clear(ctx,spRank);
		draw(ctx,spMenu);
	}

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

	//voltar ao menu principal
	if (spHelp[5].clickedImage(ev))
	{
		clear(ctx,spHelp);
		draw(ctx,spMenu);
	}
	
	//Voltar ao menu
	if (spBegin[1].clickedImage(ev))
	{
		clear(ctx,spBegin);
		draw(ctx,spMenu);
		var x = document.getElementById("fname");
		x.style.display = "none";
	}
	//Em begin jogar
	if (spBegin[0].clickedImage(ev))
	{
		var ev4 = new Event("playgame");
		var x = document.getElementById("fname");
		if(x.value){
			setCookie(x.value,undefined,30); //Criar cookie com nome de utilizador
			x.style.display = "none";
			window.parent.player_name = x.value;
			ctx.canvas.dispatchEvent(ev4);
		}else{
			x.style.backgroundColor = "red";
		}
		
	}
}

function play_jogo(ev, mainW){
	var event = ev.target;
	mainW.postMessage('nivel1', '*');
}