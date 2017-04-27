import Ember from 'ember';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import _ from 'pix-live/utils/lodash-custom';

const LINK_VIEW = '.feedback-panel__view--link';
const FORM_VIEW = '.feedback-panel__view--form';
const MERCIX_VIEW = '.feedback-panel__view--mercix';
const OPEN_LINK = '.feedback-panel__open-link';
const BUTTON_SEND = '.feedback-panel__button--send';
const BUTTON_CANCEL = '.feedback-panel__button--cancel';

function expectLinkViewToBeVisible(component) {
  expect(component.$(LINK_VIEW)).to.have.length(1);
  expect(component.$(FORM_VIEW)).to.have.length(0);
  expect(component.$(MERCIX_VIEW)).to.have.length(0);
}

function expectFormViewToBeVisible(component) {
  expect(component.$(LINK_VIEW)).to.have.length(0);
  expect(component.$(FORM_VIEW)).to.have.length(1);
  expect(component.$(MERCIX_VIEW)).to.have.length(0);
}

function expectMercixViewToBeVisible(component) {
  expect(component.$(LINK_VIEW)).to.have.length(0);
  expect(component.$(FORM_VIEW)).to.have.length(0);
  expect(component.$(MERCIX_VIEW)).to.have.length(1);
}

describe('Integration | Component | feedback-panel', function () {

  setupComponentTest('feedback-panel', {
    integration: true
  });

  describe('Default rendering', function () {

    it('should display the feedback Panel', function () {
      // when
      this.render(hbs`{{feedback-panel}}`);
      // then
      expect(this.$()).to.have.length(1);
      expectLinkViewToBeVisible(this);
    });

  });

  describe('Link view (available only when form is closed by default)', function () {

    beforeEach(function () {
      this.render(hbs`{{feedback-panel}}`);
    });

    it('should display only the "link" view', function () {
      expectLinkViewToBeVisible(this);
    });

    it('the link label should be "Signaler un problème"', function () {
      expect(this.$(OPEN_LINK).text()).to.contains('Signaler un problème');
    });

    it('clicking on the open link should hide the "link" view and display the "form" view', function () {
      // when
      this.$(OPEN_LINK).click();
      // then
      expectFormViewToBeVisible(this);
    });

  });

  describe('Form view', function () {
    let didReceiveSaveAction = false;
    let feedbackToSave = null;

    beforeEach(function () {
      // configure answer & cie. model object
      const assessment = Ember.Object.extend({ id: 'assessment_id' }).create();
      const challenge = Ember.Object.extend({ id: 'challenge_id' }).create();

      // define actions
      this.set('stubSaveFeedback', (feedback) => {
        didReceiveSaveAction = true;
        feedbackToSave = feedback;
        return Ember.RSVP.resolve();
      });

      // render component
      this.set('assessment', assessment);
      this.set('challenge', challenge);
      this.render(hbs`{{feedback-panel assessment=assessment challenge=challenge default_status='FORM_OPENED' save=(action stubSaveFeedback)}}`);
    });

    it('should display only the "form" view', function () {
      expectFormViewToBeVisible(this);
    });

    it('should contain email input field', function () {
      const $email = this.$('input.feedback-panel__field--email');
      expect($email).to.have.length(1);
      expect($email.attr('placeholder')).to.equal('Votre email (optionnel)');
    });

    it('should contain content textarea field', function () {
      const $password = this.$('textarea.feedback-panel__field--content');
      expect($password).to.have.length(1);
      expect($password.attr('placeholder')).to.equal('Votre message');
    });

    it('should contain "send" button with label "Envoyer" and placeholder "Votre email (optionnel)"', function () {
      const $buttonSend = this.$(BUTTON_SEND);
      expect($buttonSend).to.have.length(1);
      expect($buttonSend.text()).to.equal('Envoyer');
    });

    it('clicking on "send" button should save the feedback into the store / API and display the "mercix" view', function () {
      // given
      const CONTENT_VALUE = 'Prêtes-moi ta plume, pour écrire un mot';
      const EMAIL_VALUE = 'myemail@gemail.com';
      const $content = this.$('.feedback-panel__field--content');
      const $email = this.$('.feedback-panel__field--email');
      $content.val(CONTENT_VALUE);
      $email.val(EMAIL_VALUE);
      $content.change();
      $email.change();

      // when
      this.$(BUTTON_SEND).click();

      // then
      return wait().then(() => {
        expect(didReceiveSaveAction).to.be.true;
        expect(_.isObject(feedbackToSave)).to.equal(true);
        expect(feedbackToSave.get('assessement')).to.exists;
        expect(feedbackToSave.get('challenge')).to.exists;
        expect(feedbackToSave.get('content')).to.equal(CONTENT_VALUE);
        expect(feedbackToSave.get('email')).to.equal(EMAIL_VALUE);
        expectMercixViewToBeVisible(this);
      });
    });

    it('should not contain "cancel" button if the feedback form is opened by default', function () {
      // then
      const $buttonCancel = this.$(BUTTON_CANCEL);
      expect($buttonCancel).to.have.length(0);
    });
  });

  describe('#Cancel Button available only if the feedback panel is closed by default', function () {

    beforeEach(function () {
      // configure answer & cie. model object
      const assessment = Ember.Object.extend({ id: 'assessment_id' }).create();
      const challenge = Ember.Object.extend({ id: 'challenge_id' }).create();

      // render component
      this.set('assessment', assessment);
      this.set('challenge', challenge);
      this.render(hbs`{{feedback-panel assessment=assessment challenge=challenge}}`);
    });

    it('should contain "cancel" button with label "Annuler" and placeholder "Votre message"', function () {
      //when
      this.$(OPEN_LINK).click();

      //then
      const $buttonCancel = this.$(BUTTON_CANCEL);
      expect($buttonCancel).to.have.length(1);
      expect($buttonCancel.text()).to.equal('Annuler');
    });

    it('clicking on "cancel" button should close the "form" view and and display the "link" view', function () {
      // when
      this.$(BUTTON_CANCEL).click();
      // then
      expectLinkViewToBeVisible(this);
    });

  });

  describe('Mercix view', function () {

    beforeEach(function () {
      this.render(hbs`{{feedback-panel default_status='FORM_SUBMITTED'}}`);
    });

    it('should display only the "mercix" view', function () {
      expectMercixViewToBeVisible(this);
    });
  });

  describe('Error management', function () {

    it('should display error if "content" is blank', function () {
      // given
      this.render(hbs`{{feedback-panel default_status='FORM_OPENED'}}`);
      this.$('.feedback-panel__field--content').val('   ');
      this.$('.feedback-panel__field--content').change();

      // when
      this.$(BUTTON_SEND).click();

      // then
      expect(this.$('.alert')).to.have.length(1);
      expectFormViewToBeVisible(this);
    });

    it('should display error if "email" is set but invalid', function () {
      // given
      this.render(hbs`{{feedback-panel default_status='FORM_OPENED' _content='Lorem ipsum dolor sit amet'}}`);
      this.$('.feedback-panel__field--email').val('wrong_email');
      this.$('.feedback-panel__field--email').change();

      // when
      this.$(BUTTON_SEND).click();

      expect(this.$('.alert')).to.have.length(1);
      expectFormViewToBeVisible(this);
    });

    it('should not display error if "form" view (with error) was closed and re-opened', function () {
      // given
      this.render(hbs`{{feedback-panel}}`);
      this.$(OPEN_LINK).click();
      this.$('.feedback-panel__field--content').val('   ');
      this.$('.feedback-panel__field--content').change();
      this.$(BUTTON_SEND).click();
      expect(this.$('.alert')).to.have.length(1);

      // when
      this.$(BUTTON_CANCEL).click();
      this.$(OPEN_LINK).click();

      // then
      expect(this.$('.alert')).to.have.length(0);
    });

  });
});
