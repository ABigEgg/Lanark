<?php 

namespace ABigEgg\Lanark;

use ABigEgg\Lanark\Item;

class Client {
    
    /**
     * Set up the class
     *
     * @param  mixed $chrome_location The location of the Chrome binary
     * @return void
     */
    function __construct( $chrome_location ) {
        global $lanark_chrome_location;
        $lanark_chrome_location = $chrome_location;
    }
    
    /**
     * Get an item from the catalogue by its ISBN number
     *
     * @param  mixed $isbn
     * @return ABigEgg\Lanark\Item|false
     */
    public function getItemByISBN( $isbn, $with_availability = true ) {
        $item = new Item( $isbn );

        return $item->load(true);
    }

    /**
     * Search the library for books containing given keywords
     *
     * @param  string $keywords
     * @return void
     */
    public function search( $keywords ) {
        return; 
    }

}