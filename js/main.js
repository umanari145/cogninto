

import {
    AuthenticationDetails,
    CognitoUserAttribute,
    CognitoUser,
    CognitoUserPool,
} from 'amazon-cognito-identity-js';

import AWS from 'aws-sdk';
import $ from 'jquery';

import * as aws from './aws_config.js'


const poolData = {
    UserPoolId: aws.USER_POOL_ID,
    ClientId: aws.CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);
const attributeList = [];

// Amazon Cognito 認証情報プロバイダーを初期化します
AWS.config.region = aws.AWS_REGION; // リージョン
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: aws.IDENTITY_POOL_ID
});

$("#createAccount").on("click", () => {

    $("#message-span").html("")
    $("#success-message-span").html("")

    var username = $("#email").val() || "";
    var password = $("#password").val() || "";

    // ユーザ必須属性リストの生成
    var attribute = {
        Name : "email",
        Value : username
    }

    var attributeEmail = new CognitoUserAttribute(attribute);
    attributeList.push(attributeEmail);

    // 何か1つでも未入力の項目がある場合、処理終了
    if (!username || !password) {
        $("#message-span").html("メールアドレスかパスワードが未入力です。");
        return;
    }

    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            $("#message-span").html(err.message)
            return;
        } else {
          // サインアップ成功の場合、アクティベーション画面に遷移する
        　 $("#success-message-span").html("メール送信をしました。確認してください。")
          location.href = "signin.html";
        }
    });
});
