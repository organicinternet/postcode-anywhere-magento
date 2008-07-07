var PostcodeAnywhere = Class.create();
PostcodeAnywhere.prototype = {
  
  initialize: function(address_prefix, object_prefix, insert_before) {
      this.address_prefix = address_prefix;
      this.object_prefix  = object_prefix;
      this.insert_before  = insert_before;
  },
  byPostcode: function() {
    postcode = $F('postcodeanywhere_' + this.object_prefix + '_postcode');
    if (postcode == '') {
      $('postcodeanywhere_' + this.object_prefix + '_postcode').addClassName('validation-failed');
      return false;
    }
    $('postcodeanywhere_' + this.object_prefix + '_postcode').removeClassName('validation-failed');
    new Ajax.Request('/postcodeanywhere/onepage/byPostcode', { 
      method: 'get',
      parameters: { postcode: postcode },
      onSuccess: this.updateResults.bind(this),
      onFailure: function() {
        alert('Address lookup failed');
      }
    });
  },
  byPostcodeId: function() {
    alert($F('postcode_lookup'));
  },
  fillAddress: function(address_id) {
    new Ajax.Request('/postcodeanywhere/onepage/fetchAddress', { 
      method: 'get',
      parameters: { address_id: address_id },
      onSuccess: this.updateAddress.bind(this),
      onFailure: function() {
        alert('Address lookup failed');
      }
    });
  },
  updateAddress: function(transport) {
    $(this.object_prefix + '-postcodeanywhere-results').replace('');
    result = transport.responseText.evalJSON().first();
    
    company = $(this.address_prefix + 'company')
    if (result.organisation_name) {
      company.value = result.organisation_name;
    }
    street1 = $(this.address_prefix + 'street1') || $(this.address_prefix + 'street_1');
    street2 = $(this.address_prefix + 'street2') || $(this.address_prefix + 'street_2');
    
    if (result.line3 == '') {
      street1.value = result.line1;
      street2.value = result.line2;
    } else {
        street1.value = result.line1 + ', ' + result.line2;
        street2.value = result.line3
        if (result.line4) {
          street2.value += ', ' + result.line4;
        }
    }
    $(this.address_prefix + 'city').value = result.post_town;
    postcode = $(this.address_prefix + 'postcode') || $(this.address_prefix + 'zip');
    postcode.value = result.postcode;
    
    country = $(this.address_prefix + 'country_id') || $(this.address_prefix + 'country');
    country.value = 'GB';
    
    $(this.address_prefix + 'region_id').hide();
    $(this.address_prefix + 'region').value = result.county;
    $(this.address_prefix + 'region').show();
    $(this.address_prefix + 'telephone').focus();
  },
  insertLookup: function() {
    new Insertion.Before(this.insert_before, '<li><h3 class="postcodeanywhere-heading">Quickly Lookup Your Address</h3></li>');
    new Insertion.Before(this.insert_before, '<li id="' + this.object_prefix + '-postcodeanywhere"></li>');
    new Insertion.Before(this.insert_before, '<li><h3 class="postcodeanywhere-heading">Or Enter Manually</h3></li>');
    pa_li = $(this.object_prefix + '-postcodeanywhere');
    new Insertion.Top(pa_li, '<label for="postcodeanywhere_' + this.object_prefix + '_postcode">Postcode</label> <input type="text" id="postcodeanywhere_' + this.object_prefix + '_postcode" name="postcodeanywhere_' + this.object_prefix + '_postcode" value="" size="9" /> <button class="form-button" onclick="' + this.object_prefix + 'PostcodeAnywhere.byPostcode(); return false;">Lookup Address</button>');
  },
  updateResults: function(transport) {
    if (!$(this.object_prefix + '-postcodeanywhere-results')) {
        new Insertion.Bottom($(this.object_prefix + '-postcodeanywhere'), '<ul id="' + this.object_prefix + '-postcodeanywhere-results"></ul>');
    }
    $(this.object_prefix + '-postcodeanywhere-results').innerHTML = '';
    results = transport.responseText.evalJSON();
    if (results[0].error_number) {
      new Insertion.Bottom(this.object_prefix + '-postcodeanywhere-results', '<li>' + results[0].message + '</li>');
    } else {
      for (i=0; i < results.size(); i++) {
        new Insertion.Bottom(this.object_prefix + '-postcodeanywhere-results', '<li><a href="#" onclick="' + this.object_prefix + 'PostcodeAnywhere.fillAddress(\'' + results[i].id + '\'); return false;">' + results[i].description + '</a></li>');
      }
    }
  }
  
}

Event.observe(window, 'load', function() {
  if (onepage_billing = $$('label[for="billing:street1"]')[0]) {
    billingPostcodeAnywhere = new PostcodeAnywhere('billing:', 'billing', onepage_billing.parentNode);
    billingPostcodeAnywhere.insertLookup();
  }
  
  if (onepage_shipping = $$('label[for="shipping:street1"]')[0]) {
    shippingPostcodeAnywhere = new PostcodeAnywhere('shipping:', 'shipping', onepage_shipping.parentNode);
    shippingPostcodeAnywhere.insertLookup();
  }

  if (multishipping = $$('label[for="street_1"]')[0]) {
    multishippingPostcodeAnywhere = new PostcodeAnywhere('', 'multishipping', multishipping.parentNode);
    multishippingPostcodeAnywhere.insertLookup();
  }
});

