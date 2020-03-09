
/**
 * EzRoadApp
 * Class : StrDateUtils
 * Descrition : 문자열 처리 공통 클래스 입니다. 
 *
 * Created By 최영호 on 2020-02-28
 */
class StrDateUtils {

    /**
     * Date객체에서 월을 추출합니다. 
     * 10월 이전의 달에 대하여 
     * Prefix "0"을 첨가 합니다. 
     * @param {Date} dateObj 
     */
    getMonthString(dateObj) {
        var monthStr = dateObj.getMonth() + 1;
        if (monthStr < 10)
            monthStr = "0" + monthStr;
        else
            monthStr = "" + monthStr;
        return monthStr;
    }

    /**
     * Date객체에서 월을 추출합니다. 
     * 10월 이전의 일에 대하여 
     * Prefix "0"을 첨가 합니다. 
     * @param dateObj 
     */
    getDayString(dateObj) {
        var dayStr = dateObj.getDate();
        if (dayStr < 10)
            dayStr = "0" + dayStr;
        else
            dayStr = "" + dayStr;
        return dayStr;
    }


    leadingZeros(n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    }




    /**
     * Date Object를 문자열로 변환 합니다. 
     * @param dateObj
     * @param del
     * @return
     */
    getDateTimeString(dateObj, del, subDel) {
        var result = 
            this.leadingZeros(dateObj.getFullYear(), 4) + del +
            this.leadingZeros(dateObj.getMonth() + 1, 2) + del +
            this.leadingZeros(dateObj.getDate(), 2) + 
            this.leadingZeros(dateObj.getHours(), 2) + subDel +
            this.leadingZeros(dateObj.getMinutes(), 2) + subDel +
            this.leadingZeros(dateObj.getSeconds(), 2);
        return result;
    }

    /**
     * Date Object를 문자열로 변환 합니다. 
     * @param dateObj
     * @param del
     * @return
     */
    getDateString(dateObj, del) {
        var result = "";
        var monthStr = this.getMonthString(dateObj);
        var dayStr = this.getDayString(dateObj);
        result = "" + dateObj.getFullYear() + del + monthStr + del + dayStr;
        return result;
    }

    /**
     * 날자 문자열을 delemeter 단위로 구분 합니다. 
     * @param str
     * @param del
     * @param subdel
     * @returns {String}
     */
    dateFormatting(str, del, subdel) {
        var result = "";
        if (str != "" && str != null) {
            if (str.length == 14) {
                if (subdel == undefined) subdel = ":";

                result = str.substring(0, 4) + del + str.substring(4, 6) + del + str.substring(6, 8) + ' ' +
                    str.substring(8, 10) + subdel +
                    str.substring(10, 12) + subdel +
                    str.substring(12);
            }
            else if (str.length == 8) {
                result = str.substring(0, 4) + del + str.substring(4, 6) + del + str.substring(6);
            }
        }
        else {
            result = str;
        }
        return result;
    }
}


export { StrDateUtils };