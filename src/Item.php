<?php 

namespace ABigEgg\Lanark;

class Item {
    
    /**
     * Item (probably a book) title
     *
     * @var string
     */
    public $title;

    /**
     * Author name
     *
     * @var string
     */
    public $author;

    
    /**
     * ISBN number
     *
     * @var string
     */
    public $isbn;

    /**
     * How many copies of this item are available?
     *
     * @var int
     */
    public $available;
    
    /**
     * year
     *
     * @var mixed
     */
    public $year;
    
    /**
     * __construct
     *
     * @return void
     */
    function construct() {
        
    }

}