import {
  describe,
  it,
  before,
  after
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance | a4 - Démarrer un test |', function () {

  let application;

  before(function () {
    application = startApp();
  });

  after(function () {
    destroyApp(application);
  });

  before(function () {
    return visit('/home');
  });

  it('a4.1 Je peux démarrer un test depuis la liste des tests de la page d\'accueil', function() {
    const $startLink = findWithAssert('div[data-id="ref_course_id"] .start-button')[0];
    expect($startLink.text).to.contains('Démarrer le test');
    expect($startLink.href).to.contains('/courses/ref_course_id/assessment');
  });

  it('a4.2 Quand je démarre un test, je suis redirigé vers la première épreuve du test', function() {
    const $startLink = findWithAssert('div[data-id="ref_course_id"] .start-button')[0];
    return click($startLink).then(function() {
      findWithAssert('#assessment-challenge');
      expect(currentURL()).to.contains('/assessments/ref_assessment_id/challenges/ref_qcm_challenge_id');
    });
  });

});
