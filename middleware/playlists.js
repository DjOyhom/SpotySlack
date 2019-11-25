var request = require('request'); // 'Request' library

module.exports = function playlists(uri, music, access_token, callback){
    var c = [];
    var len;

    var data = {
      uri: uri,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(data, function (error, response) {
        len = JSON.parse(response.body).items.length;
        for (var i = 0; i < len -1; i++) {
            if (music == null) {
                c.push({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": 'Lista: *' + JSON.parse(response.body).items[i].name + '*'
                    },
                    "accessory": {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': 'Reproducir lista▶',
                            'emoji': true
                        },
                        'value': 'playrepro:' + JSON.parse(response.body).items[i].uri
                    }
                });
            }else{
                c.push({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": 'Lista: *' + JSON.parse(response.body).items[i].name + '*'
                    },
                    "accessory": {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': 'Agregar a lista✅',
                            'emoji': true
                        },
                        'value': 'addmusicplay:' + JSON.parse(response.body).items[i].uri + ":" + music
                    }
                });
            }
            c.push({
                'type': 'divider'
            });
        }
        var pie;
        if (JSON.parse(response.body).previous == null && JSON.parse(response.body).next == null) {
            pie ={
                'type': 'actions',
                'elements': [
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': '◀',
                            'emoji': true
                        },
                        'value': "none"
                    },
                    {
                        'type': 'button',
                        'style' : 'primary',
                        'text': {
                            'type': 'plain_text',
                            'text': String(JSON.parse(response.body).offset  / 10 ),
                            'emoji': true
                        },
                        'value': "none"
                    },
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': '▶',
                            'emoji': true
                        },
                        'value': "none"
                    }
                ]
            }; 
        }else if(JSON.parse(response.body).previous != null && JSON.parse(response.body).next != null){
            pie ={
                'type': 'actions',
                'elements': [
                    {
                        'type': 'button',
                        'style': 'danger',
                        'text': {
                            'type': 'plain_text',
                            'text': '◀',
                            'emoji': true
                        },
                        'value': "backplay:" + String(JSON.parse(response.body).previous)
                    },
                    {
                        'type': 'button',
                        'style' : 'primary',
                        'text': {
                            'type': 'plain_text',
                            'text': String(JSON.parse(response.body).offset  / 10 ),
                            'emoji': true
                        },
                        'value': "none"
                    },
                    {
                        'type': 'button',
                        'style': 'danger',
                        'text': {
                            'type': 'plain_text',
                            'text': '▶',
                            'emoji': true
                        },
                        'value': "nextplay:" + String(JSON.parse(response.body).next)
                    }
                ]
            }; 
        }else if(JSON.parse(response.body).previous != null && JSON.parse(response.body).next == null){
            pie ={
                'type': 'actions',
                'elements': [
                    {
                        'type': 'button',
                        'style':'danger',
                        'text': {
                            'type': 'plain_text',
                            'text': '◀',
                            'emoji': true
                        },
                        'value': "backplay:" + String(JSON.parse(response.body).previous)
                    },
                    {
                        'type': 'button',
                        'style' : 'primary',
                        'text': {
                            'type': 'plain_text',
                            'text': String(JSON.parse(response.body).offset  / 10 ),
                            'emoji': true
                        },
                        'value': "none"
                    },
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': '▶',
                            'emoji': true
                        },
                        'value': "none"
                    }
                ]
            }; 
        }else if(JSON.parse(response.body).previous == null && JSON.parse(response.body).next != null){
            pie ={
                'type': 'actions',
                'elements': [
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': '◀',
                            'emoji': true
                        },
                        'value': "none"
                    },
                    {
                        'type': 'button',
                        'style' : 'primary',
                        'text': {
                            'type': 'plain_text',
                            'text': String(JSON.parse(response.body).offset  / 10 ),
                            'emoji': true
                        },
                        'value': "none"
                    },
                    {
                        'type': 'button',
                        'style': 'danger',
                        'text': {
                            'type': 'plain_text',
                            'text': '▶',
                            'emoji': true
                        },
                        'value': "nextplay:" + String(JSON.parse(response.body).next)
                    }
                ]
            }; 
            
        }
        c.push(pie);
        callback(c);
    });
}