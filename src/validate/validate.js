// 手机号验证
export function isvalidPhone(str) {
    // /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    return reg.test(str)
}
// 邮箱验证
export function isvalidEmailAddress(str) {
    const reg = /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,4})$/
    return reg.test(str)
}
// 统一社会信用代码验证
export function isvalidCreditCode(str) {
    const reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
    return reg.test(str)
}
// 账户验证
export function isvalidUserName(str) {
    const reg = /^(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{4,23}$/
    return reg.test(str)
}
// 数字
export function isNumber(str) {
    const reg = /^[0-9]*$/
    return reg.test(str)
}

// 根据身份证判断是否成年
export function ShiFanManShiBaSui(iIdNo) {
    var tmpStr = ""; // 首先声明了一个变量来接收身份证上的出生日期
    if (iIdNo.length == 15) {//如果身份证位
        tmpStr = iIdNo.substring(6,12);
        tmpStr = "19" + tmpStr;//十五位身份证 需要获取到年加  19
        tmpStr = tmpStr.substring(0, 4)+ "-" +tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
    }
    else {
        tmpStr = iIdNo.substring(6,14);
        tmpStr = tmpStr.substring(0, 4)+ "-" + tmpStr.substring(4,6) + "-" +tmpStr.substring(6)
    }
    //var date = "";//今天的日期
    var year = new Date().getFullYear();//
    var nian = parseInt(tmpStr.substring(0, 4));//获取到出生的年
    if (year > nian + 18) {
        // console.log(iIdNo + "成年");
        return true
    } else {
        if (year == nian + 18) {
            var yue = new Date().getUTCMonth()+1;// 拿到今天的月份
            var yuefen = parseInt(tmpStr.substring(5, 7));//获取到身份证的月分
            if (yuefen < yue) {
                // console.log(iIdNo + "成年");
                return true
            } else {
                if (yuefen == yue) {
                    var ri = new Date().getDate();
                    var riqi =parseInt(tmpStr.substring(8, 10));
                    if (ri < riqi) {
                        // console.log(iIdNo + "成年");
                        return true
                    } else {
                        // console.log(iIdNo + "未成年");
                        return false
                    }
                } else {
                    // console.log(iIdNo + "未成年");
                    return false
                }
            }
        } else {
            // console.log(iIdNo + "未成年");
            return false
        }
    }
}

// 根据身份证判断年龄
export function IdCard(UUserCard) {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
        age++;
    } if(age >= 70){
        return true
    }
}
export function IdCard2(UUserCard) {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
        age++;
    } if(age >= 60 && age <=70){
        return true
    }
}

// 身份证格式验证
export function Identity(str) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    return reg.test(str)
}