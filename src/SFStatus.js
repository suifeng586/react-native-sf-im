/**
 * Created by zhiqu on 2018/6/22.
 */
export default {
    msg: {
        text: 1,
        image: 2,
        emoji: 3,
    },
    event:{
        connect: 'connect',
        join: 'join',
        send: 'send',
        receive: 'receive',
        disconnect: 'disconnect',
        read: 'read',
        getHistory:'get_history',
        getChatList:'get_chat_list',
        leave: 'leave'
    },
    code:{
        connect_timeout:{code:100,msg:'连接超时'},
        connect_login_error:{code:101,msg:'账号密码错误'},
        connect_error:{code:102,msg:'服务器异常'},
        connect_logout_error:{code:103,msg:'登出失败,未登录'},
        connect_reg_suc:{code:104,msg:'注册成功'},
        connect_reg_error:{code:105,msg:'注册失败'},

        message_send_type_error:{code:200,msg:'消息类型错误'},
        message_send_suc:{code:202,msg:'发送成功'},
        message_upload_fail:{code:203,msg:'上传失败'},

        req_unlogin:{code:300,msg:'注册失败'},
    }

}