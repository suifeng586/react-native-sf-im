import React, {Component} from 'react'
import {
    Text,
    View,
    Platform,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native'

export default class SFIMMessage{
    constructor({type:type,uid:uid}){
        this.body = {};
        this.body.from_id = uid;
        this.body.type = type;
        this.body.date = this._nowDate();
        this.body.msg_id = new Date().getTime()+''+this._random(0,100);
        this.body.is_read = 0;
    }
    text({msg:msg,to:to,suc:suc,fail:fail}){
        this.body.content = msg;
        this.body.to_id = to;
        this.suc = suc;
        this.fail = fail;
    }
    emoji({msg:msg,to:to,suc:suc,fail:fail}){
        this.body.content = msg;
        this.body.to_id = to;
        this.suc = suc;
        this.fail = fail;
    }
    img({imgPath:imgPath,to:to,uploadProgress,uploadSuc:uploadSuc,uploadFinish:uploadFinish,suc:suc,fail:fail}){
        this.body.content = imgPath;
        this.body.to_id = to;
        this.suc = suc;
        this.fail = fail;
        this.uploadSuc = uploadSuc;
        this.uploadProgress = uploadProgress;
        this.uploadFinish = uploadFinish;
    }
    _random(min,max){
        var w = max-min;
        return parseInt(Math.random()*w+min, 10);
    }
    _nowDate(){
        var nowDate = new Date();
        return nowDate.Format("yyyy-MM-dd hh:mm:ss");
    }
}