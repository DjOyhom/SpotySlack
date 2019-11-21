var request = require('request'); // "Request" library

var blocks = [];

module.exports = function search(text, tipo, access_token, callback){
    try {
        var data = {
            uri: 'https://api.spotify.com/v1/search?q=' + text + '&type=' + tipo + '&limit=5',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        };
    
        request(data, function (error, response) {
            console.log(response.body);
            blocks.push({
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "*Busqueda:* " + text
                    }
                ]
            });
    
            try {
                if(response.statusCode == 200){
                    for (var i = 0; i < JSON.parse(response.body).tracks.items.length; i++) {
                        var artists = "";
        
                        for (let j = 0; j <JSON.parse(response.body).tracks.items[i].artists.length; j++) {
                            artists = artists + JSON.parse(response.body).tracks.items[i].artists[j].name + " - ";
                        }
        
                        blocks.push({
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*"+ JSON.parse(response.body).tracks.items[i].name + "* - " + artists.substring(0, artists.length - 3)
                            },
                            "accessory": {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "▶",
                                    "emoji": true
                                },
                                "value": "trackrepro:" + JSON.parse(response.body).tracks.items[i].uri
                            }
                        });
                    }    
                } 
       
                callback(blocks);
  
   
            } catch (error) {
                
            }

            try {
                if(response.statusCode == 200 && JSON.parse(response.body).playlists.total >=1){
                    for (var i = 0; i < JSON.parse(response.body).playlists.items.length; i++) {
       
                        blocks.push({
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*" + JSON.parse(response.body).playlists.items[i].name + "*\n" + JSON.parse(response.body).playlists.items[i].owner.display_name + "\n*Cantidad de canciones:* "+ JSON.parse(response.body).playlists.items[i].tracks.total
                            },
                            "accessory": {
                                "type": "image",
                                "image_url": JSON.parse(response.body).playlists.items[i].images[0].url,
                                "alt_text": "computer thumbnail"
                            }
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "emoji": true,
                                        "text": "Play ▶"
                                    },
                                    "style": "primary",
                                    "value": "playrepro:" + JSON.parse(response.body).playlists.items[i].uri
                                }
                            ]
                        },
                        {
                            "type": "divider"
                        });
                    }    
                } 
                try {
                    callback(blocks);  
                } catch (error) {
                  
                }  
            } catch (error) {
                console.log(error);
            }
        }); 
    } catch (error) {
        console.log(error);
    }
}