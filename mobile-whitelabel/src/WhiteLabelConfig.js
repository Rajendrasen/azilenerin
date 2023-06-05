import { NativeModules } from 'react-native';

export const getAppName = () => {
    return NativeModules.WhiteLabelConfig.getAppName();
    // return 'VILIVING';
};

export const getResponse = () => {
    return NativeModules.WhiteLabelConfig.getResponse();
}

export const backgroundImage = () => {
    // console.log('name is', getAppName());
    switch (getAppName()) {
        case 'erin':
            return require('./_shared/assets/Erin_login_background.jpg');
        case 'pinterest':
            return require(`./_shared/pinterest/Erin_login_background.png`);
        case 'primaryaim':
            return require(`./_shared/primaryaim/Erin_login_background.png`);
        case 'sunrise':
            return require(`./_shared/sunrise/Erin_login_background.png`);
        case 'allied':
            return require(`./_shared/allied/Erin_login_background.png`);
        case 'trinity':
            return require(`./_shared/trinity/Erin_login_background.png`);
        case 'sevita':
            return require(`./_shared/sevita/Erin_login_background.png`);
        case 'heartland':
            return require(`./_shared/heartland/Erin_login_background.png`);
        case 'talentreef':
            return require(`./_shared/talentreef/Erin_login_background.png`);
        case 'referCX':
            return require(`./_shared/refercx/Erin_login_background.jpg`);
        case 'seaworld':
            return require(`./_shared/seaworld/Erin_login_background.png`);
        case 'ReferVets':
            return require(`./_shared/refervets/Erin_login_background.png`);
        case 'Apploi':
            return require(`./_shared/apploi/Erin_login_background.jpg`);
        case 'Twilio':
            return require(`./_shared/twilio/Erin_login_background.png`)
        case 'GoDaddy':
            return require(`./_shared/goDaddy/Erin_login_background.png`)
        case 'IQVIA':
            return require(`./_shared/iqvia/Erin_login_background.png`)
        case 'VILIVING':
            return require(`./_shared/viLiving/Erin_login_background.png`)
        case 'heartlandAffiliation':
            return require(`./_shared/heartland/Erin_login_affiliate_bg.png`)
        case 'northWestReferrals':
            return require(`./_shared/northWest/Erin_background_login.png`);
        case 'gannettFleming':
            return require(`./_shared/gannettFleming/Erin_login_background.png`)
        case 'mscReferrals':
            return require(`./_shared/msc/Erin_login_background.png`)
        default:
            return require('./_shared/assets/Erin_login_background.jpg');
    }
};

export const getWhiteLogo = () => {
    switch (getAppName()) {
        case 'erin':
            return require('./_shared/assets/erinwhite.png');
        case 'primaryaim':
            return require(`./_shared/primaryaim/erinwhite.png`);
        case 'pinterest':
            return require(`./_shared/pinterest/erinwhite.png`);
        case 'sunrise':
            return require(`./_shared/sunrise/erinwhite.png`);
        case 'allied':
            return require(`./_shared/allied/erinwhite.png`);
        case 'trinity':
            return require(`./_shared/trinity/erinwhite.png`);
        case 'sevita':
            return require(`./_shared/sevita/erinwhite.png`);
        case 'talentreef':
            return require(`./_shared/talentreef/erinwhite.png`);
        case 'heartland':
            return require(`./_shared/heartland/erinwhite.png`);
        case 'referCX':
            return require(`./_shared/refercx/erinlogo.png`);
        case 'ReferVets':
            return require(`./_shared/refervets/erinwhite.png`);
        case 'Apploi':
            return require(`./_shared/apploi/erinlogo.png`);
        case 'Twilio':
            return require(`./_shared/twilio/erinlogo.png`);
        case 'VILIVING':
            return require(`./_shared/viLiving/erinlogo.jpg`)
        case 'heartlandAffiliation':
            return require(`./_shared/heartland/erinwhite.png`);
        default:
            return require('./_shared/assets/erinwhite.png');
    }
};

export const getPrimaryColor = () => {
    switch (getAppName()) {
        case 'erin':
            return '#018dd3';
        case 'pinterest':
            return '#fd5b45';
        case 'primaryaim':
            return '#c90000';
        case 'sevita':
            return '#e08e3c';
        case 'talentreef':
            return '#172752';
        default:
            return '#018dd3';
    }
};

export const getAppFullName = () => {
    switch (getAppName()) {
        case 'erin':
            return 'ERIN';
        case 'pinterest':
            return 'Pinterest Talent Hub';
        case 'primaryaim':
            return 'Primary Aim Referrals';
        case 'sunrise':
            return 'Amplify Sunrise Referrals';
        case 'allied':
            return 'Partners In Employment';
        case 'trinity':
            return 'Trinity Health Referral Rewards';
        case 'sevita':
            return 'Sevita Health Referrals';
        case 'heartland':
            return 'Heart Land Referrals';
        case 'talentreef':
            return 'Talentreef Referrals';
        case 'referCX':
            return 'ReferCx Referrals';
        case 'ReferVets':
            return 'ReferVets';
        case 'Apploi':
            return 'Referrals By Apploi';
        case 'Twilio':
            return 'Twilio Employee Referrals';
        case 'GoDaddy':
            return 'BLOOM';
        case 'IQVIA':
            return 'IQVIA Referrals';
        case 'VILIVING':
            return 'Vi Living Talent Scout'
        case 'heartlandAffiliation':
            return 'Heartland Affiliation Referral';
        case 'northWestReferrals':
            return 'The North West Company';
        case 'gannettFlemingReferrals':
            return 'Gannett Fleming Emp. Referrals'
        default:
            return 'ERIN';
    }
};

export const getDomain = () => {
    switch (getAppName()) {
        case 'erin':
            return 'app.erinapp.com';
        case 'pinterest':
            return 'pinteresttalenthub.com';
        case 'primaryaim':
            return 'referrals.primaryaimllc.com';
        case 'sunrise':
            return 'referrals.sunriseseniorliving.com';
        case 'allied':
            return 'referrals.aus.com';
        case 'sevita':
            return 'referrals.sevitahealth.com';
        case 'trinity':
            return 'referrals.trinity-health.org';
        case 'heartland':
            return 'heartlanddentalcareers.com';
        case 'referCX':
            return 'refercx.results-cx.com';
        case 'Apploi':
            return 'employeereferrals.apploi.com'
        case 'Twilio':
            return 'employeereferrals.twilio.com'
        case 'talentreef':
            return 'referrals.talentreef.com'
        case 'GoDaddy':
            return 'referrals.gd3p.tools'
        case 'IQVIA':
            return 'referrals.iqvia.com'
        case 'VILIVING':
            return 'talentscout.viliving.com'
        case 'heartlandAffiliation':
            return 'heartlandaffiliationreferrals.com';
        case 'northWestReferrals':
            return 'refernwc.app'
        case 'gannettFleming':
            return 'referrals.gannettfleming.com'
        case 'mscReferrals':
            return 'my.referrals.mscdirect.com'
        default:
            return 'app.erinapp.com';
    }
};

export const getLightGrayLogo = () => {
    switch (getAppName()) {
        case 'erin':
            return require('./_shared/assets/erin_light_gray_logo.png');
        case 'pinterest':
            return require(`./_shared/pinterest/erin_light_gray_logo.png`);
        case 'primaryaim':
            return require(`./_shared/primaryaim/erin_light_gray_logo.png`);
        case 'sunrise':
            return require(`./_shared/sunrise/erin_light_gray_logo.png`);
        case 'allied':
            return require(`./_shared/allied/erin_light_gray_logo.png`);
        case 'talentreef':
            return require(`./_shared/talentreef/erin_light_gray_logo.png`);
        default:
            return require('./_shared/talentreef/erin_light_gray_logo.png');
    }
};

export const getErinSquare = () => {
    switch (getAppName()) {
        case 'erin':
            return require('./_shared/assets/erin_square.png');
        case 'pinterest':
            return require(`./_shared/pinterest/erin_square.png`);
        case 'primaryaim':
            return require(`./_shared/primaryaim/erin_square.png`);
        case 'sunrise':
            return require(`./_shared/sunrise/erin_square.png`);
        case 'allied':
            return require(`./_shared/allied/erin_square.png`);
        case 'talentreef':
            return require(`./_shared/talentreef/erin_square.png`);
        default:
            return require('./_shared/talentreef/erin_square.png');
    }
};

export const getErinLogo = () => {
    switch (getAppName()) {
        case 'erin':
            return require('./_shared/assets/erinlogo.png');
        case 'pinterest':
            return require(`./_shared/pinterest/erinlogo.png`);
        case 'primaryaim':
            return require(`./_shared/primaryaim/erinlogo.png`);
        case 'sunrise':
            return require(`./_shared/sunrise/erinlogo.png`);
        case 'allied':
            return require(`./_shared/allied/erinlogo.png`);
        case 'trinity':
            return require(`./_shared/trinity/erinlogo.png`);
        case 'sevita':
            return require(`./_shared/sevita/erinlogo.png`);
        case 'heartland':
            return require(`./_shared/heartland/erinlogo.png`);
        case 'talentreef':
            return require(`./_shared/talentreef/erinlogo.png`);
        case 'Twilio':
            return require(`./_shared/twilio/erinlogo.png`);
        case 'GoDaddy':
            return require(`./_shared/goDaddy/erinlogo.png`)
        case 'IQVIA':
            return require(`./_shared/iqvia/erinlogo.png`)
        case 'VILIVING':
            return require(`./_shared/viLiving/erinlogo.jpg`)
        case 'heartlandAffiliation':
            return require(`./_shared/heartland/erinlogo.png`);
        default:
            return require('./_shared/assets/erinlogo.png');
    }
};

export const getExternalLoginUrl = () => {
    switch (getAppName()) {
        case 'pinterest':
            return 'https://pinterest.okta.com/login/login.htm?fromURI=%2Fapp%2Fpinterest_pinteresttalenthub_1%2Fexkdxxlcmk1IsE1Fe2p7%2Fsso%2Fsaml%3FSAMLRequest%3DfVLLTsMwELzzFZHvTmI3VRurCaqAShVw4XXgUrmOS60mtvFuUOHrcVOeQuK2Xs3srGd2drrv2uRF%250ABzDOVoSlOUm0Va4x9qki93cLOiWn9ckMZNdyL%252BY9bu2Nfu41YDIH0AEj78xZ6DsdbnV4MUrf31xV%250AZIvoQWSZNxZ1iPBURm7aA9USkPJUdvLNRaUna9ClynXZoJGZxke4jyM1Sc4j0ViJw3J%252FR7odyoEq%250Avf9ur74qlK22uO3XK5bp%252Fa7Z71vV7dgSLthCcz%252FJANwgS5LleUVW46LIp%252BvNmuZsImkhlaJlMSpp%250Audk0DS%252BZmqpRhAL0emkBpcWK8JwzyjjlkzvGBctFMUnHRf5IkodPV%252FnB1eizBXH0sSJ9sMJJMCCs%250A7DQIVOJ2fn0lIlT44NAp15L6aLsYBEOycKGT%252BD%252F30DEN3QxQET9v8PWX9v90%252BRkpqQ%252BwY0biIyQB%250AXnzltypGbG3G5ePlLPu5Zf3x%252FH0r9Ts%253D%26RelayState%3DZXlKMWMyVnlVRzl2YkVsa0lqb2lkWE10WldGemRDMHlYelF6TVdKcE5UbGFTeUlzSW5CeWIzWnBaR1Z5VG1GdFpTSTZJbEJwYm5SbGNtVnpkQ0lzSW1Oc2FXVnVkRWxrSWpvaU1YRmhhR05vTTJjNWMyTXlPREZxT1RkdlltVmhkSFp5WW1VaUxDSnlaV1JwY21WamRGVlNTU0k2SW1oMGRIQnpPaTh2Y0dsdWRHVnlaWE4wZEdGc1pXNTBhSFZpTG1OdmJTOXpZVzFzTFdGMWRHZ3ZiRzluYVc0aUxDSnlaWE53YjI1elpWUjVjR1VpT2lKMGIydGxiaUlzSW5CeWIzWnBaR1Z5Vkhsd1pTSTZJbE5CVFV3aUxDSnpZMjl3WlhNaU9sc2lZWGR6TG1OdloyNXBkRzh1YzJsbmJtbHVMblZ6WlhJdVlXUnRhVzRpTENKbGJXRnBiQ0lzSW05d1pXNXBaQ0lzSW5Cb2IyNWxJaXdpY0hKdlptbHNaU0pkTENKemRHRjBaU0k2Ym5Wc2JDd2lZMjlrWlVOb1lXeHNaVzVuWlNJNmJuVnNiQ3dpWTI5a1pVTm9ZV3hzWlc1blpVMWxkR2h2WkNJNmJuVnNiQ3dpYm05dVkyVWlPaUo2Tm5aWlREUTVaamd0TUZWeWVuTkVNSEZsWm1SNFZuZ3djVVJRTUd0V2VrWjNjVzFTVm05TmJqTnhhVXQyWmpCbVNFcGxXRTlmTjBoNk5rWkpjVEJhVFRGZmJsZzRkRlJpY2s1dlpVWkdURzQzT1VKdlVUUnVVVkZPTkZGWk4yRmhSbnBhWW14bk5IQlpjRlpCVFVSelF5MVJVVmh3VW5oQ1NVZHRhV1Y1ZVhkMlprMW5OemRyVWpJMlIyRmFja1ZLWTBWcGFETkhVamxVU1hKcFdWODBTV0ZwZDBaVVQxbGZVemdpTENKelpYSjJaWEpJYjNOMFVHOXlkQ0k2SW5CcGJuUmxjbVZ6ZEM1aGRYUm9MblZ6TFdWaGMzUXRNaTVoYldGNmIyNWpiMmR1YVhSdkxtTnZiU0lzSW1OeVpXRjBhVzl1VkdsdFpWTmxZMjl1WkhNaU9qRTJOREEyTURjd05EY3NJbk5sYzNOcGIyNGlPbTUxYkd3c0luVnpaWEpCZEhSeWFXSjFkR1Z6SWpwdWRXeHNMQ0p6ZEdGMFpVWnZja3hwYm10cGJtZFRaWE56YVc5dUlqcG1ZV3h6WlgwPTptRDNNbVIwRHc0cERPM2dWWHUvZFRVNk5DR0lTekpoNGhrZFRuUXVyM0o0PToy';
        case 'sevita':
            return 'https://sevita.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Sevita&redirect_uri=https://referrals.sevitahealth.com/saml-auth/login&response_type=token&client_id=j52u24r1tk77egn9mhejjqehb';
        case 'seaworld':
            return 'https://seaworld.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=SeaWorld&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=2enbfa6a4ecst8r0eik8u4s5vv';
        case 'trinity':
            return 'https://referrals.trinity-health.org/trinity/login';
        case 'heartland':
            return 'https://heartlanddentalcareers.com/heartland/login';
        case 'referCX':
            return 'https://login.microsoftonline.com/ede30d57-2936-46a2-8b95-42bc53c39221/saml2?SAMLRequest=fZJPT6wwFMX3fgrSfYFpAaEZMPM0JhN147%2BXvI0p5TI2gZbXW4z66e0wjtGNyzbn3N%2FNOXd99joO%0A0Qs41NbUZBWnJAKjbKfNriYP95e0JGfNyRrlOLBJbGb%2FbG7h%2Fwzoow0iOB9859bgPIK7A%2FeiFTzc%0AXtfk2fsJRZI4wHnwSNVrLIM5npGCRE9ZLEf5bgNqZ7S3sbJjskAS3U3BNIWZQKKLANJG%2BmW748zB%0A7rSJR62cRdt7awZtYJkAHfC0y08pq3hBs0IyWrZVTjPWqpwrXjG2OmBItL2oyVPBC76qMklVL1ua%0AQZ7Tqi05XeW87FhfFIqpIEWcYWvQS%2BNrwlLGaFrQtLxPTwVPBWdxlaX%2FSPR4zJHtcwzJGhSH5Goy%0AOyOsRI3CyBFQeCXuNjfXIkjF5Ky3yg6kOQQtFqCLLq0bpf%2Fdu%2F%2FRHe0XqQDjtX%2F7wf7dLo8lkmYv%0AO5QiPlsROImvwp7%2BXG3a7fnfvl8n37dsPp8%2Fr6P5AA%3D%3D&RelayState=H4sIAAAAAAAAAG1S25KiMBD9F54X1FGR8c1hyvUC4iJet7aoCA1EQ4JJwMGt_fcNjm7Nwz510pdTp8_p31opgC8ZI9NYG6qPDkhI_SV8m4-OU3ubJNo3reCswjHwBcpBNfkgSiKFbu9ULSIYqLwPny4ohax9sShnZo8WOWOVRdNjpto4xJhDJNf-VHVmUhZi2GpxSIBHHwZ_IKpnxPKWQDnRUSmzFmEppvdxUTAqIKiLhoFkZ6BfiD3Sq5HrqKyIWAFCG_7U0FUowJRiyQyBVaRGs66B4vwOCznCREXVT3HcAGaMwidwgglovxSaRFKB05IQtS2Lwc4QIUDT_yddkBmLnyXKaNQwq_ntaL0uXa9diWzQbof1aXK-xvuOtXfCZLOtqB7kG7-TZ951XM_7_ZkcpE7cW1z8Q2AtR6mHFh3HDG5hcd3XLvS_63S3xjjz4rDcnQ7nW-V18lcrntnEH1m2O-kdrGWwFyd3-lZmdd__Mb6tfTsa8I_wWh3xe7cwzVkk5unK2b2evM1q424H9TuOGgGBV8AnTMgl41LR_-JPY4vx70wMlKOb2vGhsTKvOQkOSGJGA5zDCiJGY2VGx-z3zEG3131p8IVQ9adIjSUjKTk-lrLx7TN7133MuIPpGdN09ZxJEBHw5y8FlWNSuAIAAA.H4sIAAAAAAAAAAEgAN__8WGb2CrH2LdxhQNXbbiWUki0hdOsbaCJubSXx9HoQcQW2iJTIAAAAA.3';
        case 'Twilio':
            return 'https://twilio.okta.com/login/login.htm?fromURI=%2Fapp%2Ftwilio_erin_1%2Fexk1krp6l940BFJ1G1d8%2Fsso%2Fsaml%3FSAMLRequest%3DfZJbT%252BMwEIXf%252BRWR352Lt2mD1QR1t%252BqqFWglKEjLSzXEU7Ca2MbjcNlfT5oWBPvAo0dz5js6x9Ozl7aJntCTtqZkWZyyCE1tlTb3JbteL3jBzqqTKUHbCCdnXXgwl%252FjYIYVoRoQ%252B9Lpf1lDXor9C%252F6RrvL48L9lDCI5kkoRn3WgbQy%252BMO%252BIIFLiIoYV%252FtsfcGx1sXNs2GQCJVs4juf4esmjeQ7SBMDj7757dBRh04NxxtkGvzSZL8GWX7bwbN6ej9Odilf3OVJEQ2QHBouW8ZJsf%252BVaBQuB5UU%252F46G484QCF4qOtOsViq%252Bpx3htYEnW4NBTAhJKJVAieTng6XmdCilwKEedFccuim%252Ff4xD6%252BPlBD8hBYyTpvpAXSJA20SDLU8mp2cS77Vem8Dba2DasO%252BcoB6KOF9S2E77X7iVZ8O6xKNEGH1y%252Fs7%252BXw3h2r9muHPuSxEElOfnS1Wc3FH1iv6r%252FT5LPL6vj8%252BimqNw%253D%253D%26RelayState%3DH4sIAAAAAAAAAG2SX5OaMBTFvwvPFRFddX1TXFcUrX-waDudnQgXiCS5bBJ03E6_e4OunT70KcPJzY97z7m_rEqBXCEyP7EG5qMBROmG-zYbu19JOIsP1herlHimCcgl4WCKwgtlFI0eMwpC3x52jkVfuWUrFk5K2x2UXcdpp_1U5qZOQkIlxHq38U1prnWpBs0m8JLhFUBCClISpmx9A9sx8qYinDVIpfMmw4yKG0SVKBSE17JuQmMB4p_ePuXtcBEYVcVYgrIGPyxyUQaYCarRVtScwq4ntknCb1jghDJzmnpBkxqYo4A7OKUMrJ-Gpok2cFExZobGBLycMAYi-7-4AJ1j8rgSKOK6sz54ky73I3eqT6uXcNP9NmSJl1VOFSg_mKyzvVzm3oogCfnp8Do_xK4eLZ6n0-DIFud9dj1EO3E-9PY8Dp5C4iPQ4PRewOy93Jr_-afnozMev4ncP85jJ-1fXjFa6-8lc1uRV6Sj6qO69nO2v2wcb164O6e9j-aLcNkZJfxlpPvrjhzlUa8cNupojUVnkFNUeoVS137fs6kjsf9uiU04-TDzffprgqu3QgLRFEVIOWwhRpGYIFrdp16r5bRdt2YrZe4fBtVxDLWW9FjpOrO7evN8gjKgoqAi2z7epGZR4PcfXcWDr7cCAAA.H4sIAAAAAAAAAHvcMaVS8Zo3I3dRXfPmk2EZug2feVL9-ZrP5u9Sul9vVAgAXSjLRCAAAAA.3'
        case 'talentreef':
            return 'https://referrals.talentreef.com/talentreef/login'
        case 'IQVIA':
            return 'https://api.appscript.net/Common/Account/IQVIASSOLogin?countryCode=US&mobile=true'
        //return 'https://referrals.iqvia.com/iqvia/login'
        case 'GoDaddy':
            return 'https://godaddy.okta.com/app/godaddy_erinapp_1/exkvbeqesiJxyXaL00x7/sso/saml?SAMLRequest=fZJfTyoxEMXf%2FRSbvnf%2FFAS2YdeQS0w0%2BKLoNb6QYXfAXtm2droIfnrLIjfqg4%2BdnDO%2FyTkdX%2ByaTbRFR8rogmVxyiLUlamVXhfsfn7JR%2ByiPBsTNBth5aT1z%2FoWX1skH02I0Png%2B2M0tQ26O3RbVeH97axgz95bkkmyNjXU9T6G4Ixb4gjkuYihgXcTOGutvIkr0yQdIVG1dUg2LEQWTQNFafDdaT8XmhcPnRGsPQ0X6ILe2kWW4O5lu8RXJHW92z%2FCLE13w4TIdBwWXU0LthgN8ryPacYxz5e83wPBQQxX%2FHwlBoO8yvvZYBmkRC1eafKgfcFEKgTPUp725lkuz4ey14uH%2FdETix5OIYpDiCFWTfIYW8Fap6UBUiQ1NEjSV%2FJucjOTQSqtM95UZsPKY8qyA7ro0rgG%2FO%2Few0TVfNVJJWqv%2FP4b%2B3c7nBpk5UF2LEV%2BtiLJyv%2BFLf5W6xFN92%2F%2FxsnXK8vP5%2FevUX4A&RelayState=H4sIAAAAAAAAAD1RXXObMBD8L3o2GEvGlnmLS4mTGDs2Q-Om08kIEAJbH4CEien0v1eeTvu0e3O7N3d7vwABAei1Q4k2Dvx4yxnW4W04gwnIbOdRhaQobrbKbYWu8DxfMFOuLiUrzn1bsqwxPlTMCgorqIxpdDCddrSkXUe4dlmBGtcoxfVUE8Ed0ptqyhWrpbVQazHqQu-8tDx5iLeWMhD8AGTQbq6YrI1ydW1Rur2mnUsK8dcrSM0tqobKurCkqZSkd-xUWXMKfk7Axc6MsHx_Nq9ReB4h4c17nbQ7U-H6o0VPkdQeXAv4GCe75iRWyOzlIYxbpngrdtWq_voMeb_1_Y3Db8J5y3SYvGz3L8cvjXwKD9-7DT2TAaP1tTkOmz6Se0we5GnjpbMR1kPSKmquiMcHUaahFyOdrvFypfpjWL2a9DTKSMQjXFa-SOm3T2WX53Zjpop75u49Kvf_a1wiyKjkv0hyJaxcgGC2WMwxXHo-sqeDoLSh0wno7JyM0Nmc5tRBJZk58wwiB2fLlYMwoRjPCm-RQ_D7D_Z9nXICAgAA.H4sIAAAAAAAAAIuKMF6zZKV3pF3tMrOM9qO3WksMT2m1JN8qYZTfI3o11AIA5Tt-aCAAAAA.3'
        case 'heartlandAffiliation':
            return 'https://heartlandaffiliationreferrals.com/har/login'
        case 'allied':
            return 'https://pie.aus.com/aus/login'
        case 'gannettFleming':
            return 'https://referrals.gannettfleming.com/gf/login';
    }
};
