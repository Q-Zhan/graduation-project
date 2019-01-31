# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.24)
# Database: onlinechat
# Generation Time: 2019-01-31 11:51:55 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table chatlist
# ------------------------------------------------------------

DROP TABLE IF EXISTS `chatlist`;

CREATE TABLE `chatlist` (
  `userID` char(100) NOT NULL DEFAULT '' COMMENT '用户id',
  `chatID` char(100) NOT NULL DEFAULT '' COMMENT '存在于最近聊天列表中的聊天对象id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table friend_apply
# ------------------------------------------------------------

DROP TABLE IF EXISTS `friend_apply`;

CREATE TABLE `friend_apply` (
  `fromID` char(100) NOT NULL DEFAULT '' COMMENT '请求者id',
  `toID` char(100) NOT NULL DEFAULT '' COMMENT '被请求者id',
  PRIMARY KEY (`fromID`,`toID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='存放未被处理的好友请求，拒绝或接受动作都会删去该表的记录';



# Dump of table friend_ship
# ------------------------------------------------------------

DROP TABLE IF EXISTS `friend_ship`;

CREATE TABLE `friend_ship` (
  `userID` char(100) NOT NULL DEFAULT '' COMMENT '用户id',
  `friendID` char(100) NOT NULL DEFAULT '' COMMENT '好友id',
  `timeStamp` char(100) NOT NULL DEFAULT '' COMMENT '添加时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='存放已接受的好友关系';

LOCK TABLES `friend_ship` WRITE;
/*!40000 ALTER TABLE `friend_ship` DISABLE KEYS */;

INSERT INTO `friend_ship` (`userID`, `friendID`, `timeStamp`)
VALUES
	('11','23','1547991102237'),
	('123','23','1547991102237'),
	('111','22','1547991102237'),
	('23','123','1547991102237'),
	('123','111',''),
	('111','123','');

/*!40000 ALTER TABLE `friend_ship` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table group_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_info`;

CREATE TABLE `group_info` (
  `id` double NOT NULL AUTO_INCREMENT COMMENT '群id',
  `name` char(100) NOT NULL COMMENT '群名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table group_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_message`;

CREATE TABLE `group_message` (
  `msgID` double NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `groupID` double NOT NULL COMMENT '群ID',
  `from` char(100) NOT NULL DEFAULT '' COMMENT '消息发送用户的id',
  `content` text NOT NULL COMMENT '消息内容',
  `timeStamp` char(100) NOT NULL DEFAULT '' COMMENT '消息发送时间戳',
  PRIMARY KEY (`msgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table moment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `moment`;

CREATE TABLE `moment` (
  `id` double NOT NULL AUTO_INCREMENT COMMENT '动态id',
  `userID` char(100) NOT NULL DEFAULT '' COMMENT '发表动态的用户id',
  `content` char(100) NOT NULL DEFAULT '' COMMENT '动态内容',
  `timeStamp` char(100) NOT NULL DEFAULT '' COMMENT '发表时间戳',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table private_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `private_message`;

CREATE TABLE `private_message` (
  `msgID` double NOT NULL AUTO_INCREMENT COMMENT '私聊信息id',
  `from` char(100) NOT NULL DEFAULT '' COMMENT '发送人id',
  `to` char(100) NOT NULL DEFAULT '' COMMENT '接收者id',
  `content` char(100) NOT NULL DEFAULT '' COMMENT '消息内容',
  `timeStamp` char(100) NOT NULL DEFAULT '' COMMENT '时间戳',
  PRIMARY KEY (`msgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table social_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `social_info`;

CREATE TABLE `social_info` (
  `userID` char(100) NOT NULL DEFAULT '' COMMENT '用户ID',
  `name` char(100) DEFAULT '默认昵称' COMMENT '昵称',
  `area` char(100) DEFAULT NULL COMMENT '地区',
  `sign` char(100) DEFAULT NULL COMMENT '自我简介',
  `gender` int(11) DEFAULT NULL COMMENT '性别：0-女，1-男',
  `avatar` text COMMENT '头像'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `social_info` WRITE;
/*!40000 ALTER TABLE `social_info` DISABLE KEYS */;

INSERT INTO `social_info` (`userID`, `name`, `area`, `sign`, `gender`, `avatar`)
VALUES
	('123','I am Z!','广州','我就是我，有个性',0,'http://localhost:8081/img/avatar.jpg'),
	('111','我是小号','东莞',NULL,1,NULL),
	('33311','默认昵称','深圳',NULL,0,NULL),
	('1234','默认昵称',NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `social_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_group`;

CREATE TABLE `user_group` (
  `userID` char(100) NOT NULL COMMENT '用户账号',
  `groupID` double NOT NULL COMMENT '群ID',
  `timeStamp` double NOT NULL COMMENT '进群时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_info`;

CREATE TABLE `user_info` (
  `userID` char(100) NOT NULL COMMENT '用户账号',
  `password` char(100) NOT NULL COMMENT '用户账号密码',
  `mail` char(100) NOT NULL COMMENT '用户邮箱',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;

INSERT INTO `user_info` (`userID`, `password`, `mail`)
VALUES
	('111','111','111'),
	('123','123','123'),
	('1234','1234','1234'),
	('33311','33311','33331');

/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table violation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `violation`;

CREATE TABLE `violation` (
  `userID` char(100) NOT NULL DEFAULT '' COMMENT '用户ID',
  `score` double NOT NULL COMMENT '违规分数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
