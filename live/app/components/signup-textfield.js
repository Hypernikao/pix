import Ember from 'ember';

const INPUT_VALIDATION_STATUS_MAP = {
  default: 'signup-textfield__input--default',
  error: 'signup-textfield__input--error',
  success: 'signup-textfield__input--success'
};

const ICON_TYPE_STATUS_MAP = {
  default: '',
  error: 'error',
  success: 'success'
};

export default Ember.Component.extend({
  classNames: ['signup-textfield'],

  label: '',
  validationStatus:'',
  textfieldName: '',
  validationMessage: '',
  _textfield: '',
  _validationMessage: '',


  hasIcon: Ember.computed('validationStatus', function(){
    return this.get('validationStatus') !== 'default';
  }),

  iconType: Ember.computed('validationStatus', function(){
    const inputValidationStatus = this.get('validationStatus');
    return ICON_TYPE_STATUS_MAP[inputValidationStatus] || '';
  }),

  inputValidationStatus: Ember.computed('validationStatus', function(){
    const inputValidationStatus = this.get('validationStatus');
    return INPUT_VALIDATION_STATUS_MAP[inputValidationStatus] || '';
  }),

  actions: {
    validate(){
      const inputValue = this.get('_textfield');
      this.sendAction('validate', inputValue);
    }
  }
});