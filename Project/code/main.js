"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	window.addEventListener("message", frameMsgHandler);//Msg para no final do video passar à frame seguinte

	var frm = document.getElementsByTagName("iframe")[0];
	showPage("menu");
}


//Gestao de paginas
function hidePage()  //não é necessário (excepto se páginas diferentes tivessem zonas de navegação diferentes)
{
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "";
}

function showPage(page)
{
	//carregar página na frame e enviar mensagem para a página logo que esteja carregada (frameLoadHandler)
	var frm = document.getElementsByTagName("iframe")[0];

	frm.addEventListener("load", frameLoadHandler);

	frm.src = "./html/" + page + ".html";
}


//Handlers
function frameLoadHandler(ev){
	var frm = ev.target;
	frm.contentWindow.postMessage('hello frame', '*');
}

function frameMsgHandler(ev){
	switch(ev.data){
		case "menu":
			hidePage();
			showPage("menu");
			break;
		case "nivel1":
			hidePage();
			showPage("nivel1");
			break;
		case "nivel2":
			hidePage();
			showPage("nivel2");
			break;
		case "nivel3":
			hidePage();
			showPage("nivel3");
			break;
	}
}