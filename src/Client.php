<?php 

namespace ABigEgg\Lanark;

use ABigEgg\Lanark\Fetch;
use ABigEgg\Lanark\Item;

class Client {
    
    /**
     * fetch
     *
     * @var mixed
     */
    protected $fetch;
    
    /**
     * Set up the class
     *
     * @param  mixed $chrome_location The location of the Chrome binary
     * @return void
     */
    function __construct( $chrome_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ) {
        global $lanark_chrome_location; // this is smelly
        $lanark_chrome_location = $chrome_location;
    }
    
    /**
     * Get an item from the catalogue by its ISBN number
     *
     * @param  mixed $isbn
     * @return ABigEgg\Lanark\Item|false
     */
    public function getItemByISBN( $isbn ) {
        $item = new Item( $isbn );

        return $item->load();
    }

    /**
     * Search the library for books containing given keywords
     *
     * @param  string $keywords
     * @return void
     */
    public function search( $keywords ) {
        $fetch = Fetch::getInstance();
        $items = $fetch->keywordSearch( $keywords );

        if ( ! count( $items ) ) {
            return [];
        }

        $out = [];
        foreach ( $items as $item ) {
            $out[] = new Item( $item['isbn'], $item['title'], $item['author'], $item['year'] );
        }

        return $out;
    }

}