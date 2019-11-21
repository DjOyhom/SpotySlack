var request = require('request'); // "Request" library
var repro = require("./repro");
var playlists = require("./playlists");

module.exports = function search(cmd, volumen, access_token){
    var volumen = volumen;
    var data;

    cmd = cmd.split(":");
    console.log(cmd);
    switch(cmd[0]) {
        case "up":
            if(volumen<90){
                console.log(volumen);
                volumen = volumen +10;
            }else{
                volumen = 100
            }
            data = {
                uri: 'https://api.spotify.com/v1/me/player/volume?volume_percent=' + volumen,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "down":
            if(volumen>10){
                console.log(volumen);
                volumen = volumen -10;
            }else{
                volumen = 0
            }
            data = {
                uri: 'https://api.spotify.com/v1/me/player/volume?volume_percent=' + volumen,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "play":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "pause":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/pause',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "next":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/next',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "previous":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/previous',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "playrepro":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    "context_uri": cmd[1] + ":" + cmd[2] + ":" + cmd[3],
                    "offset": {
                        "position":0
                    },
                    "position_ms":0})
            };
            break;
        case "trackrepro":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    "uris": [cmd[1] + ":" + cmd[2] + ":" + cmd[3]],
                    "offset": {
                        "position":0
                    },
                    "position_ms":0})
            };
            break;
        case "repeatone":
                data = {
                    uri: 'https://api.spotify.com/v1/me/player/repeat?state=track',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization': 'Bearer ' + access_token
                    }
                };
                break;
        case "repeatcon":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/repeat?state=context',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "repeatoff":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/repeat?state=off',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "mute":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/volume?volume_percent=0',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "100":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/volume?volume_percent=100',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "randomon":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/shuffle?state=true',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "randomoff":
            data = {
                uri: 'https://api.spotify.com/v1/me/player/shuffle?state=false',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            };
            break;
        case "nextplay":
            playlists(cmd[1] + ":" + cmd[2], null, access_token, function(m){
                var data = {
                    uri: 'https://slack.com/api/chat.postMessage',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization': 'Bearer xoxb-817620835713-825935399557-05buUpe15DVY7jQ2wMOvmN3B'
                    },
                    body: JSON.stringify({
                        "channel": "CQ9273B6G",
                        "blocks": m
                    })
                };    
                request(data, function (error, response) {
                });
            });
            break;
        case "backplay":
            playlists(cmd[1] + ":" + cmd[2], null, access_token, function(m){
                var data = {
                    uri: 'https://slack.com/api/chat.postMessage',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization': 'Bearer xoxb-817620835713-825935399557-05buUpe15DVY7jQ2wMOvmN3B'
                    },
                    body: JSON.stringify({
                        "channel": "CQ9273B6G",
                        "blocks": m
                    })
                };    
                request(data, function (error, response) {
                });
            });
            break;
        case "add":
            console.log(cmd);
            playlists("https://api.spotify.com/v1/me/playlists?limit=10", cmd[3], access_token, function(m){
                var data = {
                    uri: 'https://slack.com/api/chat.postMessage',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization': 'Bearer xoxb-817620835713-825935399557-05buUpe15DVY7jQ2wMOvmN3B'
                    },
                    body: JSON.stringify({
                        "channel": "CQ9273B6G",
                        "blocks": m
                    })
                };   
                request(data, function (error, response) {
                });
            });
            break;
        case "addmusicplay":
            data = {
                uri: 'https://api.spotify.com/v1/playlists/'+ cmd[3] +'/tracks?uris=spotify:track:' + cmd[4],
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer ' + access_token 
                }
            };
            break;
        case "none":
            var data = {
                uri: 'https://slack.com/api/chat.postMessage',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer xoxb-817620835713-825935399557-05buUpe15DVY7jQ2wMOvmN3B'
                },
                body: JSON.stringify({
                    "channel": "CQ9273B6G",
                    "text": "Boton deshabilitado"
                })
            };    
            request(data, function (error, response) {
            });
            break;
        default:
            break;
    }
    try {
        request(data, function (error, response) {
            console.log(response)
            if(response){
                repro(access_token, function(vol){
                    var data = {
                        uri: 'https://slack.com/api/chat.postMessage',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept' : 'application/json',
                            'Authorization': 'Bearer xoxb-817620835713-825935399557-05buUpe15DVY7jQ2wMOvmN3B'
                        },
                        body: JSON.stringify({
                            "channel": "CQ9273B6G",
                            "blocks": vol
                        })
                    };    
                    request(data, function (error, response) {
                        console.log(response)
                    });
                });
            }
        });
    } catch (error) {
      console.log(error);  
    }
}