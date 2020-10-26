// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./Token.sol";

// TODO:
// [x] Set the fee
// [ ] Deposit Ether 
// [ ] Withdraw Ether 
// [ ] Deposit tokens 
// [ ] Withdraw tokens 
// [ ] Check Balances 
// [ ] Make order 
// [ ] Cancel order 
// [ ] Fill order
// [ ] Charge fees

contract Exchange {
    using SafeMath for uint;

    // Variables
    address public feeAccount; // the accoutn that receives exchange
    uint256 public feePercent; // the fee percentage
    mapping(address => mapping(address => uint256)) public tokens;

    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositToken(address _token, uint _amount) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        // Send tokens to this contract
        // Manage deposit - update balance 
        // Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
}
