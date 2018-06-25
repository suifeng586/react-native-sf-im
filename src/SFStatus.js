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
        connect_login_suc:{code:0,msg:'登录成功'},
        connect_logout_suc:{code:0,msg:'登出成功'},
        connect_timeout:{code:100,msg:'连接超时'},
        connect_login_error:{code:101,msg:'账号密码错误'},
        connect_error:{code:102,msg:'服务器异常'},
        connect_logout_error:{code:103,msg:'登出失败,未登录'},
        message_send_type_error:{code:200,msg:'消息类型错误'},
        message_send_login_error:{code:201,msg:'未登录'},
        message_send_suc:{code:202,msg:'发送成功'},
        message_upload_suc:{code:0,msg:'上传成功'},
        message_upload_fail:{code:203,msg:'上传失败'},
    }

}