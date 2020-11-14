<?php 

namespace Lanark\Tests;

use PHPUnit\Framework\TestCase;
use Lanark\Lanark;
use Lanark\Item;


class LanarkTest extends TestCase {
    public function testCanGetItemByIsbn() {
        $client = new Lanark();

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
        $client = new Lanark();
        $item = $client->getItemByISBN("xq3tae9j");

        $this->assertFalse( $item );
    }
}