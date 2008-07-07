<?php

require_once 'Mage/Checkout/controllers/OnepageController.php';

class OrganicInternet_PostcodeAnywhere_OnepageController extends Mage_Checkout_OnepageController
{
	protected function getAddressLookup() {
		return Mage::getModel('postcodeanywhere/address');
	}
	public function byPostcodeAction()
    {
	    $postcode = $this->getRequest()->getQuery('postcode');
        $responseJson = $this->getAddressLookup()->byPostcode($postcode);
        $this->getResponse()->setBody($responseJson);
    }
	public function fetchAddressAction()
    {
	    $address_id = $this->getRequest()->getQuery('address_id');
        $responseJson = $this->getAddressLookup()->fetchAddress($address_id);
        $this->getResponse()->setBody($responseJson);
    }
}