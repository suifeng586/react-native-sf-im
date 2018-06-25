# react-native-sf-im


# 聊天框架



# 安装
yarn add react-native-sf-im
yarn add react-native-sf-aliyun-oss
react-native link react-native-sf-aliyun-oss


# Methods
|  Methods  |  Params  |  Param Types  |   description  |  Example  |
|:-----|:-----|:-----|:-----|:-----|
|init|host,port,aliyunConfig|string,string,object|聊天服务器配置以及阿里云配置|参考例子|
|listen|事件监听参数|object|监听聊天所有出发事件|参考例子|
|getHistory|lastMsgId,count,callBack|string/number/func|获取历史消息|参考例子|
|message|type|SFStatus.msg|创建消息结构体|参考例子|
|login|account,pwd,suc,fail|string/string/func/func|登录聊天系统|参考例子|
|logout|||登出聊天系统|参考例子|
|send|message|SFIMMessage|发送消息|参考例子|
|getChatList|||获取对话列表|参考例子|



# 例子
```

import {SFIM, SFIMMessage, SFIMConfig, SFIMStatus} from "react-native-sf-im"

# 初始化
SFIM.init({
            host:'http://127.0.0.1',
            port:'5000',
            aliyun:{
                accessKey:'',
                secretKey:'',
                endPoint:'',
                bucketName:'',
                filePath:'chat'//聊天图片文件在阿里云存放的目录
            }
        });
# 监听事件
SFIM.listen({
            onTextMessage: (data)=> {
                console.log('收到消息', data);
            },
            onEmojiMessage: (data)=> {
                console.log('收到消息', data);
            },
            onImgMessage: (data)=> {
                console.log('收到消息', data);
            },
            onReadMessage: (data)=> {
                console.log('对方已读', data);
            },
            onConnect: ()=> {
                console.log('连接成功');
            },
            onDisconnect: ()=> {
                console.log('连接失败');
            },
        })

# 发送文本消息
var msg = SFIM.message(SFIMConfig.msg.text);
msg.text({
    msg:'要发送的消息',
    to:'对方的UID',
    suc:(data)=>{
        console.log('发送成功',data);
    },
    fail:(err)=>{
        console.log('发送失败',err);
    }
});
SFIM.send(msg);

# 发送表情消息
var msg = SFIM.message(SFIMConfig.msg.emoji);
msg.text({
    msg:'要发送的消息',
    to:'对方的UID',
    suc:(data)=>{
        console.log('发送成功',data);
    },
    fail:(err)=>{
        console.log('发送失败',err);
    }
});
SFIM.send(msg);

# 发送图片消息
var msg = SFIM.message(SFIMConfig.msg.img);
msg.text({
    imgPath:'图片地址',
    to:'对方的UID',
    uploadProgress:(progress)=>{

    },
    uploadFinish:(data)=>{

    },
    suc:(data)=>{
        console.log('发送成功',data);
    },
    fail:(err)=>{
        console.log('发送失败',err);
    }
});
SFIM.send(msg);


# 获取历史消息
SFIM.getHistory(this.lastMsgId, 10, (data)=> {
                console.log('获取历史', data)
            })


# 获取对话列表
SFIM.getChatList((data)=>{
    console.log('对话列表',data)
})
```