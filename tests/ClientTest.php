<?php 

namespace ABigEgg\Lanark\Tests;

use PHPUnit\Framework\TestCase;
use ABigEgg\Lanark\Client;
use ABigEgg\Lanark\Item;

class ClientTest extends TestCase {
    public function testCanGetItemByIsbn() {
    
        $client = new Client();

        // The book we are testing with is 
        //
        // Orwell on Truth
        // year: 2017
        // ISBN: 9781787300521
        $item = $client->getItemByISBN("9781787300521");

        $this->assertInstanceOf( Item::class, $item );
        $this->assertTrue( $item->year == 2017 ); 
    }

    public function testCannotGetItemByInvalidIsbn() {
        $client = new Client();
        $item = $client->getItemByISBN("xq3tae9j");

        $this->assertFalse( $item );
    }

    public function testCanGetItemsBySearching() {
        $client = new Client();
        $items = $client->search('Orwell');

        $this->assertStringContainsStringIgnoringCase( 'orwell', $items[0]->title );
    }

    public function testCanLoadItemAvailability() {
        $client = new Client();
        $items = $client->search('Chickens');

        $this->assertIsNumeric( $items[0]->getAvailability() );
    }

    public function testCannotSearchForNonExistentItem() {
        $client = new Client();
        $items = $client->search('3qag9ake9kha');

        $this->assertEmpty( $items );
    }
}