var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//middleware-----------------------------
var repro = require("./middleware/repro");
var search = require("./middleware/search");
var cmd = require("./middleware/cmd");
var playlists = require("./middleware/playlists");
//librerias

//token slack//////////////////////////
var token ="csfNz51zxAKO2M9yhtEaklIQ";
//////////////////////////////////////
//TOKEN API USUARIOS//////////////////
var tokenU = "fnsduijwru895:734u98u4hrn2oefrj:9384hr9n2m3emfoe-wdsdsdsdsdsjfad9032*m89rjfw";
///////////////////////////////////////

//variables de configuracion de la app de spotify
var code;
var client_id = '4c1fff6c0d524d518abaac9eeb7ccc6a'; // Your client id
var client_secret = '63e5214f20474092bb997144c0729462'; // Your secret
var redirect_uri = 'http://localhost:4000/callback'; // Your redirect uri
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
  repro(access_token, function(vol){
    res.send({"blocks": vol});
  });
});

app.post('/search', function(req, res) {
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
});

app.post('/cmd', function(req, res) {
  cmd(JSON.parse(req.body.payload).actions[0].value, volumen, access_token , res);
  res.end("");
});

app.post('/vt', function(req, res) {
  var tokenreq = "";
  try {
    tokenreq = req.body.token;
  } catch (error) {
  }

  if (tokenreq.toString() != token.toString()) {
    res.send("Token invalido:)");
  }else{
    if (volumen>0) {
      cmd("mute", volumen, access_token);
    }else{
      cmd("100", volumen, access_token);
    }
    res.end("");
  }
});

app.post('/playlists', function(req, res) {
  playlists("https://api.spotify.com/v1/me/playlists?limit=10", null, access_token, function(m){
    res.send({"blocks": m});
  });
});


app.post('/newplay', function(req, res) {
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
});

//Analizadores req////////////////////////////////////////
app.get('/viewer', function(req, res) {
});

app.post('/viewer', function(req, res) {

});

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
}, 3600);

//LEVANTANDO EL SERVER EXPRESS-------------------------
app.listen(4000);