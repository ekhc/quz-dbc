pragma solidity >=0.4.22 <0.6.0;
contract JamQuiz {
    
    uint private quizId;

    
    
        /**
     * @dev 퀴즈 참여 가능 시간인지 확인
     */
    
        function canParticipate(uint _sponsorSeq, uint _quizSeq)
        public
        view
        returns (bool)
    {
        uint startTime = sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].startTime;
        uint endTime = sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].startTime;
        return now >= startTime && now <= endTime;
    }

    //
    struct ParticipantsInfo{
        uint turn;
        uint sponsorSeq;
        mapping(address => Participant) participantStructs; 
        address[] participantArray;
    }
    
    struct Participant {
        address account;
        uint    rightAnswerCount;
        mapping(uint => ParticipantQuiz) participantQuizStructs; 
        uint[] participantQuizArray; 
    }  
    
    struct ParticipantQuiz {
        uint quizSeq;
        uint participantAnswer;
        uint checkAnswer;
    }
    
    mapping(uint => ParticipantsInfo) participantsInfoStruct; 
    uint[] participantsInfoArray;    
    
   
    function newParticipantsInfo(uint _turn,uint _sponsorSeq) public
        //onlyOwner
        returns(uint)
    {
        participantsInfoStruct[_turn].turn=_turn;
        participantsInfoStruct[_turn].sponsorSeq=_sponsorSeq;
        participantsInfoArray.push(_turn);
        
        return _turn;
    }
    
    function addParticipant(uint _turn,address _account) public
        //onlyOwner
        returns(uint,uint)
    {
        participantsInfoStruct[_turn].participantStructs[_account].account=_account;
        participantsInfoStruct[_turn].participantArray.push(_account);
        
        return (_turn, participantsInfoStruct[_turn].participantArray.length);
    }
     //solveQuiz
    function solveQuiz(uint _turn,address _account,uint _quizSeq,uint _participantAnswer) public
        //onlyOwner
        returns(uint,uint)
    {
        uint check = 0; 
        participantsInfoStruct[_turn].participantStructs[_account].account=_account;
        participantsInfoStruct[_turn].participantStructs[_account].participantQuizStructs[_quizSeq].participantAnswer=_participantAnswer;
        
        address[] memory participantArray = participantsInfoStruct[_turn].participantArray;

        for (uint i=0; i> participantArray.length; i++){
        if(_account==participantsInfoStruct[_turn].participantStructs[participantArray[i]].account){
            check = 1;
        }
        }
        require(check == 1);
        
        return (_turn,_quizSeq);
    }
    
    function answerParticipans(uint _quizSeq, uint _answerSeq) public returns(uint) {

        return (1);
    }
    
    
    function test() public view returns(uint){
        return (now);
    }
    
    function viewQuiz(uint _sponsorSeq, uint _quizSeq) public view returns(uint, uint, string){
        
        uint _startTime = sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].startTime;
        uint _endTime = sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].endTime;   
        string _quizText = sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].quizText;
        
        return (_startTime,_endTime,_quizText);
    }
    
    //checkQuiz 
    function checkQuiz(uint _turn,uint _quizSeq,uint _rightAnswer) public view
        //onlyOwner
        returns(uint,uint,uint,address[])
    {
        uint rightAnswerCnt =0;
        uint participantAnswer=0;
        uint checkAnswer=0;
        uint turn = _turn;
        uint quizSeq = _quizSeq;
       
        
        
        address[] memory participantArray = participantsInfoStruct[turn].participantArray;
        Participant memory participant;
        ParticipantQuiz memory participantQuiz;
        for (uint ui=0; ui> participantArray.length; ui++){
            participant = participantsInfoStruct[turn].participantStructs[participantArray[ui]];
            participantQuiz = participantsInfoStruct[turn].participantStructs[participantArray[ui]].participantQuizStructs[quizSeq];
            participantAnswer=participantQuiz.participantAnswer;
            
            if(_rightAnswer==participantAnswer){
                checkAnswer=1;
                rightAnswerCnt++;
            }
            participantAnswer=participantQuiz.checkAnswer=checkAnswer;
            participant.rightAnswerCount++;
        }
        
    
        
        return (turn,rightAnswerCnt,participantsInfoStruct[turn].participantStructs[participantArray[0]].participantQuizStructs[1].participantAnswer,participantArray);
    }
   
//-------------------------------------------    
    
    struct SponsorQuiz {
        uint sponsorSeq;
        string sponsorName;
        uint reward;
        mapping(uint => Quiz) quizStructs;
        uint[] quizArray; 
    }
    
    struct Quiz {
        uint quizSeq;
        string quizText;
        uint startTime;
        uint endTime;
        mapping(uint => Answer) answerStructs; 
        uint[] answertArray;
        uint rightAnswer;
    }
    
    struct Answer{
        uint answerSeq;
        string answerText;
    }
    
    
    mapping(uint => SponsorQuiz) sponsorQuizStruct; 
    uint[] sponsorQuizArray;        
    
    function newSponsor(uint _sponsorSeq,string _sponsorName, uint _reward) public
        // onlyOwner
        returns(bool success)
    {
        sponsorQuizStruct[_sponsorSeq].sponsorSeq=_sponsorSeq;
        sponsorQuizStruct[_sponsorSeq].sponsorName=_sponsorName;
        sponsorQuizStruct[_sponsorSeq].reward=_reward;
        
        sponsorQuizArray.push(_sponsorSeq);
        return true;
    }
    
    //function newQuiz(uint _sponsorSeq,uint _quizSeq, string _quizText,uint _rightAnswer) public
    function newQuiz(uint _sponsorSeq, uint _quizSeq, string _quizText, uint _startTime, uint _endTime, uint _rightAnswer) public
        // onlyOwner
        returns(bool success)
    {
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].quizSeq=_quizSeq;
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].quizText=_quizText;
        
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].startTime=_startTime;
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].endTime=_endTime;
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].rightAnswer=_rightAnswer;

        sponsorQuizStruct[_sponsorSeq].quizArray.push(_quizSeq);
        
        return true;
    }
    
    
    function addAnswer(uint _sponsorSeq,uint _quizSeq, uint _answerSeq,string  _answerText) public
        // onlyOwner
        returns(bool success)
    {
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].answerStructs[_answerSeq].answerSeq=_answerSeq;
        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].answerStructs[_answerSeq].answerText=_answerText;

        sponsorQuizStruct[_sponsorSeq].quizStructs[_quizSeq].answertArray.push(_answerSeq);
        
        return true;
    }    
    
    constructor(

        
        )  public {owner = msg.sender; 
        
        
    }
    address owner;
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
    function changeOwner(address _newOwner)
        public
        onlyBy(owner)
    {
        owner = _newOwner;
    }
    modifier onlyBy(address _account)
    {
        require(
            msg.sender == _account,
            "Sender not authorized."
        );
        // "_;" 를 깜빡하지 마세요! 수정자가
        // 사용 될 때, "_;"가 실제 함수
        // 본문으로 대체됩니다.
        _;
    }
    
}