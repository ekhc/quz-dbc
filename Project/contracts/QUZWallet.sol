pragma solidity ^0.4.25;


/**
 * @title MultiOwnable
 * @dev Ownership of the each user's QUZWallet
 */
contract MultiOwnable {
    
  mapping(address => bool) internal owners;
  address internal privilegedUser;
  
  event OwnershipRenounced(
      address indexed previousUser,
      address indexed newUser
  );

  constructor(address[] _initOwners) public {
    for(uint i=0; i < _initOwners.length; i++) 
        owners[_initOwners[i]] = true;
  }

  modifier privilegedOwner() {
    require(owners[msg.sender] || privilegedUser == msg.sender);
    _;
  }
  
  modifier onlyMultiOwner() {
    require(owners[msg.sender]);
    _;
  }
  
  function addOwner(address _newOwner) public onlyMultiOwner {
      require(_newOwner != address(0) && !owners[_newOwner]);
      
      owners[_newOwner] = true;
  }

  function removeOwner(address _owner) public onlyMultiOwner {
    require(_owner != address(0)  && owners[msg.sender]);
    owners[_owner] = false;
  }

  function renounceUserOwnership(address _newPrivileged) public privilegedOwner {
    emit OwnershipRenounced(msg.sender, _newPrivileged);
    privilegedUser = _newPrivileged;
  }
  
  function getPrivildgedUser() public view onlyMultiOwner returns (address) {
      return privilegedUser;
  }
  
  function getOwnerOf(address _owner) public view onlyMultiOwner returns (bool) {
      return owners[_owner];
  }
  
}

/**
 * @title QUZCoin Receiver
 */
contract QUZReceiver {
    enum QUZReceiveType { QUZ_TRANSFER, QUZ_MINT, QUZ_BURN }
    function onQUZReceived(address owner, address spender, uint256 value, QUZReceiveType receiveType) public returns (bool);
}

contract QUZWallet is MultiOwnable, QUZReceiver {

    event CallEvent(
        address indexed _destination,
        bytes _byteData,
        uint _dataLength,
        uint _etherAmount,
        bool _isSuccess
    );
    
    event LogOnReceiveQUZ(
        string message, 
        address indexed owner, 
        address indexed spender, 
        uint256 value, 
        QUZReceiveType receiveType
    );

    constructor(
        address[] initOwners
    ) 
        public 
        MultiOwnable(initOwners) 
    {
        // Multi Ownable initialization...
    }
    
    function onQUZReceived(address owner, address spender, uint256 value, QUZReceiveType receiveType) public returns (bool) {
        emit LogOnReceiveQUZ("I received QUZCoin.", owner, spender, value, receiveType);
        return true;
    }

    // call has been separated into its own function in order to take advantage
    // of the Solidity's code generator to produce a loop that copies tx.data into memory.
    function external_call(
        address destination, 
        uint value, 
        uint dataLength, 
        bytes data
    ) 
        public 
        privilegedOwner
        returns 
        (bool result) 
    {
        assembly {
            let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
            result := call(
                sub(gas, 34710),   // 34710 is the value that solidity is currently emitting
                                   // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                                   // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
                destination,
                value,
                d,
                dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
                x,
                0                  // Output is ignored, therefore the output size is zero
            )
        }
        emit CallEvent(destination, data, dataLength, value, result);
        return result;
    }
}