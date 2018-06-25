import React, {Component} from 'react'
import {
    Text,
    View,
    Platform,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native'
import SFNet from "react-native-sf-net"
import SFAliyunOss from 'react-native-sf-aliyun-oss';
import SFIMMessage from "./SFIMMessage"
import io from "socket.io-client";
import SFIMConfig from "./SFIMConfig"
import SFUtils from "./SFUtils"
import SFStatus from "./SFStatus"


const SFIM = {
    init({host:host,port:port,aliyunConfig:aliyunConfig}){
        SFIMConfig.host = host;
        SFIMConfig.port = port;
        SFIMConfig.aliyun = {
            accessKey:aliyunConfig.accessKey,
            secretKey:aliyunConfig.secretKey,
            endPoint:aliyunConfig.endPoint,
            bucketName:aliyunConfig.bucketName,
            filePath:aliyunConfig.filePath
        };


        this.uri = SFIMConfig.host+':'+SFIMConfig.port;
        this.socket = null;
        this.logined = false;
        this.uid=-1;
        SFUtils.extendDate();
        SFAliyunOss.config(
            SFIMConfig.aliyun.accessKey,
            SFIMConfig.aliyun.secretKey,
            SFIMConfig.aliyun.endPoint,
            SFIMConfig.aliyun.bucketName);
    },
    listen(listener){
        this.onEmojiMessage = listener.onEmojiMessage;
        this.onTextMessage = listener.onTextMessage;
        this.onImgMessage = listener.onImgMessage;
        this.onReadMessage = listener.onReadMessage;
        this.onConnect = listener.onConnect;
        this.onDisconnect = listener.onDisconnect;

    },
    getHistory(lastMsgId,count,callBack){
        if (this.logined == false){
            return false;
        }
        this.socket.emit(SFIMConfig.event.getHistory,{
            uid:this.uid,
            count:count,
            last_msg_id:lastMsgId
        },(data)=>{
           if (callBack){
               callBack(data);
           }
        })
    },
    getChatList(callBack){
        if (this.logined == false){
            return false;
        }
        this.socket.emit(SFIMConfig.event.getChatList,{
            uid:this.uid
        },(data)=>{
            if (callBack){
                callBack(data);
            }
        })
    },
    message(type){
      return new SFIMMessage({type:type,uid:this.uid})
    },

    register(account,pwd,uid,nick=null,header=null){

    },
    login(account,pwd,suc,fail){
        let url = this.uri+'/auth/login';
        SFNet.post(url,{account:account,pwd:pwd},(ret)=>{
            let code = ret.code;
            if (code == 0){
                var socket = io(this.uri, {
                    transports: ['websocket'] // you need to explicitly tell it to use websockets
                });
                this.uid = ret.data.uid;
                this.socket = socket;
                this.socket.on(SFIMConfig.event.connect, () => {
                    this._listener();
                    if (this.onConnect){
                        this.onConnect();
                    }
                    this.socket.emit(SFIMConfig.event.join,{uid:this.uid},(ret)=>{
                        if (suc){
                            suc(SFStatus.code.connect_login_suc);
                        }
                    });

                });

            }else{
                if (fail){
                    fail(SFStatus.code.connect_login_error);
                }
            }
        },()=>{
            if (fail){
                fail(SFStatus.code.connect_error);
            }
        });
    },
    logout(suc,fail){
        if (this.logined == false){
            if (fail){
                fail(SFStatus.code.connect_logout_error);
            }
        }
        this.logined = false;
        this.socket.emit(SFIMConfig.event.leave,{uid:this.uid},()=>{
            if (suc){
                suc(SFStatus.code.connect_logout_suc);
            }
            this.socket.emit(SFIMConfig.event.disconnect,{},()=>{

            })
        })
    },
    send(message){
        if (this.logined){
            if (message instanceof SFIMMessage == false){
                if (message.fail){
                    message.fail(SFStatus.code.message_send_type_error);
                }
            }
            if (message.body.type == SFStatus.msg.image){
                SFAliyunOss.uploadCompress(SFIMConfig.aliyun.filePath,message.body.content,(progress)=>{
                    console.log(progress);
                    if (message.uploadProgress){
                        message.uploadProgress(progress);
                    }
                },(fileKey)=>{
                    console.log(fileKey);
                    message.body.content = fileKey;
                    if (message.uploadFinish){
                        var ret = SFStatus.code.message_upload_suc;
                        ret.data = {fileKey:fileKey}
                        message.uploadFinish(ret);
                    }

                    this.socket.emit(SFIMConfig.event.send,message.body,(data)=>{
                        console.log(data);
                        if (message.suc){
                            var ret = SFStatus.code.message_send_suc;
                            ret.data = data;
                            message.suc(ret)
                        }
                    })
                },(err)=>{
                    if (message.fail){
                        message.fail(SFStatus.code.message_upload_fail);
                    }
                    console.log(err);
                });
            }else{
                this.socket.emit(SFIMConfig.event.send,message.body,(data)=>{
                    console.log(data);
                    if (message.suc){
                        var ret = SFStatus.code.message_send_suc;
                        ret.data = data;
                        message.suc(ret)
                    }
                })
            }
        }else{
            if (message.fail){
                message.fail(SFStatus.code.message_send_login_error);
            }
        }

    },
    _listener(){
        this.socket.on(SFIMConfig.event.receive,(data)=>{
            if (data.type == SFIMConfig.msg.text){
                if (this.onTextMessage){
                    this.onTextMessage(data);
                }
            }else if (data.type == SFIMConfig.msg.image){
                if (this.onImgMessage){
                    this.onImgMessage(data);
                }
            }else if (data.type == SFIMConfig.msg.emoji){
                if (this.onEmojiMessage){
                    this.onEmojiMessage(data);
                }
            }
            this.socket.emit(SFIMConfig.event.read,{msg_id:data.msg_id,from_id:data.from_id,to_id:data.to_id});
        });

        this.socket.on(SFIMConfig.event.read,(data)=>{
            if (this.onReadMessage){
                this.onReadMessage(data)
            }
        });

        this.socket.on(SFIMConfig.event.disconnect,()=>{
            if (this.onConnect){
                this.onConnect();
            }
        });
    }
}

module.exports = SFIM;