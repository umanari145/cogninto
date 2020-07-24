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

$("#createAccount").on("click", (event) => {

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
        $("#message-span").html("未入力項目が存在します。");
        return;
    }

    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            $("#message-span").html(err.message)
            return;
        } else {
          // サインアップ成功の場合、アクティベーション画面に遷移する
        　 $("#success-message-span").html("メール送信をしました。確認してください。")
          location.href = "verification.html";
        }
    });
});


$("#verification").on("click", (event) => {

    $("#message-span").html("")
    $("#success-message-span").html("")

    var email = $("#email").val() || "";
    var verificationCode = $("#verificationCode").val() || "";
    
    if (!email || !verificationCode) {
        $("#message-span").html("未入力項目が存在します。");
        return;
    } 
	
    var userData = {
        Username : email,
        Pool : userPool
    };

    const cognitoUser = new CognitoUser(userData);
    
    // アクティベーション処理
    cognitoUser.confirmRegistration(verificationCode, true, function(err, result){
        if (err) {
            // アクティベーション失敗の場合、エラーメッセージを画面に表示
             $("#message-span").html(err.message)
            return;
        } else {
            // アクティベーション成功の場合、サインイン画面に遷移
            $("#success-message-span").html("ユーザーアカウントが認証されました。")
            location.href = "signin.html";
        }
    });
})

$("#signin").on("click", (event) => {

    $("#message-span").html("")
    $("#success-message-span").html("")

    var email = $('#email').val()|| "";
    var password = $('#password').val() || "";
    
    if (!email || !password) { 
        $("#message-span").html("未入力項目が存在します。");
    	return ; 
    }
    
    // 認証データの作成
    var authenticationData = {
        Username: email,
        Password: password
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    
    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);
    
    // 認証処理
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            
            $("#success-message-span").html("有効なアカウントです。")
            //tokenが無事取れていることを確認
            var idToken = result.getIdToken().getJwtToken();          // IDトークン
            var accessToken = result.getAccessToken().getJwtToken();  // アクセストークン
            var refreshToken = result.getRefreshToken().getToken();   // 更新トークン
            
            console.log("idToken : " + idToken);
            console.log("accessToken : " + accessToken);
            console.log("refreshToken : " + refreshToken);
           
        },
 
        onFailure: function(err) {
            // サインイン失敗の場合、エラーメッセージを画面に表示
            $("#message-span").html(err.message);
        }
    });    
})