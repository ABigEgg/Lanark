<?php 
require('vendor/autoload.php');

use ABigEgg\Lanark\Client;

$c = new Client( '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' );

// $i = 0;
// while( $i < 100 ) {
//     echo( 'Grabbing item...' );
//     $start = microtime(true);

//     $item = $c->getItemByISBN('9781403912657', true);

//     $end = microtime(true);
//     echo( ' took ' . ($end-$start) . " seconds \n\r" );
// }

$book = $c->getItemByISBN( '9781782117148' );

echo( $book->title ); // 'Lanark : a life in four books / Alasdair Gray'
echo( $book->author ); // 'Gray, Alasdair, 1934-'
echo( $book->year ); // '2016'
echo( $book->availability ); // '1' (the number of copies available to borrow) 
