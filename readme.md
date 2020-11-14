Lanark
======

Lanark is a PHP library for pulling data from the Glasgow Libraries catalogue. 

It scrapes the library's Arena website (https://libcat.csglasgow.org/) and provides a simple interface to work with it programmatically.

## Usage

Require the library to your PHP project using Composer:

`composer require abigegg\lanark`

You can use it in your code like this:

```
<?php 
use ABigEgg\Lanark

$client = new Lanark();

// grab an item by its ISBN
$item = $client->getItemByISBN("9781787300521");

var_dump( $item );

// object(Lanark\Item)#21 (5) {
//     ["title"]=>
//     string(30) "Orwell on truth, George Orwell"
//     ["author"]=>
//     string(25) "Orwell, George, 1903-1950"
//     ["isbn"]=>
//     string(13) "9781787300521"
//     ["available"]=>
//     bool(false)
//     ["year"]=>
//     string(4) "2017"
//   }
}
```


## Stuff that works currently
* `getItemByISBN('[ISBN]')` Get book details by ISBN (title, author, year of publication)

## Future features
* Search
    * Search by book title and author (keywords)
    * Search by book year of publication
    * Search by book genre
* Books
    * Show if book currently available for loan, and from which libraries
    * Get summary and thumbnail from Google Books, if available
    * (If authenticated) reserve a book to borrow it
* Borrowing
    * Authenticate with Glasgow Libraries user ID and PIN
    * Get a list of your current reservations, and when they are due back