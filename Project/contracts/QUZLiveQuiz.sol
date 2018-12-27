pragma solidity >= 0.4.24 < 0.6.0;

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


/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
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

/**
 * @title QUZLive Quiz Contract
 * @author modolee
 * @dev see http://www.quz.com
 */

contract QUZLiveQuiz is Ownable {
    address private token;
    uint private quizId;
    string public quizImg;
    uint public startTime;
    uint public endTime;
    uint public prize;

    mapping(address => uint8) public userAnswers;
    address[] private users;
    uint8 public correctAnswer;

    /**
     * @dev 퀴즈 참여 가능 시간인지 확인
     */
    modifier inParticipationTime() {
        require(
          canParticipate(),
          "You can only participate quiz from startTime to endTime."
        );
        _;
    }

    /**
     * @dev 기존에 참여했는지 확인
     */
    modifier participateOnce(address _user) {
        require(
            !didParticipate(_user),
            "You can participate only once."
        );
        _;
    }

    /**
     * @dev 정답이 공개되었는지 확인
     */
    modifier emptyCorrectAnswer() {
        require(
            isEmptyCorrectAnswer(),
            "You can set the correctAnswer only once."
        );
        _;
    }

    /**
     * @dev 생성자
     * @param _token 보상으로 지급할 토큰 컨트랙트의 주소
     * @param _quizId DB에 저장 된 퀴즈 ID
     * @param _quizImg 퀴즈 이미지
     * @param _startTime 시작 시각
     * @param _endTime 종료 시각
     * @param _prize 보상 토큰 개수
     */
    constructor(
        address _token,
        uint _quizId,
        string memory _quizImg,
        uint _startTime,
        uint _endTime,
        uint _prize
    )
        public
    {
        token = _token;
        quizId = _quizId;
        quizImg = _quizImg;
        startTime = _startTime;
        endTime = _endTime;
        prize = _prize;
    }

    /**
     * @dev 참여 가능 시각인지 알려줌
     * @return bool true(참여 가능 시각) / false(참여 불가 시각)
     */
    function canParticipate()
        public
        view
        returns (bool)
    {
        return now >= startTime && now <= endTime;
    }

    /**
     * @dev 정답이 입력되어 있는지 비어 있는지 알려줌
     * @return bool true(비어 있음) / false(채워 있음)
     */
    function isEmptyCorrectAnswer()
        public
        view
        returns (bool)
    {
        return correctAnswer == 0;
    }

    /**
     * @dev 사용자가 참여 한 적 있는지 알려줌
     * @param _user 사용자 지갑 주소
     * @return bool true(참여한 적 있음) / false(참여한 적 없음)
     */
    function didParticipate(address _user)
        public
        view
        returns (bool)
    {
        return userAnswers[_user] != 0;
    }

    /**
     * @dev 정답을 입력하고, 정답자에게 보상을 나눠주는 함수를 호출
     * @param _correctAnswer 퀴즈의 정답 (1 ~ 4)
     */
    function setCorrectAnswer(
        uint8 _correctAnswer
    )
        public
        onlyOwner
        emptyCorrectAnswer
    {
        correctAnswer = _correctAnswer;
        transferWinningPrize();
    }

    // TODO: 참여자가 많을 경우 gaslimit을 넘어가게 될 경우를 처리
    /**
     * @dev 답을 입력 한 사용자의 답을 확인하면서 정답과 같은 경우 지정한 토큰을 전송
     * @dev 이 함수가 정상적으로 동작하려면 owner가 이 퀴즈 컨트랙트에 approve 해줘야 함
     */
    function transferWinningPrize() internal {
        for (uint i=0; i < users.length; i++) {
            if (userAnswers[users[i]] == correctAnswer) {
                IERC20(token).transferFrom(
                    owner(),
                    users[i],
                    prize
                );
            }
        }
    }

    /**
     * @dev 퀴즈의 답을 입력
     * @param _user 사용자의 지갑 주소
     * @param _answer 정답이라고 생각하는 답
     */
    function submitAnswer(
        address _user,
        uint8 _answer
    )
        public
        emptyCorrectAnswer
        inParticipationTime
        participateOnce(_user)
    {
        userAnswers[_user] = _answer;
        users.push(_user);
    }

    // TODO: 일괄 입력 중 중간에 revert가 나는 경우 처리
    /**
     * @dev 퀴즈의 답을 일괄적으로 입력
     * @param _users 사용자의 지갑 주소 배열
     * @param _answers 답 배열
     */
    function submitAnswerBatch(
        address[] _users,
        uint8[] _answers
    )
        public
        onlyOwner
        emptyCorrectAnswer
        inParticipationTime
    {
        for (uint i=0; i < _users.length; i++) {
            submitAnswer(_users[i], _answers[i]);
        }
    }
}
