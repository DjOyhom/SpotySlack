var request = require('request'); // "Request" library

module.exports = function device(access_token, callback){
    var active = false;
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
        console.log(response.body);
        try {
            err = JSON.parse(response.body).error.status; 
        } catch (error) {
        } 
        if(err == 401 || err == 404){
        }else{
            for(var i = 0; i < JSON.parse(response.body).devices.length; i++){
                iddevice = JSON.parse(response.body).devices[i].id;
                if(JSON.parse(response.body).devices[i].is_active == true && JSON.parse(response.body).devices[i].name == "raspotify"){
                    active = true;
                }
            }
        }
        callback(active);
    });
}