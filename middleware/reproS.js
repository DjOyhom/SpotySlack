var request = require('request'); // "Request" library
var sem = require('semaphore')(1);

module.exports = function reproS(access_token, callback){
    var info;
    var blocks = [];
    var botones = [];
    var credits;
    var playlist;

    sem.take(function(){
        try {
            var dataRepro = {
                uri: 'https://api.spotify.com/v1/me/player',
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept' : 'application/json',
                  'Authorization': 'Bearer ' + access_token
                }
            };
            request(dataRepro, function (error, response) { 
                console.log(response.body);
                var artistMusic = ""; 
                for (let i = 0; i < JSON.parse(response.body).item.artists.length; i++) {
                    artistMusic = artistMusic + JSON.parse(response.body).item.artists[i].name + " - ";
                }
                if (JSON.parse(response.body).context != null) {
                    info = {
                        "uri" : JSON.parse(response.body).context.href,
                        "context" : JSON.parse(response.body).context.type,
                        "random" : JSON.parse(response.body).shuffle_state,
                        "repeat" : JSON.parse(response.body).repeat_state,
                        "volumen" : JSON.parse(response.body).device.volume_percent,  
                        "imagen" : JSON.parse(response.body).item.album.images[0].url,
                        "album" : JSON.parse(response.body).item.album.name,
                        "isPlay" : JSON.parse(response.body).is_playing,
                        "nameMusic" : JSON.parse(response.body).item.name,
                        "idMusic" : JSON.parse(response.body).item.uri,
                        "artistMusic": artistMusic
                    }
                }else{
                    info = {
                        "uri" : null,
                        "context" : null,
                        "random" : JSON.parse(response.body).shuffle_state,
                        "repeat" : JSON.parse(response.body).repeat_state,
                        "volumen" : JSON.parse(response.body).device.volume_percent,  
                        "imagen" : JSON.parse(response.body).item.album.images[0].url,
                        "album" : JSON.parse(response.body).item.album.name,
                        "isPlay" : JSON.parse(response.body).is_playing,
                        "nameMusic" : JSON.parse(response.body).item.name,
                        "idMusic" : JSON.parse(response.body).item.uri,
                        "artistMusic": artistMusic
                    }
                }
                sem.leave();    
            });
        } catch (error) {
            console.log(error);  
        }
    });


    sem.take(function(){
        try {
            var dataPlaylist = {
                uri: info.uri,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            request(dataPlaylist, function (error, response) { 
                console.log(response);
                playlist = JSON.parse(response.body).name;
                sem.leave();
            });
        } catch (error) {
            console.log(error);  
        }
    });


    sem.take(function(){
        try {
            var dataCreditos = {
                uri: 'http://localhost:5000/1' ,
                method: 'GET',
                params:{
                    'action': "action"
                }
            };
            request(dataCreditos, function (error, response) { 
                credits = JSON.parse(response.body).credits;
                sem.leave();    
            });
        } catch (error) {
            console.log(error);  
        }
    });

    sem.take(function(){
        if(info.volumen != 0 && info.context == "playlist"){
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Reproductor - Volumen: " + info.volumen +"% \nTus creditos: "+ credits+ "\n\n *"+ info.nameMusic + "* - " + info.artistMusic.substring(0, info.artistMusic.length - 3) + " \nPlaylist: " + playlist 
                },
                "accessory": {
                    "type": "image",
                    "image_url": info.imagen,
                    "alt_text": info.album
                }
            });
        }else if(info.volumen != 0 && info.context != "playlist"){
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Reproductor - Volumen: " + info.volumen +"% \nTus creditos: "+ credits+ "\n\n *"+ info.nameMusic + "* - " + info.artistMusic.substring(0, info.artistMusic.length - 3)
                },
                "accessory": {
                    "type": "image",
                    "image_url": info.imagen,
                    "alt_text": info.album
                }
            });
        }else if(info.volumen == 0 && info.context == "playlist"){
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Reproductor - Volumen: 🔇 \nTus creditos: "+ credits+ "\n\n *"+ info.nameMusic + "* - " + info.artistMusic.substring(0, info.artistMusic.length - 3) + " \nPlaylist: " + playlist
                },
                "accessory": {
                    "type": "image",
                    "image_url": info.imagen,
                    "alt_text": info.album
                }
            });
        }else if(info.volumen == 0 && info.context != "playlist"){
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Reproductor - Volumen: 🔇 \nTus creditos: "+ credits+ "\n\n *"+ info.nameMusic + "* - " + info.artistMusic.substring(0, info.artistMusic.length - 3)
                },
                "accessory": {
                    "type": "image",
                    "image_url": info.imagen,
                    "alt_text": info.album
                }
            });
        }
        botones.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "⬅",
                "emoji": true
            },
            "value": "previous"
        });
        if (info.isPlay == true) {
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "⏸",
                    "emoji": true
                },
                "value": "pause"
            });  
        }else{
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "▶",
                    "emoji": true
                },
                "value": "play"
            });  
        }
        botones.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "➡",
                "emoji": true
            },
            "value": "next"
        });
        botones.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "⬆",
                "emoji": true
            },
            "value": "up"
        });
        botones.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "⬇",
                "emoji": true
            },
            "value": "down"
        });
        if(info.repeat == "off"){
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "🔁",
                    "emoji": true
                },
                "value": "repeatcon"
            });
        }else if(info.repeat == "track"){
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "🔜",
                    "emoji": true
                },
                "value": "repeatoff"
            });
        }else{
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "🔂",
                    "emoji": true
                },
                "value": "repeatone"
            });
        }
        if (info.random == false) {
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "🔀",
                    "emoji": true
                },
                "value": "randomon" 
            });
        }else{
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "〰",
                    "emoji": true
                },
                "value": "randomoff" 
            });
        }
        if(info.volumen >= 1){
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "🔇",
                    "emoji": true
                },
                "value": "mute"
            });
        }else{
            botones.push({
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "💯",
                    "emoji": true
                },
                "value": "100"
            });
        }
        botones.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "☑",
                "emoji": true
            },
            "value": "add:" + info.idMusic 
        });
        blocks.push({
            "type": "actions",
            "elements": botones
        });
        var ran = "off";
        if (info.random == true) {
            ran = "on";
        }
        var rep = "off";
        if (info.repeat == "track") {
            rep = "1";
        }else if(info.repeat == "context"){
            rep = "all"
        }
        blocks.push({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Aleatorio: " + ran + " - Repetir: " + rep + "*"
            }
        });
        sem.leave();
    });
    sem.take(function(){
        callback(blocks); 
        sem.leave();
    });
}
