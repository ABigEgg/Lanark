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
<<<<<<< HEAD
// $item = $c->getItemByISBN('9781403912657', true);

// var_dump( $item );
// var_dump( $item->availability );
$item = $client->getItemByISBN("9781787300521");

var_dump( $item );

$items = $client->search( 'hitchhikers guide' );

var_dump( $items );

var_dump( $items[0]->getAvailability() );
=======

$book = $c->getItemByISBN( '9781782117148' );

echo( $book->title ); // 'Lanark : a life in four books / Alasdair Gray'
echo( $book->author ); // 'Gray, Alasdair, 1934-'
echo( $book->year ); // '2016'
echo( $book->availability ); // '1' (the number of copies available to borrow) 
>>>>>>> main
