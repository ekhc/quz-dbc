const express = require('express');
const router = express.Router();

// 퀴즈 컨트랙트 배포
router.post('/quizzes', (req, res) => {
  deploy(
    req.body.token,
    req.body.correctAnswerHash,
    req.body.prize)
    .then(result => {
      res.json({
        contractAddress : result
      });
    });
});

// 특정 퀴즈 컨트랙트 정보 보기
router.get('/quizzes/:address', (req, res) => {
  console.log(req.params.address);
  res.end();
});

module.exports = router
