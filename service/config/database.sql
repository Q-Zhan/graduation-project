/*
SQLyog Ultimate v12.08 (64 bit)
MySQL - 8.0.13 : Database - onlinechat
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`onlinechat` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `onlinechat`;

/*Table structure for table `chatlist` */

DROP TABLE IF EXISTS `chatlist`;

CREATE TABLE `chatlist` (
  `userID` char(1) NOT NULL COMMENT '用户id',
  `chatID` char(1) NOT NULL COMMENT '存在于最近聊天列表中的聊天对象id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `chatlist` */

/*Table structure for table `friend` */

DROP TABLE IF EXISTS `friend`;

CREATE TABLE `friend` (
  `userID` char(1) NOT NULL COMMENT '用户id',
  `friendID` char(1) NOT NULL COMMENT '好友id',
  `timeStamp` char(1) DEFAULT NULL COMMENT '添加时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `friend` */

/*Table structure for table `group_info` */

DROP TABLE IF EXISTS `group_info`;

CREATE TABLE `group_info` (
  `id` double NOT NULL AUTO_INCREMENT COMMENT '群id',
  `name` char(100) NOT NULL COMMENT '群名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `group_info` */

/*Table structure for table `group_message` */

DROP TABLE IF EXISTS `group_message`;

CREATE TABLE `group_message` (
  `msgID` double NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `groupID` double NOT NULL COMMENT '群ID',
  `from` char(1) NOT NULL COMMENT '消息发送用户的id',
  `content` char(1) DEFAULT NULL COMMENT '消息内容',
  `timeStamp` char(1) DEFAULT NULL COMMENT '消息发送时间戳',
  PRIMARY KEY (`msgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `group_message` */

/*Table structure for table `moment` */

DROP TABLE IF EXISTS `moment`;

CREATE TABLE `moment` (
  `id` double NOT NULL AUTO_INCREMENT COMMENT '动态id',
  `userID` char(1) NOT NULL COMMENT '发表动态的用户id',
  `content` char(1) DEFAULT NULL COMMENT '动态内容',
  `timeStamp` char(1) DEFAULT NULL COMMENT '发表时间戳',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `moment` */

/*Table structure for table `private_message` */

DROP TABLE IF EXISTS `private_message`;

CREATE TABLE `private_message` (
  `msgID` double NOT NULL AUTO_INCREMENT COMMENT '私聊信息id',
  `from` char(1) DEFAULT NULL COMMENT '发送人id',
  `to` char(1) DEFAULT NULL COMMENT '接收者id',
  `content` char(1) DEFAULT NULL COMMENT '消息内容',
  `timeStamp` char(1) DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`msgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `private_message` */

/*Table structure for table `socialinfo` */

DROP TABLE IF EXISTS `socialinfo`;

CREATE TABLE `socialinfo` (
  `userID` char(1) DEFAULT NULL COMMENT '用户ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `socialinfo` */

/*Table structure for table `user_group` */

DROP TABLE IF EXISTS `user_group`;

CREATE TABLE `user_group` (
  `userID` char(100) NOT NULL COMMENT '用户账号',
  `groupID` double NOT NULL COMMENT '群ID',
  `timeStamp` double NOT NULL COMMENT '进群时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_group` */

/*Table structure for table `user_info` */

DROP TABLE IF EXISTS `user_info`;

CREATE TABLE `user_info` (
  `userID` char(100) NOT NULL COMMENT '用户账号',
  `password` char(100) NOT NULL COMMENT '用户账号密码',
  `mail` char(100) NOT NULL COMMENT '用户邮箱',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_info` */

insert  into `user_info`(`userID`,`password`,`mail`) values ('1','1','1'),('12','1','1'),('admin','admin','380776767@qq.com');

/*Table structure for table `violation` */

DROP TABLE IF EXISTS `violation`;

CREATE TABLE `violation` (
  `userID` char(1) NOT NULL COMMENT '用户ID',
  `score` double NOT NULL COMMENT '违规分数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `violation` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
