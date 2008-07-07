<?php

class OrganicInternet_PostcodeAnywhere_Model_Address extends Mage_Core_Model_Abstract
{
    protected function _construct()
    {
        $this->_init('postcodeanywhere/address');
    }

    /**
     *  [{"id":"26742626.00","seq":"0","description":"Arthur Amos Associates Pool House Elgar Business Centre Moseley Road Hallow Worcester"},
     *  {"id":"26742646.00","seq":"1","description":"Microtrol Ltd Unit 16 Elgar Business Centre Moseley Road Hallow Worcester"},
     *  {"id":"26742648.00","seq":"2","description":"Moseley Saw Mills Moseley Road Hallow Worcester"},
     *  {"id":"26742650.00","seq":"3","description":"O P M Unit 3 Elgar Business Centre Moseley Road Hallow Worcester"},
     *  {"id":"26742632.00","seq":"4","description":"Postcode Anywhere (Europe) Ltd Enigma House Elgar Business Centre Moseley Road Hallow Worcester"}],
     */
    public function byPostcode($postcode) {
        $url = $this->getByPostcodeUrl($postcode);
        return file_get_contents($url);
    }

    /**
     * [{"id":"26742632.00","seq":"0","organisation_name":"Postcode Anywhere (Europe) Ltd","department_name":"","line1":"Enigma House","line2":"Elgar Business Centre","line3":"Moseley Road","line4":"Hallow","line5":"","post_town":"Worcester","county":"Worcestershire","postcode":"WR2 6NJ","mailsort":"31441","barcode":"(WR26NJ3UT)","is_residential":"0","is_small_organisation":"1","is_large_organisation":"0","delivery_point_suffix":"3U","checksum":"T","name_or_number":"Enigma House, Elgar Business Centre","sub_building_name":"Enigma House","building_name":"Elgar Business Centre","building_number":"","thoroughfare_name":"Moseley","thoroughfare_descriptor":"Road","dependent_thoroughfare_name":"","dependent_thoroughfare_descriptor":"","double_dependent_locality":"","dependent_locality":"Hallow","po_box_number":"","number_of_households":"1","concatenation_operator":"","building_name_or_number":"Enigma House, Elgar Business Centre","building_flat":"","reformatted_sub_building":"Enigma House","reformatted_building_number":"","reformatted_building_name":"Elgar Business Centre","grid_east_m":"381600","grid_north_m":"259400","district_code":"UC","ward_code":"47UCHW","nhs_code":"Q34","nhs_region_code":"Y22","county_code":"47","country_code":"064","ward_status":"1","ward_name":"Hallow","district_name":"Malvern Hills","objective_2":"0","objective_2_region":"","transitional":"0","longitude":"-2.26944577720795","latitude":"52.2320908057157","os_reference":"SO 81600 59400","wgs84_longitude":"-2.27085194652203","wgs84_latitude":"52.2324509404787","constituency_code":"505","constituency":"West Worcestershire","mp":"Sir Michael Spicer","party":"Conservative","county_name":"Worcestershire","country_name":"England","lea_code":"885","lea_name":"Worcestershire","nhs_name":"West Midlands Strategic Health Authority","nhs_region_name":"Midlands and Eastern","nhs_pct_code":"5PL","nhs_pct_name":"Worcestershire PCT","go_code":"F","go_name":"West Midlands"}]
     */
    public function fetchAddress($address_id) {
        $url = $this->getFetchAddressUrl($address_id);
        return file_get_contents($url);
    }

    public function getRequestUrl() {
        return 'http://services.postcodeanywhere.co.uk/json.aspx';
    }
    
    public function getByPostcodeUrl($postcode) {
        return $this->getRequestUrl().'?action=lookup&type=by_postcode&'.$this->getAccountParameters().'&postcode=' . urlencode($postcode);
    }
    
    public function getFetchAddressUrl($postcode_id) {
        return $this->getRequestUrl().'?action=fetch&style=rawgeographic&'.$this->getAccountParameters().'&id=' . urlencode($postcode_id);
    }
    
    public function getAccountParameters() {
        return 'account_code=' . urlencode(Mage::getStoreConfig('postcodeanywhere/sales/accountcode')) . '&' .
               'license_code=' . urlencode(Mage::getStoreConfig('postcodeanywhere/sales/licensecode'));
    }
}