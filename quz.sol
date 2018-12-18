pragma solidity >= 0.4.24 < 0.6.0;
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @return the address of the owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    /**
     * @dev Allows the current owner to relinquish control of the contract.
     * @notice Renouncing to ownership will leave the contract without an owner.
     * It will not be possible to call the functions with the `onlyOwner`
     * modifier anymore.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Quz is Ownable {
  using SafeMath for uint; // use SafeMath for all uint

  address private token;
  uint private quizId; // unique identifier for quiz
  uint public startTime; // quiz start time
  uint public endTime; // quiz end time
  uint public prize; // total prize amount
  uint public quizNum; // number of quizzes
  uint public winnersNum; // number of winners
  uint public prizePerWinner; // prize per winner
  
  mapping(address => uint8) public userAnswers; // map address to user answers
  address[] private users; // array of users
  uint8 public correctAnswer; // correct answer number
  
  function transferWinningPrize() internal {   // transfers prizePerWinner to winners
    for (uint i=0; i < users.length; i++) {    // calculates the number of winners
      if (userAnswers[users[i]] == 5) {
        winnersNum += 1;
      }
    }
    prizePerWinner = SafeMath.div(prize, winnersNum); // calculates the prizePerWinner (uses SafeMath library to prevent overflow
    for (uint j=0; j < users.length; j++) {           
      if (userAnswers[users[j]] == quizNum) {               // if the user answers equals the number of quizzes
        IERC20(token).transferFrom(                         // then transfers prizePerWinner from owner to winner
          owner(),
          users[j],
          prizePerWinner
        );
      }
    }
  }
}
