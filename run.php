<?php 
require('vendor/autoload.php');

use ABigEgg\Lanark\Client;

$client = new Client( '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' );

// $i = 0;
// while( $i < 100 ) {
//     echo( 'Grabbing item...' );
//     $start = microtime(true);

//     $item = $c->getItemByISBN('9781403912657', true);

//     $end = microtime(true);
//     echo( ' took ' . ($end-$start) . " seconds \n\r" );
// }

