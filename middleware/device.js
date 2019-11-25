var request = require('request'); // "Request" library

module.exports = function device(access_token, callback){
    var active = false;
    var iddevice = "";
    var data = {
        uri: '	https://api.spotify.com/v1/me/player/devices',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
    };
    request(data, function (error, response) {         
        var err;
        try {
            err =JSON.parse(response.body).error.status; 
        } catch (error) {
        } 
        if(err == 401 || err == 404){
            callback(false);
        }else{
            console.log(response.body);
            for(var i = 0; i < JSON.parse(response.body).devices.length; i++){
                if(JSON.parse(response.body).devices[i].name == "raspotify"){
                    iddevice = JSON.parse(response.body).devices[i].id;
                    active = false;
                }
            }
            if(active == false){
                var data = {
                    uri: '	https://api.spotify.com/v1/me/player',
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept' : 'application/json',
                      'Authorization': 'Bearer ' + access_token
                    },
                    body: JSON.stringify({
                        "device_ids": [
                          iddevice
                        ]
                    })
                };
                request(data, function (error, response) { 
                    var err;
                    try {
                        err = response.body.error.status;
                    } catch (error) {
                    }
                    if (err == 404) {
                         callback(false);
                    }
                });
            }
        }
    });    
}