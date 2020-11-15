Lanark
======

Lanark is a PHP library for pulling data from the Glasgow Libraries catalogue.

It uses headless Chrome to scrape the library's Arena website (https://libcat.csglasgow.org/) and provides a (very very) simple interface to work with it programmatically.

# Requirements

* PHP 7
* Chrome, installed on the server ([see the Chrome-PHP docs](https://github.com/chrome-php/headless-chromium-php))


# Usage

Install with composer:
```
composer require abigegg/lanark
```

Use it like this:

```php
<?php 
require( 'vendor/autoload.php' ); 

use ABigEgg\Lanark;

// Pass the the path to your Chrome binary into the constructor
$client = new Lanark\Client( '/bin/chrome' );

// Now we can grab a book by its ISBN
$book = $client->getItemByISBN( '9781782117148' );

echo( $book->title ); // 'Lanark : a life in four books / Alasdair Gray'
echo( $book->author ); // 'Gray, Alasdair, 1934-'
echo( $book->year ); // '2016'
echo( $book->availability ); // '1' (the number of copies available to borrow) 


// That's it! (For now)
```

# Changelog
## [0.1.4] 15 Nov 2020

* Replace Goutte with Chrome driver, now book availability information works!

## [0.1.0] 14 Nov 2020

* Initial commit


# Planned features
* Search
    * Search by book title and author (keywords)
    * Search by book year of publication
    * Search by book genre
* Books
    * ~~Show if book currently available for loan, and from which libraries~~
    * Get summary and thumbnail from Google Books, if available
    * (If authenticated) reserve a book to borrow it
* Borrowing
    * Authenticate with Glasgow Libraries user ID and PIN
    * Get a list of your current reservations, and when they are due back