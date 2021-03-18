// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

contract Book {

	struct BookStatus {	
        bool available;
        address borrower;
    }

	address public ownerAddress;
	mapping (uint => address) bookBorrowers;
	mapping (uint => bool) booksAvailable;
	
	event Borrowed(uint bookId, address indexed borrowedBy);
	event Returned(uint bookId, address indexed returnedBy);

	constructor() public {
		ownerAddress = msg.sender;
	}

	function borrowBook(uint bookId) public returns(bool successful) {
		require(bookBorrowers[bookId] == address(0));
		require(booksAvailable[bookId]);
		bookBorrowers[bookId] = msg.sender;
		emit Borrowed(bookId, msg.sender);
		return true;
	}

	function returnBook(uint bookId) public returns(bool successful) {
		// Only the person who borrowed the book can return it.
		// The owner (librarian) can also force a book to be returned
		require(bookBorrowers[bookId] == msg.sender || ownerAddress == msg.sender);
		bookBorrowers[bookId] = address(0);
		emit Returned(bookId, msg.sender);
		return true;
	}

	// Only the owner (librarian) can mark a book as available to be borrowed
	function setBookAvailable(uint bookId, bool available) public {
		require(ownerAddress == msg.sender);
		booksAvailable[bookId] = available;
	}

	function getBookStatus(uint bookId) public view returns(bool available, address borrower) {
		return (booksAvailable[bookId], bookBorrowers[bookId]);
	}
}
