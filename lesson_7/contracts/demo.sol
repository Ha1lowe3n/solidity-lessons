// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Storage {
    address owner;

    event Paid(address indexed _sender, uint256 _amount, uint256 _timestamp);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        pay();
    }

    function pay() public payable {
        emit Paid(msg.sender, msg.value, block.timestamp);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not an owner");
        _;
        // Будут выполняться после работы функции
        // require(...);
    }

    function withdrawMoney(address payable _to) external onlyOwner {
        require(msg.sender == owner, "you are not an owner");
        _to.transfer(address(this).balance);

        // if (msg.sender != owner) {
        //     revert("you are not an owner");
        // }
    }
}
