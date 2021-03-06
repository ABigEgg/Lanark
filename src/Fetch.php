<?php 

namespace ABigEgg\Lanark;
use HeadlessChromium\BrowserFactory;


/**
 * Fetch class, to grab items from the library
 * Parts of this are adapted from https://github.com/LibrariesHacked/catalogues-api/blob/master/connectors/arena.js - cheers Dave!
 */
class Fetch {

    /**
     * Base endpoint
     *
     * @var string
     */
    protected $base_endpoint = 'https://libcat.csglasgow.org/web/arena/';
    
    /**
     * Search page
     *
     * @var string
     */
    protected $search_page = 'search?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_r_p_arena_urn%3Aarena_facet_queries=&p_r_p_arena_urn%3Aarena_search_query=[QUERY]&p_r_p_arena_urn%3Aarena_search_type=solr&p_r_p_arena_urn%3Aarena_sort_advice=field%3DRelevance%26direction%3DDescending';
   
    /**
     * All books page
     *
     * @var string
     */
    protected $all_books_page = 'search?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&_searchResult_WAR_arenaportlet__wu=%2FsearchResult%2F%3Fwicket%3Ainterface%3D%3A3%3AsearchResultPanel%3AcontainerNavigatorTop%3AnavigatorTop%3Anavigation%3A[PAGE]%3ApageLink%3A1%3AILinkListener%3A%3A';
    
        
    /**
     * Availability container URL
     *
     * @var string
     */
    protected $availability_container = 'results';

    /**
     * The fields we should grab for each item
     * These must exist in the .arena-record-details markup on the search results page
     *
     * @var array
     */
    protected $item_fields = [
        'title',
        'author',
        'isbn',
        'year'
    ];
    
    /**
     * Hold the class instance for our wee singleton
     *
     * @var Fetch
     */
    static protected $instance = null;
    
    /**
     * Browser to use
     *
     * @var mixed
     */
    protected $browser;

    function __construct() {
        $this->browser = $this->getBrowser();
    }
    
    /**
     * getInstance
     *
     * @return object
     */
    static function getInstance() {
        if ( isset( self::$instance ) ) {
            return self::$instance;
        }
        self::$instance = new self();

        return self::$instance;
    }
    
    /**
     * Helper function to get JavaScript array of fields we can grab
     *
     * @return void
     */
    private function getItemFieldArray() {
        $item_fields = Item::$fields;

        return "['" . implode( "','", $item_fields ) . "']";
    }
    
    /**
     * Get the browser instance, so we can re-use the same browser across requests
     *
     * @return void
     */
    private function getBrowser() {
        global $lanark_browser;
        global $lanark_chrome_location;

        $browser_factory = new BrowserFactory( $lanark_chrome_location );

        if ( ! isset( $lanark_browser ) ) {
            $lanark_browser = $browser_factory->createBrowser( [
                'headless' => true,
                'sendSyncDefaultTimeout' => 6000,
                'userAgent' => 'Mozilla/5.0 (compatible; Lanark; +https://github.com/abigegg/lanark)'
            ] );
        }

        return $lanark_browser;
    }
        
    /**
     * Call the Glasgow Libraries Arena catalogue and scrape the item given an ISBN.
     * To do this we execute a search on the search page URL and read the first result.
     * 
     * @param  mixed $isbn
     * @return array|false
     */
    public function itemFromISBN( $isbn, $with_availability = false ) {
        $page = $this->browser->createPage();
        $start = microtime();
        
        $url = str_replace( '[QUERY]', 'organisationId_index%3AAUK000048\|1+AND+number_index%3A' . $isbn, $this->base_endpoint . $this->search_page );   

        // load the search results page 
        $page->navigate( $url )->waitForNavigation();
        
        // load in jQuery
        $fields = $this->getItemFieldArray();

        $output = $page->evaluate("
        (function() {
            var first_item = $('.arena-record').first();
            var fields = $fields;

            var i;
            var out = {};

            for ( i in fields ) {
                var key = fields[i];
                out[key] = first_item.find('.arena-record-' + key + ' span').last().text();
            }

            out['item_page_url'] = first_item.find('.arena-record-title > a').attr('href');

            return out;
        })();
        ")->getReturnValue();

        if ( ! $output || $output['isbn'] !== $isbn ) {
            return false;
        }

        if ( ! $with_availability ) {
            $page->close();
            $end = microtime();
            $output['time'] = $end - $start;
            return $output;
        }

        // navigate to the item page so we can check availability
        $page->navigate( $output['item_page_url'] )->waitForNavigation();

        $found_availability = false;

        // wait for the stupid ajax thing to load so we can grab availability...
        $remaining_attempts = 5;
        while ( ! $found_availability ) {
            $result = $page->evaluate("
            (function() {
                if( ! $('.arena-holding-link').length ) {
                    console.log( $('.arena-holding-link').length );
                    return 'wait';
                }

                return $('.availableForLoan').length;
            })();
            ")->getReturnValue();

            if ( is_numeric( $result ) ) {
                $found_availability = true;
                $availability = $result;
            }

            $remaining_attempts--;

            if ( ! $remaining_attempts ) {
                $availability = null;
                break;
            }

            sleep(1);
        }

        $output['availability_count'] = $availability;
        
        $end = microtime();
        $output['time'] = $end - $start;
        $page->close();

        return $output;
    }
        
    /**
     * Search the library by given keywords and return the first page of results
     *
     * @param  mixed $keywords
     * @return array
     */
    public function keywordSearch( $keywords ) {
        $page = $this->browser->createPage();
        
        $url = str_replace( '[QUERY]', $keywords, $this->base_endpoint . $this->search_page ); 

        $fields = $this->getItemFieldArray();

        // load the search results page 
        $page->navigate( $url )->waitForNavigation();

        return $page->evaluate("
        (function() {
            var items = document.querySelectorAll('.arena-library-record');
            var fields = $fields;
            var out = [];

            for ( item of items ) {
                let item_out = {}
                for ( key of fields ) {
                    item_out[key] = $(item).find('.arena-record-' + key + ' span').last().text();
                }
                out.push(item_out);
            }

            return out;
        })();
        ")->getReturnValue();

        $page->close();
    }

}