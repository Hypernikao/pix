import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['signup-form'],

  actions: {
    validate(){

    },

    signup(){
      this.sendAction('signup');
    }
  }
});
