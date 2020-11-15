<?php 

use ABigEgg\Lanark\Client;

require('vendor/autoload.php');

$c = new Client();

var_dump( $c->getItemByISBN('9781403912657')->withAvailability() );
