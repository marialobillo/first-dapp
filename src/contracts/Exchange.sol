pragma solidity >=0.4.22 <0.8.0;

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
    // Variables
    address public feeAccount; // the accoutn that receives exchange
    uint256 public feePercent; // the fee percentage

    constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositToken(address _token, uint _amount) public {
        Token(_token).transferFrom(msg.sender, address(this), _amount);
        // Send tokens to this contract
        // Manage deposit - update balance 
        // Emit event
    }
}
