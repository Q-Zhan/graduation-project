const query = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');
const socket = require('../util/socket');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const { CHAT_TYPE, PRIVATE_MESSAGE_SUCCESS_TYPE, MESSAGE_TYPE} = GLOBAL_CONSTANT;

async function createMoment(req, res) {
  const uid = req.uid;
  const { text, imgList } = req.body;
  try {
    let insertMoment = `insert into moment values(${null}, '${uid}', '${text}', ${+new Date()})`;
    let insertMomentResult = await query(insertMoment);
    const momentId = insertMomentResult.insertId;
    for (let item of imgList) {
      if (item) {
        let insertMomentPicture = `insert into moment_picture values(${null}, ${momentId}, '${item}')`;
        let insertMomentPictureResult = await query(insertMomentPicture);
      }
    }
    res.json({
      code: CODE.success
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function getMomentList(req, res) {
  const uid = req.uid;
  try {
    // 获取好友的动态
    let result = [];
    let selectMoment = `
    select * from moment 
    where userID in (select friendID from friend_ship where userID='${uid}') or userID='${uid}'
    order by timeStamp desc`;
    const selectMomentResult = await query(selectMoment);
    for (let i = 0; i < selectMomentResult.length; i++) {
      const item = selectMomentResult[i];
      const momentId = item.momentID;
      const userId = item.userID;
      const imgList = [];
      // 获取好友详情
      let selectSocialInfo = `select * from social_info where userID='${userId}'`;
      const selectSocialInfoResult = await query(selectSocialInfo);
      // 获取moment图片
      let selectPicture = `select * from moment_picture where momentID=${momentId}`;
      const selectPictureResult = await query(selectPicture);
      selectPictureResult.forEach(element => {
        imgList.push(element.content)
      });
      // 整合
      let userInfo = selectSocialInfoResult[0];
      userInfo.momentText = item.content;
      userInfo.timeStamp = item.timeStamp;
      userInfo.momentImgList = imgList;
      result.push(userInfo)
    }
    res.json({
      code: CODE.success,
      momentList: result
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

module.exports = {
    createMoment,
    getMomentList
  }