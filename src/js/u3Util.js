/**
 * Created by ABSOLUTE on 2018/1/4.
 */
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
/**
 * 去掉字符串前后的空白字符
 * @param text
 * @returns {string}
 */
export function trim( text ) {
    return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
}
/**
 * 将毫秒转换成  hh:mm:ss  的形式
 * @param mill
 */
export function transformTime(mill) {
    if( typeof mill !== 'number' ) return '';
    if( mill <= 0 ) return '00:00';
    mill = mill/1000;
    let ss = parseInt( mill%60 );
    let mm = parseInt( mill/60 ) % 60;
    let hh = parseInt( mill/60/60 );
    ss = ss > 9 ? ss : ('0'+ss);
    mm = mm > 9 ? mm : ('0'+mm);
    hh = hh > 9 ? hh : ('0'+hh);
    return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
}
/**
 * 阻止事件冒泡
 * @param e
 */
export function stopBubble(e) {
    if( e && e.stopPropagation ){
        e.stopPropagation();
    }else{
        // IE 中阻止事件冒泡的方式
        global.event.cancelBubble = true;
    }
}
/**
 * 阻止浏览器默认行为
 * @param e
 */
export function stopDefault(e) {
    if( e && e.preventDefault ){
        e.preventDefault();
    }else{
        // IE 中阻止事件默认动作的方式
        global.event.returnValue = false;
    }
}
export var RAF = (function() {
    return global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function(callback) {
            global.setTimeout(callback, 1000 / 60);
        };
})();
export var currentScriptPath = (()=>{
    var scripts = document.getElementsByTagName("script");
    var currentScript = scripts[scripts.length - 1];
    var currentScriptSrc = document.querySelector ? currentScript.src : currentScript.getAttribute("src");
    var rootPath = currentScriptSrc.substring(0, currentScriptSrc.search( /U3CompoLib([^\/\?]*)?(?=\.js)\.js/ig ) );
    return rootPath.replace(/^file:\/\//g, '');
})();
function recursion(obj, data={}){
    for(let key in obj){
        if( typeof obj[key] == 'object' && Object.keys(obj[key]).length>0 ){
            data[key] = recursion(obj[key])
        }else{
            data[key] = obj[key]
        }
    }
    return data
}
export function cloneDeep(obj){
    if( typeof obj !== 'object' || Object.keys(obj).length === 0 ){
        return obj
    }
    let resultData = {}
    return recursion(obj, resultData)
}
/**
 * 去掉字符串中的"font-size"、"font-familly"样式
 * @param text
 * @returns {string}
 */
export function clearFSizeFFamilly(text){
    if( typeof text !== 'string'){
        return
    }
    text = text.replace(/font-size:\s*\d+px/g,"").replace(/(font-family:[^><;"]*(;)?)/ig,"");
    return text
}
/**
 * 版本判断当前版本是否满足版本要求
 * @param  {String} currentVersion [当前版本] '4.0.6'(PC 3.0.0.184)
 * @param  {String} minimumVersion [要求版本] '3.2.2'(PC 3.0.0.184)
 * @return {Boolean}                [description]
 */
export function versionJudgment(currentVersion, minimumVersion){
    var c = currentVersion.split('.');   //4 0 0
    var m = minimumVersion.split('.');   //3 2 2
    var f = true;  // 默认大于最低版本号
    for( var i = 0, l = m.length; i < l; i++ ){
        var t = c[i] || 0;
        if( t > m[i] ){
            break;
        }else if( t < m[i] ) {
            f = false;
            break;
        };
    }
    return f;
}

/*保留x位小数*/
export const reserveDecimal = (num,n=0) => {
    var numbers = '';
    // 保留几位小数后面添加几个0
    for (var i = 0; i < n; i++) {
        numbers += '0';
    }
    var s = 1 + numbers;
    // 如果是整数需要添加后面的0
    var spot = "." + numbers;
    // Math.round四舍五入  
    //  parseFloat() 函数可解析一个字符串，并返回一个浮点数。
    var value = Math.round(parseFloat(num) * s) / s;
    // 从小数点后面进行分割
    var d = value.toString().split(".");
    if (d.length == 1) {
        value = value.toString() + spot;
        return value;
    }
    if (d.length > 1) {
        if (d[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}