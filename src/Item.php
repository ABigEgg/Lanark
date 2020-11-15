<?php 

namespace ABigEgg\Lanark;
use ABigEgg\Lanark\Fetch;

class Item {
    
    /**
     * Item (probably a book) title
     *
     * @var string
     */
    public $title = null;

    /**
     * Author name
     *
     * @var string
     */
    public $author = null;

    
    /**
     * ISBN number
     *
     * @var string
     */
    public $isbn = null;

    /**
     * How many copies of this item are available?
     *
     * @var int
     */
    public $availability = null;
    
    /**
     * year
     *
     * @var mixed
     */
    public $year = null;

        
    /**
     * is_loaded
     *
     * @var bool
     */
    protected $is_loaded = false;
    
    /**
     * fetch
     *
     * @var mixed
     */
    protected $fetch = false;

    protected $fields = [
        'isbn',
        'title',
        'author',
        'year',
        'availability'
    ];
        
    /**
     * Construct the Item object
     *
     * @param  mixed $isbn
     * @param  mixed $title
     * @param  mixed $author
     * @param  mixed $year
     * @return void
     */
    function __construct( $isbn, $title = false, $author = false, $year = false ) {
        $this->isbn = $isbn;
        $this->title = $title;
        $this->author = $author;
        $this->year = $year;

        // set up our item fetcher class
        $this->fetch = new Fetch();
    }
    
    /**
     * Has this item been pulled down from the API, or is it just an empty item with an ISBN?
     *
     * @return void
     */
    public function isLoaded() {
        return $this->is_loaded;
    }

    /**
     * Load the item data from the API
     *
     * @param  bool $with_availability Should we load the availability data too?
     * @return void
     */
    public function load( $with_availability = true ) {
        if ( $this->is_loaded ) {
            return true;
        }

        $fields = $this->fetch->itemFromISBN( $this->isbn, true );

        if ( ! is_array( $fields ) ) {
            return false; // it doesnae work!
        }

        foreach ( $fields as $key => $value ) {
            if ( in_array( $key, $this->fields ) ) {
                $this->$key = $value;
            }
        }

        $this->is_loaded = true;

        return $this;
    }

}