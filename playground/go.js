var Responder = require('./')
,   response  = new Responder();

response.on('data', function (data) {
  console.log(data.toString());
});

response.write('Hey CWC JavaScript Geeks!');
