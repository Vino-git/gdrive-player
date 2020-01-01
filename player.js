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
			console.log(response_json);
	   		//Inicia o player
			var playerInstance = jwplayer("player_div")
			playerInstance.setup({
				file: response_json.url,
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
			
			//Função para corrigir o bug do erro 503 do servidor de arquivos.
			
			//Guarda o tempo que seria seekado no video.
			jwplayer().on('seek', function(s) {
				video_seek = s.offset;
			});
			
			//Recarrega o video e coloca esse tempo.
			jwplayer().on('error', function (e) {
				if(e.code == 221000){
					jwplayer().load({file: video_url});
					jwplayer().seek(video_seek);
				}
				if (e.code == 224003) {
				    $.ajax({
					    url: "https://meganz-player.000webhostapp.com/clearcache.php",
					    data: { 
						id: file_id
					    }
					})
					.done(function(data) {
					    console.error("[Mega.nz Player] Erro na criação do vídeo.");
					    console.warn("Recarregando página..");
					    location.reload();
					});
				}
			});
	}else{
		document.getElementById("now_doing_0").textContent = "Erro na criação do vídeo :(";
		
		if(response_json.error_code == "e_curl") {
			document.getElementById("now_doing").textContent = "Verifique se o ID está disponivel.";
		}
		if(response_json.error_code == "e_format") {
			document.getElementById("now_doing").textContent = "O vídeo precisa estar no formato .mp4";
		}
		if(response_json.error_code == "e_size") {
			document.getElementById("now_doing").textContent = "O vídeo precisa ter menos que 512MB";
		}
		
		$('.loading_container').css({'background-color':'rgb(235, 68, 68)'});
		console.error("[Mega.nz Player] Erro na criação do vídeo.");
		console.error("[Mega.nz Player] Código do erro: " + response_json.error_code);
	}
        }
});
