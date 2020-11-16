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
     * This is used internally and exposed via $item->availability (see __get() below)
     *
     * @var int
     */
    protected $availability_count = null;
    
    /**
     * year
     *
     * @var mixed
     */
    public $year = null;

    /**
     * Item page URL
     *
     * @var mixed
     */
    public $item_page_url = null;
    
    /**
     * Fields we can grab from the library catalogue
     *
     * @var array
     */
    static public $fields = [
        'isbn',
        'title',
        'author',
        'year',
        'item_page_url'
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
    }
    
    /**
     * Returns how many of this item are available to borrow
     *
     * @return int
     */
    public function getAvailability() {
        if ( is_null( $this->availability_count ) ) {
            $this->load( true );
        }
        
        return $this->availability_count;
    }

    /**
     * Load the item data from the API
     *
     * @param  bool $with_availability Should we load the availability data too? This takes longer as it requires an extra request
     * @return void
     */
    public function load( $with_availability = false ) {
        $fetch = Fetch::getInstance();

        $fields = $fetch->itemFromISBN( $this->isbn, $with_availability );

        if ( ! is_array( $fields ) ) {
            return false; // it doesnae work!
        }

        $fields_to_grab = self::$fields;
        $fields_to_grab[] = 'availability_count'; // we use this internally, it's not on the search result page

        foreach ( $fields as $key => $value ) {
            if ( in_array( $key, $fields_to_grab ) ) {
                $this->$key = $value;
            }
        }

        return $this;
    }

}