// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Storage {
    uint8 public num = 254;

    string message = "Hello";

    function getCurrentBalance() public view returns (uint256 balance) {
        balance = address(this).balance;
    }

    function setMessage(string memory newMessage)
        public
        returns (string memory)
    {
        message = newMessage;
        // не будет работать
        return message;
    }

    fallback() external {}

    receive() external payable {}
}
