import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Route | challenges.get-preview', function() {

  setupTest('route:challenges.get-preview', {});

  it('exists', function() {
    const route = this.subject();
    expect(route).to.be.ok;
  });

});
