# The ideal library API

When designing APIs it's often good to write the code that you would _like_ to use, even if it won't run because it exist yet. 

What would the ideal interface to the library be? Here are some sketches.

## Use case: I want to search for a book by its name, and get its title, author and availability

```
<?php
use ABigEgg\Lanark\Catalogue;

$books = Catalogue::search('Animal Farm');

// $books is an array of Book items.

$first_book = $books[0];
echo $first_book->title; // 'Animal Farm'
echo $first_book->authors; // [ 'George Orwell' ]
echo $first_book->year; // 2020 (it's a new edition)
echo $first_book->available; // 1

// Notes:
// - Some books might have more than one author, so $book->authors is an array)
```

## Use case: I want to find a book by its ISBN

```
use ABigEgg\Lanark\Catalogue;

$book = Catalogue::findByISBN("978-0141182704");

echo $book->title // 'Animal Farm'
```

## Use case: I want to reserve a book

```
use ABigEgg\Lanark\Catalogue;

$book = Catalogue::findByISBN("978-0141182704");

if ( $book->available ) {
    $response = $book->reserve(); 

    var_dump( $response ); 
    // Reservation {
    //   date => 2020-12-01 // the date the book was reserved
    //   successful => true // did the reservation go through?
    //   branch => "Hillhead Library" // maybe some kind of Branch object here
    // }
}
```