<?php 

namespace ABigEgg\Lanark;
use Goutte\Client as GClient;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\BrowserKit\CookieJar;

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
    protected $search_page = 'search?p_p_id=searchResult_WAR_arenaportlet&p_p_lifecycle=1&p_p_state=normal&p_r_p_arena_urn%3Aarena_facet_queries=&p_r_p_arena_urn%3Aarena_search_query=organisationId_index%3AAUK000048\|1+AND+number_index%3A[ITEM]&p_r_p_arena_urn%3Aarena_search_type=solr&p_r_p_arena_urn%3Aarena_sort_advice=field%3DRelevance%26direction%3DDescending';
   
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
     * Gautte client
     *
     * @var mixed
     */
    protected $client;

    function __construct()
    {
        $this->client = new GClient();
    }
        
    /**
     * Call the Glasgow Libraries Arena catalogue and scrape the item given an ISBN.
     * To do this we execute a search on the search page URL and read the first result.
     * 
     * @param  mixed $isbn
     * @return array|false
     */
    public function itemFromISBN( $isbn, $with_availability = false ) {
        // fetch the item from the Glasgow libraries system (Arena)
        $url = str_replace( '[ITEM]', $isbn, $this->base_endpoint . $this->search_page );

        $crawl = $this->client->request( 'GET', $url );

        $item_list = $crawl->filter( '.arena-record-details' );

        if ( count( $item_list ) == 0 ) {
            return false; // no such item
        }

        $first_item = $item_list->first();

        $output = [];

        foreach ( $this->item_fields as $key ) {
            $output[$key] = $first_item->filter( '.arena-record-' . $key . ' span' )
                ->last()
                ->text();
        }

        if ( $with_availability || 1 ) {
            $single_item_url = $first_item->filter( '.arena-record-title a' )
                ->first()
                ->attr('href');


            $this->getItemAvailability( $single_item_url );
        }

        return $output;
    }
    
    /**
     * availability
     *
     * @param  mixed $isbn
     * @return void
     */
    private function getItemAvailability( $single_item_url ) {
        // load the item page so the correct cookie gets set
        $crawl = $this->client->request( 'GET', $single_item_url );

        $headers = [
            'Accept' => 'text/xml', 
            'Wicket-Ajax' => true,
            'Content-Type' => 'application/x-www-form-urlencoded',
        ];

        // gautte is a bit fiddly with Post requests - info here: https://stackoverflow.com/posts/33822001/revisions
        $postdata = [
            'p_p_id=crDetailWicket_WAR_arenaportlet',
            'p_p_lifecycle=2',
            'p_p_state=normal',
            'p_p_mode=view',
            'p_p_resource_id=/crDetailWicket/?wicket:interface=:3:recordPanel:holdingsPanel::IBehaviorListener:0:',
            'p_p_cacheability=cacheLevelPage',
        ];

        $content = implode( '&', $postdata );

        $url = $this->base_endpoint . $this->availability_container . '?random=' . mt_rand() / mt_getrandmax();

        $crawl = $this->client->request( 'POST', $url, [], [], $headers, $content );

        var_dump( $crawl->getHeaders() );
    }

}