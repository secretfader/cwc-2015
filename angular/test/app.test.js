var request = require('supertest')
,   expect  = require('chai').expect
,   app     = require('../app');

describe('HTML 5 pushState', function () {
  it('should return 200 OK for /', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should return 200 OK for /path', function (done) {
    request(app)
      .get('/path')
      .expect(200, done);
  });
});
