<?php 

namespace Lanark;
use Goutte\Client;

use Lanark\Item;

class Lanark {
    
    /**
     * base_endpoint
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
     * Get an item from the catalogue by its ISBN number
     *
     * @param  mixed $isbn
     * @return void
     */
    public function getItemByISBN( $isbn ) {
      
        // fetch the item from the Glasgow libraries system (Arena)
        $client = new Client();
        $url = str_replace( '[ITEM]', $isbn, $this->base_endpoint . $this->search_page );

        $crawl = $client->request( 'GET', $url );

        $item_list = $crawl->filter( '.arena-record-details' );

        if ( count( $item_list ) == 0 ) {
            return false; // no such item
        }

        // create a new item and fill it up
        $item = new Item();

        $first_item = $item_list->first();

        // TODO - have an array of fields and loop through the markup cleanly
        $item->title = $first_item->filter( '.arena-record-title' )->first()->text();
        $item->year = $first_item->filter( '.arena-record-year .arena-value' )->first()->text();
        $item->author = $first_item->filter( '.arena-record-author .arena-value' )->first()->text(); // only one author supported for now
        $item->isbn = $first_item->filter( '.arena-record-isbn .arena-value' )->first()->text();

        /*
         * we can't show the availability for now because Arena uses JavaScript to load in 
         * the holdings information... we could re-implement this client using 
         * a headless browser to execute JavaScript on the page 
         */
        $item->available = false;

        return $item;
    }

}