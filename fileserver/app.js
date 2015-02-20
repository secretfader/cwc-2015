var fs   = require('fs')
,   app  = require('express')();

app.get('/', function (req, res) {
  res.type('html');
  fs.createReadStream('./index.html').pipe(res);
});

app.listen(9292);
