var express = require('express'); 
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sem = require('semaphore')(1);

//middleware-----modulos------------------------
var repro = require("./middleware/repro");
var reproS = require("./middleware/reproS");
var check = require("./middleware/check");
var search = require("./middleware/search");
var cmd = require("./middleware/cmd");
var playlists = require("./middleware/playlists");
var device = require("./middleware/device");
//librerias

//////////////////////////////////
//NUEVAS IDEAS///////////////////
//LOS BOTONES DEL REPRO TENDRIAN QUE 
//UPDATEAR EL ULTIMO MENSAJE DEL REPRO
//CUANDO LLEGA EL POST DE SLACK A REPRO
//GUARDAR EN UNA VARIABLE EL TS DEL JSON
//Y DEPUES CUANDO CMD ARME EL MENSAJE,
//QUE SEA UN UPDATE DE ESE ULTIMO MENSAJE
//EL MENSAJE DEL REPRO TENDRIA QUE SER UN 
//POST PARA PODER EDITARLO, Y COMO RESPUESTA 
//AL POST DE SLACK, MANDAR UN MENSAJE CON 
//LOS CREDITOS DEL USUARIO
/////////////////////////////////////////

//token slack//////////////////////////
var token ="";
//////////////////////////////////////
//TOKEN API USUARIOS//////////////////
var tokenU = "fnsduijwru895:734u98u4hrn2oefrj:9384hr9n2m3emfoe-wdsdsdsdsdsjfad9032*m89rjfw";
///////////////////////////////////////

//variables de configuracion de la app de spotify
var code;
var client_id = '9bd9909c43244659a7238efff9370538'; // Your client id
var client_secret = '9cf9f6a1671043d6aa37201856acd03c'; // Your secret
var redirect_uri = 'http://alterspace.ddns.net:3000/callback'; // Your redirect uri
var scope = 'user-modify-playback-state user-read-private playlist-read-private user-library-modify playlist-read-collaborative playlist-modify-private user-follow-modify user-read-currently-playing user-read-email user-library-read user-top-read playlist-modify-public user-follow-read user-read-playback-state user-read-recently-played';
var volumen = 100;
var repeat = "off";
//-----------------------------------------------------
//Generador de texto random----------------------------
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
var stateKey = 'spotify_auth_state';
//-----------------------------------------------------

//variables globales-----------------------------------
var access_token;
var refresh_token;
//------------------------------------------------------

//configuracion del express-----------------------------
var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//------------------------------------------------------

//ENDPOINT DE LA API------------------------------------
//ENDPOINTS DE AUTO-------------------------------------
app.get('/', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.post('/', function (req, res) {
  if (req.body.challenge) {
    res.send(req.body);
  }
});

app.get('/callback', function(req, res) {
  code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        request.get(options, function(error, response, body) {
        });
        // res.send('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
        if (access_token) {

          var data = {
            uri: 'https://api.spotify.com/v1/me/player/volume?volume_percent=' + volumen,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization': 'Bearer ' + access_token
            }
          };
          request(data, function (err, respo) {
            res.send('Todo listo, con 100% de volumen<br><br><br><br><br><br>' + access_token);
          });
        }
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});
//--------------------------------------------------------



//ENDPOINTS DE FUNCIONES DE LA API------------------------
app.post('/repro', function(req, res) {
  var a;
    check(access_token, function(active){
      if(active == true){
        reproS(access_token, function(msg){
          a = msg;
          res.send({"blocks":a});
        });
      }else{
        device(access_token, function(response){
          if (response == true) {
            res.send("El dispositivo se encontraba desactivado, ahora fue activado exitosamente, intente el comando de nuevo :)");
          }else{
            res.send("Hubo un error al activar al dispositivo");
          }
        });
      }
    });
});

app.post('/active', function(req, res) {
  device(access_token);
  res.send("Reproduciendo en la raspberry... :)");
});

app.post('/search', function(req, res) {
  check(access_token, function(active){
    if(active == true){
      var tipo;
      if (req.body.text == "") {
        res.send("Busqueda vacia...")
      }else{
        if(req.body.command == "/spmusic"){
          tipo = "track";
        }else{
          tipo = "playlist";
        }
        search(req.body.text, tipo, access_token, function(blocks){
          res.send({"blocks":blocks});
        });
      }
    }else{
      device(access_token, function(response){
        if (JSON.parse(response.body).device[0].is_active == true) {
          res.send("El dispositivo se encontraba desactivado, ahora fue activado exitosamente, intente el comando de nuevo :)");
        }else{
          res.send("Hubo un error al activar al dispositivo");
        }
      });
    }
  });
});

app.post('/cmd', function(req, res) {
  check(access_token, function(active){
    if(active == true){
      cmd(JSON.parse(req.body.payload).actions[0].value, volumen, access_token, function(){
        res.end();
        setTimeout(function(){
          reproS(access_token, function(msg){
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
                  "blocks": msg
              })
            }
            request(data, function (error, response) {
            });
          });
        }, 1000);
      });
    }else{
      device(access_token, function(response){
        var text;
        if (response == true) {
          text = "El dispositivo se encontraba desactivado, ahora fue activado exitosamente, intente el comando de nuevo :)";
        }else{
          text ="Hubo un error al activar al dispositivo";
        }

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
              "text": text
          })
        }
        request(data, function (error, response) {
        });
      });
    }
  });
});

app.post('/mute', function(req, res) {
  check(access_token, function(active){
    if(active == true){
      cmd("mute", volumen, access_token);
    }else{
      device(access_token, function(response){
        if (JSON.parse(response.body).device[0].is_active == true) {
          res.send("El dispositivo se encontraba desactivado, ahora fue activado exitosamente, intente el comando de nuevo :)");
        }else{
          res.send("Hubo un error al activar al dispositivo");
        }
      });
    }
  });
});

app.post('/playlists', function(req, res) {
  check(access_token, function(active){
    if(active == true){
      playlists("https://api.spotify.com/v1/me/playlists?limit=10", null, access_token, function(m){
        res.send({"blocks": m});
      });
    }else{
      device(access_token, function(response){
        if (JSON.parse(response.body).device[0].is_active == true) {
          res.send("El dispositivo se encontraba desactivado, ahora fue activado exitosamente, intente el comando de nuevo :)");
        }else{
          res.send("Hubo un error al activar al dispositivo");
        }
      });
    }
  });
});

app.post('/newplay', function(req, res) {
  check(access_token, function(active){
    if(active == true){
      if (req.body.text != "") {
        var dataU = {
          uri: 'https://api.spotify.com/v1/me/playlists',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json',
            'Authorization': 'Bearer ' + access_token
          },
          body: "{\"name\":\""+ req.body.text +"\",\"public\":true}"
        };
        request(dataU, function (error, response) {
          repro(access_token, function(vol){
            res.send({"blocks": vol});
          });
        });
      }
    }else{
      device(access_token, function(response){
        if (JSON.parse(response.body).device[0].is_active == true) {
          res.send("El dispositivo se encontraba desactivado, ahora fue activado exitosamente, intente el comando de nuevo :)");
        }else{
          res.send("Hubo un error al activar al dispositivo");
        }
      });
    }
  });
});

//////////////////////////////////////////////////////////
//Analizadores req////////////////////////////////////////
app.get('/viewer', function(req, res) {
});

app.post('/viewer', function(req, res) {
  console.log(req.body);
});
//////////////////////////////////////////////////////////

//FUNCION PARA LA ACTUALIZACION DEL TOKEN DE SPOTIFY//////
setInterval(function(){ 
  console.log(refresh_token)
  var data = {
    uri: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    body: "grant_type=refresh_token&refresh_token=" + refresh_token 
  };    
  request(data, function (error, response) {
    console.log(JSON.parse(response.body))
    access_token = JSON.parse(response.body).access_token;
  });
}, 200000);
//////////////////////////////////////////////////////////
//LEVANTANDO EL SERVER EXPRESS-------------------------
app.listen(3000);