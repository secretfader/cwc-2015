var fs        = require('fs')
,   oppressor = require('oppressor')
,   app       = require('express')();

app.get('/', function (req, res) {
  res.type('html');
  fs.createReadStream('./index.html')
    .pipe(oppressor(req)).pipe(res);
});

app.listen(9292);
