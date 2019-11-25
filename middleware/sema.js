var request = require('request'); // "Request" library


try {
    var dataCreditos = {
        uri: 'http://localhost:5000/1',
        method: 'GET',
        params:{
            'user': "JSON.parse(req.body.payload).user.name"
        }
    };
    request(dataCreditos, function (error, response) { 
       console.log(response);
    });
} catch (error) {
    console.log(error);  
}












// var blocks = [];
// var botones = [];
// try {
//     getInfoRepro(access_token, function(uri, context, volumen, repeat, imagen, album, artistas, nameMusic, isPlay, playlist, credits, idMusic, random){
//         var artistMusic = "";
//         for (let i = 0; i < artistas.length; i++) {
//             artistMusic = artistMusic + artistas [i] + " - ";
//         }
//         if(volumen != 0 && context == "playlist"){
//             blocks.push({
//                 "type": "section",
//                 "text": {
//                     "type": "mrkdwn",
//                     "text": "Reproductor - Volumen: " + volumen +"% \nTus creditos: "+ credits+ "\n\n *"+ nameMusic + "* - " + artistMusic.substring(0, artistMusic.length - 3) + " \nPlaylist: " + playlist 
//                 },
//                 "accessory": {
//                     "type": "image",
//                     "image_url": imagen,
//                     "alt_text": album
//                 }
//             });
//         }else if(volumen != 0 && context != "playlist"){
//             blocks.push({
//                 "type": "section",
//                 "text": {
//                     "type": "mrkdwn",
//                     "text": "Reproductor - Volumen: " + volumen +"% \nTus creditos: "+ credits+ "\n\n *"+ nameMusic + "* - " + artistMusic.substring(0, artistMusic.length - 3)
//                 },
//                 "accessory": {
//                     "type": "image",
//                     "image_url": imagen,
//                     "alt_text": album
//                 }
//             });
//         }else if(volumen == 0 && context == "playlist"){
//             blocks.push({
//                 "type": "section",
//                 "text": {
//                     "type": "mrkdwn",
//                     "text": "Reproductor - Volumen: 🔇 \nTus creditos: "+ credits+ "\n\n *"+ nameMusic + "* - " + artistMusic.substring(0, artistMusic.length - 3) + " \nPlaylist: " + playlist
//                 },
//                 "accessory": {
//                     "type": "image",
//                     "image_url": imagen,
//                     "alt_text": album
//                 }
//             });
//         }else if(volumen == 0 && context != "playlist"){
//             blocks.push({
//                 "type": "section",
//                 "text": {
//                     "type": "mrkdwn",
//                     "text": "Reproductor - Volumen: 🔇 \nTus creditos: "+ credits+ "\n\n *"+ nameMusic + "* - " + artistMusic.substring(0, artistMusic.length - 3)
//                 },
//                 "accessory": {
//                     "type": "image",
//                     "image_url": imagen,
//                     "alt_text": album
//                 }
//             });
//         }
//         botones.push({
//             "type": "button",
//             "text": {
//                 "type": "plain_text",
//                 "text": "⬅",
//                 "emoji": true
//             },
//             "value": "previous"
//         });
//         if (isPlay == true) {
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "⏸",
//                     "emoji": true
//                 },
//                 "value": "pause"
//             });  
//         }else{
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "▶",
//                     "emoji": true
//                 },
//                 "value": "play"
//             });  
//         }
//         botones.push({
//             "type": "button",
//             "text": {
//                 "type": "plain_text",
//                 "text": "➡",
//                 "emoji": true
//             },
//             "value": "next"
//         });
//         botones.push({
//             "type": "button",
//             "text": {
//                 "type": "plain_text",
//                 "text": "⬆",
//                 "emoji": true
//             },
//             "value": "up"
//         });
//         botones.push({
//             "type": "button",
//             "text": {
//                 "type": "plain_text",
//                 "text": "⬇",
//                 "emoji": true
//             },
//             "value": "down"
//         });
//         if(repeat == "off"){
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "🔁",
//                     "emoji": true
//                 },
//                 "value": "repeatcon"
//             });
//         }else if(repeat == "track"){
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "🔜",
//                     "emoji": true
//                 },
//                 "value": "repeatoff"
//             });
//         }else{
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "🔂",
//                     "emoji": true
//                 },
//                 "value": "repeatone"
//             });
//         }
//         if (random == false) {
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "🔀",
//                     "emoji": true
//                 },
//                 "value": "randomon" 
//             });
//         }else{
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "〰",
//                     "emoji": true
//                 },
//                 "value": "randomoff" 
//             });
//         }
//         if(volumen >= 1){
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "🔇",
//                     "emoji": true
//                 },
//                 "value": "mute"
//             });
//         }else{
//             botones.push({
//                 "type": "button",
//                 "text": {
//                     "type": "plain_text",
//                     "text": "💯",
//                     "emoji": true
//                 },
//                 "value": "100"
//             });
//         }
//         botones.push({
//             "type": "button",
//             "text": {
//                 "type": "plain_text",
//                 "text": "☑",
//                 "emoji": true
//             },
//             "value": "add:" + idMusic 
//         });
//         blocks.push({
//             "type": "actions",
//             "elements": botones
//         });
//         var ran = "off";
//         if (random == true) {
//             ran = "on";
//         }
//         var rep = "off";
//         if (repeat == "track") {
//             rep = "1";
//         }else if(repeat == "context"){
//             rep = "all"
//         }
//         blocks.push({
//             "type": "section",
//             "text": {
//                 "type": "mrkdwn",
//                 "text": "*Aleatorio: " + ran + " - Repetir: " + rep + "*"
//             }
//         })
//         callback(blocks);
//     });
// } catch (error) {
    
// }


// function getPlaylist(access_token, uri, callback){
//     try {
//         var dataPlaylist = {
//             uri: 'https://api.spotify.com/v1/playlists/' + uri,
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept' : 'application/json',
//                 'Authorization': 'Bearer ' + access_token
//             }
//         };
//         request(dataPlaylist, function (error, response) { 
//             callback(JSON.parse(response.body).name);
//         });
//     } catch (error) {
//       console.log(error);  
//     }
// }

// function getInfoRepro(access_token, callback){
//     var nameMusic = null;
//     var album = null;
//     var isPlay = false;
//     var volumen = null;
//     var imagen = null;
//     var context = null;
//     var artistas = [];
//     var playlist = null;
//     var uri = null;
//     var repeat = null;
//     var idMusic = null;
//     var random = null;

//     try {
//         var dataRepro = {
//             uri: 'https://api.spotify.com/v1/me/player',
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept' : 'application/json',
//               'Authorization': 'Bearer ' + access_token
//             }
//         };
//         request(dataRepro, function (error, response) { 
//             try {
//                 uri = JSON.parse(response.body).context.uri;
//                 context = JSON.parse(response.body).context.type;
//             } catch (error) {  
//                 console.log("No hay playlist reproduciendose"); 
//             }
//             console.log(response.body)
//             try {
//                 random = JSON.parse(response.body).shuffle_state;
//                 repeat = JSON.parse(response.body).repeat_state;
//                 volumen = JSON.parse(response.body).device.volume_percent;  
//                 imagen = JSON.parse(response.body).item.album.images[0].url;
//                 album = JSON.parse(response.body).item.album.name;
//                 isPlay = JSON.parse(response.body).is_playing;
//                 nameMusic = JSON.parse(response.body).item.name;
//                 idMusic = JSON.parse(response.body).item.uri;
//             } catch (error) {
//                 console.log("wh");
//             }
//             try {
//                 for (let i = 0; i < JSON.parse(response.body).item.artists.length; i++) {
//                     artistas.push(JSON.parse(response.body).item.artists[i].name);
//                 }
//             } catch (error) {
                
//             }
//             getCreditos(function(credits){
//                 if (uri != null) {
//                     if(uri.split(":")[4] == undefined){
//                         getPlaylist(access_token, uri.split(":")[2], function(playlistN){
//                             playlist = playlistN;
//                             callback(uri, context, volumen, repeat, imagen, album, artistas, nameMusic, isPlay, playlist, credits, idMusic, random);
//                         });
//                     }else{
//                         getPlaylist(access_token, uri.split(":")[4], function(playlistN){
//                             playlist = playlistN;
//                             callback(uri, context, volumen, repeat, imagen, album, artistas, nameMusic, isPlay, playlist, credits, idMusic, random);
//                         });
//                     }
//                 }else{
//                     callback(uri, context, volumen, repeat, imagen, album, artistas, nameMusic, isPlay, playlist, credits, idMusic, random);
//                 }
//             });
//         });
//     } catch (error) {
//       console.log(error);  
//     }
// }

// function getCreditos(callback){
//     try {
//         var dataCreditos = {
//             uri: 'http://localhost:5000/1',
//             method: 'GET',
//             params:{
//                 'user': "JSON.parse(req.body.payload).user.name"
//             }
//         };
//         request(dataCreditos, function (error, response) { 
//             callback(JSON.parse(response.body).credits);
//         });
//     } catch (error) {
//       console.log(error);  
//     }
// }