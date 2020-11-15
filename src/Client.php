<?php 

namespace ABigEgg\Lanark;

use ABigEgg\Lanark\Item;

class Client {
    
    /**
     * Get an item from the catalogue by its ISBN number
     *
     * @param  mixed $isbn
     * @return ABigEgg\Lanark\Item|false
     */
    public static function getItemByISBN( $isbn ) {
        $item = new Item( $isbn );

        return $item->load();
    }

    // public function 

    // public function getAllBooks( $page ) {

    // }

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