const Hapi = require('hapi');
const AnswerController = require('../../../../lib/application/answers/answer-controller');

describe('Unit | Router | AnswerRouter', function () {

  let server;

  beforeEach(function () {
    server = this.server = new Hapi.Server();
    server.connection({ port: null });
    server.register({ register: require('../../../../lib/application/answers') });
  });

  function expectRouteToExist(routeOptions, done) {
    server.inject(routeOptions, (res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  }

  describe('POST /api/answers', function () {

    before(function () {
      sinon.stub(AnswerController, 'save', (request, reply) => reply('ok'));
    });

    after(function () {
      AnswerController.save.restore();
    });

    it('should exist', function (done) {
      expectRouteToExist({ method: 'POST', url: '/api/answers' }, done);
    });
  });

  describe('GET /api/answers/{id}', function () {

    before(function () {
      sinon.stub(AnswerController, 'get', (request, reply) => reply('ok'));
    });

    after(function () {
      AnswerController.get.restore();
    });

    it('should exist', function (done) {
      expectRouteToExist({ method: 'GET', url: '/api/answers/answer_id' }, done);
    });
  });

  describe('GET /api/answers?assessment=<assessment_id>&challenge=<challenge_id>', function () {

    before(function () {
      sinon.stub(AnswerController, 'findByChallengeAndAssessment', (request, reply) => reply('ok'));
    });

    after(function () {
      AnswerController.findByChallengeAndAssessment.restore();
    });

    it('should exist', function (done) {
      expectRouteToExist({ method: 'GET', url: '/api/answers' }, done);
    });
  });

});
