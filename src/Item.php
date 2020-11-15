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
    public $available = null;
    
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
     * availability_is_loaded
     *
     * @var bool
     */
    protected $availability_is_loaded = false;
        
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
     * Has this item's availability been pulled down from the API?
     *
     * @return void
     */
    public function availabilityIsLoaded() {
        return $this->availability_is_loaded;
    }
    
    /**
     * Instance of the Fetch class which we will use to grab item info
     *
     * @var mixed
     */
    protected $fetch;
 
    /**
     * Load the item data from the API
     *
     * @param  bool $with_availability Should we load the availability data too?
     * @return void
     */
    public function load() {
        if ( $this->is_loaded ) {
            return true;
        }

        $fields = $this->fetch->itemFromISBN( $this->isbn );

        if ( ! is_array( $fields ) ) {
            return false; // it doesnae work!
        }

        foreach ( $fields as $key => $value ) {
            if ( property_exists( $this, $key ) ) {
                $this->$key = $value;
            }
        }

        $this->is_loaded = true;

        return $this;
    }
    
    /**
     * Load the item's availability from the Glasgow Libraries API
     *
     * @return void
     */
    public function loadAvailability() {
        if ( $this->availability_is_loaded ) {
            return $this;
        }

        // return $this->fetch->itemAvailability();
    }
    
    /**
     * Fluency alias of loadAvailability() to allow us to chain methods to get item availability
     *
     * @return void
     */
    public function withAvailability() {
        // return $this->loadAvailability();
    }

}