var browser_url = new URL(window.location.href);
var file_id = browser_url.searchParams.get("id");
var image_url = browser_url.searchParams.get("img");
var video_title = browser_url.searchParams.get("title");
var video_description = browser_url.searchParams.get("desc");
var up_id = Math.round(Math.random() * 10000000);
var video_url = "";
var embled_html = "";
var check_upload = null;
var video_seek = 0;

//function que pega algo dentro dentro do html.
function pegaString(str, first_character, last_character) {
	if(str.match(first_character + "(.*)" + last_character) == null){
		return null;
	}else{
	    new_str = str.match(first_character + "(.*)" + last_character)[1].trim()
	    return(new_str)
    }
}

$.ajax({
        url: 'https://meganz-player.000webhostapp.com/drive/',
        dataType: 'application/json',
        data: { 
		id: file_id
  	},
    complete: function(data) {
    var response_json = JSON.parse(data.responseText);
		if(response_json.status == "success") {
			
			//Seta as informações para o vídeo.
			video_url = response_json.video_url;
			if(video_title == null){ video_title = response_json.title }
			if(image_url == null){ image_url = response_json.poster_url }
			
	   		//Inicia o player
			var playerInstance = jwplayer("player_div")
			playerInstance.setup({
				file: video_url,
				title: video_title,
				description: video_description,
				image: image_url,
				type:"mp4",
				width: "100%",
				height: "100%"
			});
			
			//Adiciona botão para baixar o vídeo.
			var button_iconPath = "download_icon.svg";
			var button_tooltipText = "Baixar Vídeo";
			var buttonId = "download-video-button";
			
			function download_ButtonClickAction() {
				var link = document.createElement("a");
			        link.download = "video";
			        link.href = video_url;
			        link.click();
			}
			
			playerInstance.addButton(button_iconPath, button_tooltipText, download_ButtonClickAction, buttonId);
			
	}else{
		document.getElementById("now_doing_0").textContent = "Erro na criação do vídeo :(";
		
		if(response_json.error_code == "e_noid") {
			document.getElementById("now_doing").textContent = "Você precisa selecionar um ID de video.";
		}
		if(response_json.error_code == "e_noexist") {
			document.getElementById("now_doing").textContent = "Nenhum vídeo foi encontrado, verifique se o ID está correto.";
		}
		
		$('.loading_container').css({'background-color':'rgb(235, 68, 68)'});
		console.error("[Mega.nz Player] Erro na criação do vídeo.");
		console.error("[Mega.nz Player] Código do erro: " + response_json.error_code);
	}
        }
});
