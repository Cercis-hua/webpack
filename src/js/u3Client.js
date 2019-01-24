/**
 * Created by ABS on 2017/12/28.
 */
import u3Event from './u3Event';

var u3Client = new u3Event();

var jsObj = global.jsObj || undefined;
var jsChapterObj = global.jsChapterObj || undefined;

var jsApp;
if (typeof pageType != 'undefined' && pageType == 1) {  // 非学习页面
    jsApp = jsChapterObj;
} else if (typeof pageType != 'undefined' && pageType == 2) {   // 学习页面
    jsApp = jsObj;
}else{
    jsApp = jsObj || jsChapterObj || {};
}

/**
 * 获取书本信息
 */
function getBookInfo() {
    var bookInfo;
    if ( typeof jsApp.getBookInfo === 'function') {

        try{
            bookInfo = JSON.parse( jsApp.getBookInfo() );
        }catch (e){
            console.error('解析 bookInfo 出错');
            console.log(e);
        }

    }else{
        return;
    }

    var bookObj = {};
    bookObj.bookId = bookInfo.bookId;
    bookObj.bookName = bookInfo.bookName;
    bookObj.isFree = bookInfo.isFree;
    bookObj.productId = bookInfo.productId;
    bookObj.studyPro = bookInfo.studyPro;
    bookObj.chapters = [];
    bookObj.authDate = bookInfo.authDate;
    bookObj.wordsTotal = bookInfo.wordsTotal;
    bookObj.finishWord = bookInfo.finishWord;
    bookObj.stageId = bookInfo.stageId;
    bookObj.subjectId = bookInfo.subjectId;
    bookObj.startTime = bookInfo.startTime;
    bookObj.endTime = bookInfo.endTime;

    var _chapters = {};
    var _tasks = {};
    var _pages = {};

    bookInfo.children.forEach(function (item, index) {
        switch (item.type) {
            case 1:
                if (typeof _chapters[item.id] == 'undefined') {
                    _chapters[item.id] = item;
                }
                if (typeof item.parentId == 'undefined' || item.parentId == "") {
                    bookObj.chapters[item.order - 1] = _chapters[item.id];
                }
                break;
            case 2:
                if (typeof _pages[item.id] == "undefined") {
                    _pages[item.id] = item;
                }
                break;
            case 3:
                if (typeof _tasks[item.id] == 'undefined') {
                    _tasks[item.id] = item;
                }
                break;
        }
    });

    for (var chapterId in _chapters) {
        if (!_chapters.hasOwnProperty(chapterId)) continue;
        var chapter = _chapters[chapterId];
        if (chapter && typeof chapter.parentId != 'undefined' && chapter.parentId != '') {
            if (typeof _chapters[chapter.parentId].chapters == 'undefined') {
                _chapters[chapter.parentId].chapters = [];
            }
            _chapters[chapter.parentId].chapters.push(chapter);
        }
    }

    for (var pageId in _pages) {
        if (!_pages.hasOwnProperty(pageId)) continue;
        var page = _pages[pageId];
        if (_tasks[page.taskId]) {
            if (_tasks[page.taskId] && typeof _tasks[page.taskId].pages == 'undefined') {
                _tasks[page.taskId].pages = [];
            }
            _tasks[page.taskId].pages.push(page);
        }
        ;
        if (_chapters[page.parentId]) {
            if (typeof _chapters[page.parentId].pages == 'undefined') {
                _chapters[page.parentId].pages = [];
            }
            _chapters[page.parentId].pages.push(page);
        }

    }

    for (var taskId in _tasks) {
        if (!_tasks.hasOwnProperty(taskId)) continue;
        var task = _tasks[taskId];
        if (_chapters[task.parentId]) {
            if (typeof _chapters[task.parentId].tasks == 'undefined') {
                _chapters[task.parentId].tasks = [];
            }
            _chapters[task.parentId].tasks.push(task);
        } else {
            console.log('id为' + task.parentId + '的chapter下面没有tasks');
        }

        if (typeof task.pages != 'undefined') {
            task.pages.sort(function (a, b) {
                return a.order - b.order;
            });
        }
    }

    for (var chapterId in _chapters) {
        if( !_chapters.hasOwnProperty(chapterId)) continue;
        var chapter = _chapters[chapterId];
        if (typeof chapter.pages != 'undefined') {
            chapter.pages.sort(function (a, b) {
                return a.order - b.order;
            });
        }
        if (typeof chapter.chapters != 'undefined') {
            chapter.chapters.sort(function (a, b) {
                return a.order - b.order;
            })
        }
        if (typeof chapter.tasks != 'undefined') {
            chapter.tasks.sort(function (a, b) {
                return a.order - b.order;
            })
        }
    }

    return {bookObj: bookObj, chapters: _chapters, tasks: _tasks, pages: _pages};
}

/**
 * 获取单独的章节信息
 */
function parseSpecialChapter(taskId){
    var bookInfo,taskObj={};
    if ( typeof jsApp.getBookInfo === 'function') {
        try{
            bookInfo = JSON.parse( jsApp.getBookInfo() );
            taskObj= bookInfo.children.find(chp=>chp.id === taskId) || {};
            return taskObj;
        }
        catch (e){
            console.error('解析 bookInfo 出错');
            console.log(e);
        }
    }else{
        return;
    }
}


/**
 * 获取客户端信息
 * @param  {Boolean} isJSON [是否需要JSON数据]
 * @return {String}         [客户端信息] UP366-ANDROID-TEACHER-V1.0.0
 * @return {Object} {isIOS:Boolean,isStudent:Boolean,currentVersion:'1.0.0'}
 * 获取当前教材的书本信息
 */
function loadBookInfo() {
    var bkInfo = '';
    if(typeof jsApp.loadBookInfo === 'function'){
        bkInfo = JSON.parse(jsApp.loadBookInfo());
    }
    return bkInfo;
}

/**
 * 获取当前教材的书本信息
 */
function loadChapterInfo() {
    var chapterInfo = '';
    if(typeof jsApp.loadChapterInfo === 'function'){
        chapterInfo = JSON.parse(jsApp.loadChapterInfo());
    }
    return chapterInfo;
}

/**
 * 获取当前task信息
 */
function loadTaskInfo() {
    var taskInfo = '';
    if(typeof jsApp.loadTaskInfo === 'function'){
        if(jsApp.loadTaskInfo()){
            taskInfo = JSON.parse(jsApp.loadTaskInfo());
        }
    }
    return taskInfo;
}

/**
 * 获取客户端信息
 * @param  {Boolean} isJSON [是否需要JSON数据]
 * @return {String}         [客户端信息] UP366-ANDROID-TEACHER-V1.0.0
 * @return {Object} {isIOS:Boolean,isStudent:Boolean,currentVersion:'1.0.0'}
 */
function getClientInfo(isJSON=false){
    if( typeof jsApp.getClientInfo === 'function'){
        let clientInfo = jsApp.getClientInfo();
        if(isJSON){
            const isIOS = clientInfo.indexOf("IOS") >= 0,
                isStudent = clientInfo.indexOf("TEACHER") < 0,
                currentVersion=/((\d+\.)+\d+)/.exec(clientInfo)[0],
                isPC = clientInfo.indexOf("PC") >= 0,
                isAndroid = clientInfo.indexOf("ANDROID") >= 0;
            clientInfo = {isIOS,isPC,isAndroid,isStudent,currentVersion};
        }
        return clientInfo;
    }
}

/**
 * 开始录音
 * @param recordName [String] 录音ID
 * @param netfiles [String]  用逗号拼接的net文件路径
 * @param partType [Number] 录音类型0-partA；1-partB; 2-partC
 */
function startRecord(recordName, netfiles, partType){
    if( typeof jsApp.startRecord === 'function' ){
        console.log('开始录音 ' + recordName + ' ' + netFiles);
        jsApp.startRecord(recordName, netfiles, partType);
    }
}

/**
 * 开始录音，可以指定难度系数以及录音波形图
 * @param params params 的结构如下：
 *  {
 *      recordName: '录音ID', // String
 *      netFiles: 'net相对路劲，对个net文件采用逗号逗号隔开',    // String
 *      partType: 录音类型0-partA；1-partB; 2-partC, // Number
 *      diff: 录音难度系数, // Number
 *      fftStryle: 录音波形图样式：0-不显示；1-柱状图；2-波形图,   // Number
 *      samplingRate: 波形图抽样数量   // Number
 *  }
 *
 */
function startRecordWithParams(params) {
    if( typeof jsApp.startRecordWithParams === 'function' ){
        console.log('开始录音 ' + params.recordName + ' ' + params.netFiles);
        jsApp.startRecordWithParams( JSON.stringify(params) );
    }
}

/**
 * 停止录音
 * @param recordName [String] 录音ID
 */
function endRecord(recordName) {
    if( typeof jsApp.endRecord === 'function' ){
        console.log('停止录音 ' + recordName );
        jsApp.endRecord( recordName );
    }
}

/**
 * 播放音频
 * @param id [String] 播放器id
 * @param src [String] 音频路径
 * @param type [Number]
 *  播放音频类型
 *  1 代表即将播放的是一个普通音频文件，对应的src代表该音频文件相对于当前页面的一个相对路径
 *  2 代表即将播放的是一个录音文件，对应点src代表该录音文件的名称
 *  3 代表即将播放的是一个下载的音频文件
 *  4 代表即将播放的是一个绝对路径的音频文件
 * @param seek [Number]  定点播放参数，默认 0
 * @return [Number] 要播放的音频时长，毫秒
 */
function playAudio(id, src, type, seek) {
    type = type || 1;
    seek = seek || 0;
    var duration = 0;
    if( typeof jsApp.playAudio === 'function' ){
        duration = jsApp.playAudio(id, src, type, seek);
    }
    return duration;
}

/**
 * 播放音频，支持波形图，默认不现实波形
 * @param id 播放器id
 * @param src 音频路径
 * @param type
 *  播放音频类型
 *  1 代表即将播放的是一个普通音频文件，对应的src代表该音频文件相对于当前页面的一个相对路径
 *  2 代表即将播放的是一个录音文件，对应点src代表该录音文件的名称
 *  3 代表即将播放的是一个下载的音频文件
 *  4 代表即将播放的是一个绝对路径的音频文件
 * @param seek 定点播放参数，默认 0
 * @param fftStyle 波形图样式：0-不显示；1-柱状图；2-波形图,   // Number
 * @param samplingRate: 波形图抽样数量   // Number
 * @param autoDestroy: 视频播放器是否销毁  //默认为0 不销毁， 1 销毁
 */
function playAudioWithParams({id, src, type, seek = 0, fftStyle = 1, samplingRate = 12, autoDestroy }){
    var duration = 0;
    if( typeof jsApp.playAudioWithParams === 'function' ){
        duration = jsApp.playAudioWithParams( JSON.stringify( {
            id: id,
            src: src,
            type: type,
            seek: seek,
            fftStyle: fftStyle,
            samplingRate: samplingRate,
            autoDestroy:autoDestroy
        } ) );
    }
    return duration;
}
/**
 * 获取当前音频播放进度
 * @param id [String] 播放器id
 * @return [Number] 当前音频播放到的时间点，毫秒
 */
function getAudioCurrentTime(id){
    if( typeof jsApp.getAudioCurrentTime === 'function' ){
        return jsApp.getAudioCurrentTime(id) || 0;
    }
}
/**
 * 暂停播放音频
 * @param id [String] 播放器id
 */
function pausePlayAudio(id){
    if( typeof jsApp.pausePlayAudio === 'function' ){
        return jsApp.pausePlayAudio(id);
    }
}
/**
 * 暂停播放音频
 * @param id [String] 播放器id
 */
function resumePlayAudio(id) {
    if( typeof jsApp.resumePlayAudio === 'function' ){
        return jsApp.resumePlayAudio(id);
    }
}
/**
 * 停止播放音频
 * @param id [String] 播放器id
 * @return {*}
 */
function stopPlayAudio(id) {
    if( typeof jsApp.stopPlayAudio === 'function' ){
        return jsApp.stopPlayAudio(id);
    }
}

/**
 * 页面切换状态
 * 0 默认可左右滑动
 * 1 禁止左滑
 * 2 禁止右滑
 * 3 同时禁止左滑和右滑
 */
export let pageSlideState = 0;

/**
 * 禁止切换页面
 * @param direction
 *      0  左滑
 *      1  右滑
 *      2  同时设置左滑和右滑
 * @param state
 *      0  激活
 *      1  禁用
 */
function disableSlide(direction, state){
    if( direction === 0 || direction === 1 ){
        if( typeof jsApp.disableSlideDirection === 'function' ){
            jsApp.disableSlideDirection(direction, state);
        }
    }else if( direction === 2 ){
        if( typeof jsApp.disableSlide === 'function' ){
            jsApp.disableSlide(state);
        }
    }

    // 记录页面滑动状态
    switch( pageSlideState ){
        case 0:
            if( state === 1 ){
                if( direction === 0 ){
                    pageSlideState = 1;     // 禁止左滑
                }else if( direction === 1 ){
                    pageSlideState = 2;     // 禁止右滑
                }else if( direction === 2 ){
                    pageSlideState = 3;     // 同时禁止左滑和右滑
                }
            }
            break;
        case 1:
            if( state === 1 && ( direction === 1 || direction === 2 ) ){
                pageSlideState = 3;     // 同时禁止左滑和右滑
            }else if( state === 0 && ( direction === 0 || direction === 2 ) ){
                pageSlideState = 0;     // 回复默认状态
            }
            break;
        case 2:
            if( state === 1 && ( direction === 0 || direction === 2 ) ){
                pageSlideState = 3;     // 同时禁止左滑和右滑
            }else if( state === 0 && ( direction === 0 || direction === 2 ) ){
                pageSlideState = 0;     // 回复默认状态
            }
            break;
        case 3:
            if( state === 0 ){
                if( direction === 0 ){
                    pageSlideState = 2;     // 禁止右滑
                }else if( direction === 1 ){
                    pageSlideState = 1;     // 禁止左滑
                }else{
                    pageSlideState = 0;     // 回复默认状态
                }
            }
    }
}

/**
 * loadPageInfo
 * @return json对象
 *
 {
     chapterId: '',
     pageId: '',
     pageNum: '',
     displayName: ''
 }
 */
function loadPageInfo(){
    var pInfo = '';
    if(typeof jsApp.loadPageInfo === 'function'){
        pInfo = jsApp.loadPageInfo();
    }
    return pInfo?JSON.parse(pInfo):'';
}

/**
 * 获取当前chapter下面的所有page的pageId,用逗号拼接成字符串
 */
function getPageIds(){
    var ids = '';
    if(typeof jsApp.getPageIds === 'function'){
        ids = jsApp.getPageIds();
    }
    return ids;
}

/**
 * 保存数据
 * @param key
 * @param value
 */
function saveData(key, value) {
    if (typeof value == 'undefined') return;
    value = JSON.stringify(value);
    if(typeof jsApp.saveData === 'function'){
        jsApp.saveData(value,key);
    }
}

/**
 * 获取数据
 * @param key
 * return json对象
 */
function loadData(key) {
    if (!key) return null;
    var d = '';
    if(typeof jsApp.loadData === 'function'){
        d = jsApp.loadData(key);
    }
    return d?JSON.parse(d):'';
}

/**
 * submitEleAttr 提交每道题做答数据
 * @param  Array a
 *
 [{
        elementId:'string',
        elementType: number,
        elementAttr: {
            question_id:'string',
            question_type: number,
            order:number,
            user_score:number,
            user_answer:'string',
            result:number,
            record_url:'string'
        }
     }]
 *  该接口只适用jsObj对象
 */
function submitEleAttr(a){
    if(typeof jsApp.submitEleAttr === 'function'){
        jsApp.submitEleAttr(a);
    }
}

/**
 * submitTask 提交task数据
 * @param  json对象 data
 *  {
        taskId: 'string',
        taskNo: int,
        score: float, task成绩
        chapterId: 'string',
        percent: float task完成率
    }
 该接口只适用于jsObj对象
 */
function submitTask(data){
    if(typeof jsApp.submitTaskV1 === 'function'){
        jsApp.submitTaskV1(JSON.stringify(data));
    }
}

/**
 * 注册客户端的相关事件的回调函数
 * String  event     事件名称
 *                   EVT_DOWNLOAD_PROGRESS   注册监听下载进度事件
 *                   EVT_BACKBTN_CLICK       注册监听返回按钮的点击事件
 *                   EVT_CHAPTER_REFRESHED   注册监听章节列表刷新成功事件
 *                   EVT_REFRESH_CHAPTER     注册从从学习页面返回目录刷新章节信息
 * callback          事件回调
 */
function registerEvent(event, callback) {
    if(typeof jsApp.registerEvent === 'function'){
        jsApp.registerEvent(event, callback);
    }
}

/**
 * unRegisterEvent 注销客户端相关事件
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function unRegisterEvent(event) {
    if (typeof jsApp.unRegisterEvent === 'function') {
        jsApp.unRegisterEvent(event);
    }
}

/**
 * 获取客户端上传队列中还未上传成功的task信息
 */
function getTasksUploadStatus(){
    var tInfo = '';
    if(typeof jsApp.getTasksUploadStatus === 'function'){
        tInfo = jsApp.getTasksUploadStatus();
    }
    return tInfo?JSON.parse(tInfo):'';
}

// 手动上传成绩
function manualUploadTask() {
    if (typeof jsApp.manualUploadTask === 'function') {
        jsApp.manualUploadTask();
    }
}
/**
 * 获取pc端上传队列中还未上传成功的task信息
 * @param bookId
 * @param taskId
 * 传bookId与taskId查询指定task,否则查询全部task
 */
function getBookTaskStatus(bookId,taskId) {
    if (typeof jsApp != 'undefined' && typeof jsApp.getBookTaskStatus == 'function') {
        var res = '';
        if(arguments.length > 1){
            res = bookId && taskId && jsApp.getBookTaskStatus(bookId,taskId) || jsApp.getBookTaskStatus();
            return typeof res === 'string' ? JSON.parse(res) : res;
        }else{
            res = arguments[0] && jsApp.getBookTaskStatus(arguments[0]) || jsApp.getBookTaskStatus();
            return typeof res === 'string' ? JSON.parse(res) : res;
        }
    }
}
/**重新上传   PC适用
 * @param taskId   传taskId就获取当前task的上传信息
 */
function retryUploading(taskId) {
    if (typeof jsApp != 'undefined' && typeof jsApp.retryUploading == 'function') {
        return JSON.parse(jsApp.retryUploading(taskId));
    }
}
/**
 * [getBookId 获取书的id]
 * @return {[type]} [description]
 */
function getBookId() {
    var id = '';
    if (typeof jsApp.getBookId == 'function') {
        id = jsApp.getBookId();
    }
    return id;
}

/**
 * 手机端打开测验
 */
function openTestChapter(chapterId, paperId) {
    if (typeof jsApp.openTestChapter == 'function') {
        jsApp.openTestChapter(chapterId, paperId);
    }
}

/**
 * pc端打开测验
 * url 打开测验的地址
 */
function openTest(url) {
    if (typeof jsApp.openTest == 'function') {
        jsApp.openTest(url);
    }
}

/**
 * 关闭当前页面
 */
function close() {
    if (typeof jsApp.closePage == 'function') {
        jsApp.closePage();
    }
}
/**
 * 获取用户真实姓名
 */
// function getUserInfo() {
//     var tInfo = '';
//     console.log(321);
//     if (typeof jsApp.getUserInfo == 'function') {
//         console.log(123);
//         tInfo = jsApp.getUserInfo();
//     }
//     return tInfo?JSON.parse(tInfo):'';
// }

function getUserInfo() {
    var userInfo = "";
    if (typeof AppInfo != 'undefined' && typeof AppInfo.getUserInfo == 'function') {
        userInfo = AppInfo.getUserInfo();
    }
    if (userInfo && userInfo != '') {
        userInfo = JSON.parse(userInfo);
    }
    return userInfo;
}

/**
 * jsObj 打开新页面
 * url 页面路径，相对路径或者绝对路径
 * mode 0 当前webview加载新页面   1 弹出新页面
 */
function open(url, mode) {
    if (typeof mode == 'undefined') {
        mode = 1;
    }
    if (typeof jsApp.open == 'function') {
        jsApp.open(url, mode);
    }
}

/**
 * [updateNavigationTitle 修改原生标题]
 * @return {[type]} [description]
 */
function updateNavigationTitle(s) {
    if (typeof jsApp.updateNavigationTitle == 'function') {
        jsApp.updateNavigationTitle(s);
    }
}

/**
 * 返回到书架
 */
function backToBookshelf() {
    if (typeof jsApp.backToBookshelf == 'function') {
        jsApp.backToBookshelf();
    }
}

/**
 * 返回加载目录文件夹中的特定页面
 * @param file String 页面名称
 */
function jsCharpterObjBackToCatalog(file) {
    // if(!file){
    // 	file = "bookCatalog.html";
    // }
    if (typeof jsApp && typeof jsApp.backToCatalog == 'function') {
        jsApp.backToCatalog(file);
    }
}

/**
 * 购买
 * @param {String} [productId] [产品ID]
 */
function buyBook(productId) {
    if (typeof jsApp.buyBook == 'function') {
        jsApp.buyBook(productId);
    }
}
/**
 * [忽略连续点击事件]
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
function ignorClick(ele) {
    if (ele && ele.ignorClick) return true;
    ele.ignorClick = true;
    setTimeout(function () {
        ele.ignorClick = false;
    }, 500);
}
//目录页打开错题本
function openWrongQuestion() {
    if (typeof jsApp.openWrongQuestion == 'function') {
        jsApp.openWrongQuestion();
    }
}
//目录页打开生题本
function openWordNote() {
    if (typeof jsApp.openWordNote == 'function') {
        jsApp.openWordNote();
    }
}
/**
 * [viewTraining 自主练习pc端调用方法]
 * @param  {[type]} str [参数拼接的字符串 "studystage="+studyStage+"&subject="+subject+"&diffcultLevel="+diffcultLevel+"&knowledgeId="+knowledgeId]
 * @return {[type]}     [description]
 */
function viewTraining(str) {
    if (typeof jsApp.viewTraining == 'function') {
        jsApp.viewTraining(str);
    }
}
/**
 * PC端进入学习页面
 * @param  {[type]} chapterId [description]
 * @param  {[type]} pageId    []
 * @return {[type]}           [description]
 */
function study(chapterId, pageId) {
    if (typeof jsApp.study == 'function') {
        jsApp.study(chapterId, pageId);
    }
}
/**
 * [downloadChapter 章节下载]
 * @param  chapterId [章节id]
 * @return            [description]
 */
function downloadChapter(chapterId) {
    if (typeof jsApp.downloadChapter == 'function') {
        jsApp.downloadChapter(chapterId);
    }
}

/**
 * [similarQuestion 同类题]
 * @param  {String} questionId [题id]
 * @param  {Number} num        [每次查找同类题数量]
 * @return {[type]}            [description]
 */
function similarQuestion(questionId, num) {
    if (typeof jsApp != 'undefined' && typeof jsApp.similarQuestion == 'function') {
        jsApp.similarQuestion(questionId, num);
    }
}

/**
 * [doUpdate] getUpdateStatus返回值为3时PC客户端强制升级
 * @param  {Boolean} force(:false) # force为true时强制升级,false弹出客户端提示框
 * */
function doUpdate(force){
    if(typeof jsApp.doUpdate === 'function'){
        jsApp.doUpdate(force);
    }
}

/**
 * [getUpdateStatus] 返回PC客户端下载状态
 * @return 0 程序升级文件丢失，无法正常升级
 * @return 1 暂未发现新版本
 * @return 2 正在下载
 * @return 3 升级包下载成功，用户选择下次启动升级
 * @return 4 升级失败
 * */
function getUpdateStatus(){
    if(typeof jsApp.getUpdateStatus === 'function'){
        return jsApp.getUpdateStatus();
    }
}

/**
 * PC端打开浏览器
 * @param url url地址
 * */
function openBrowserWithUrl(url){
    if(typeof jsApp.openBrowserWithUrl === 'function'){
        jsApp.openBrowserWithUrl(url);
    }
}

/**
 * 获取页面的绝对路径
 * @returns {*}
 */
function getPagePath(){
    if(typeof jsApp.getPagePath === 'function'){
        return jsApp.getPagePath();
    }
}

/**
 * doContinue PC端继续执行刚才做的事
 * @param arg 继续做的事
 */
function doContinue(arg){
    if(typeof jsApp.doContinue === 'function'){
        jsApp.doContinue(arg);
    }
}

/**
 * [backToCatalog 返回到目录]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function backToCatalog(file) {
    if (!file) return;
    if (typeof jsApp.backToCatalog == 'function') {
        jsApp.backToCatalog(file);
    }
}

/**
 * [goback 返回到上一级]
 * 新加的接口 如果没有则调用以前的老接口backToCatalog
 */
function goback() {
    if (typeof jsApp.goback == 'function') {
        jsApp.goback();
    }else {
        if (typeof jsApp.backToCatalog == 'function') {
            jsApp.backToCatalog('bookCatalog.html');
        }
    }
}

/**
 * pc端打开在线页面 比如生词本错题本
 * @param type
 * URL :直接指定URL
 * WRONGNOTE_LIST, // 错题本
 * WRONGWORD_LIST, // 生词本
 * @param URL     // 当 type 的值为 "URL" 时，需要指定这个字段的值
 * @param queryString  //参数连接
 * @param openNewWebview: true|false, // 是否打开新的WebView加载页面
 */
function  ShowOnlinePage(params){
    if(typeof jsApp.ShowOnlinePage === 'function'){
          jsApp.ShowOnlinePage(JSON.stringify(params));
    }
}
/**
 * PC端若是想要添加错题本信息需要在初始化时，调用该接口
 * @param  {[String]} taskId          [description]
 * @param  {[String]} pageElementId   [description]
 * @param  {[Int]} pageElementType []
 * @param  {[Boolean]} _uploadRecord   [是否上传录音]
 * @return {[type]}                 [description]
 */
function submitPageEleInfo(taskId, pageElementId,pageElementType,uploadRecord){
    if(typeof jsApp.submitPageEleInfo === 'function'){
        uploadRecord = uploadRecord || false;
        jsApp.submitPageEleInfo(taskId,pageElementId,pageElementType,uploadRecord);
    }
}
/**
 * PC获取服务器时间
 * @return {[Number]} [时间戳最小精确到ms]
 */
function getServerTime(){
    if(typeof jsApp.getServerTime === 'function'){
        return jsApp.getServerTime();
    }
}

/**
 * 类型string
 * 根据recordId获取录音结果
 */
function getAsecResult(recordId) {
    if (typeof jsApp != 'undefined' && typeof jsApp.getAsecResult == 'function') {
        return JSON.parse(jsApp.getAsecResult(recordId));
    }
}

/**
 * 类型string
 * 根据recordId删除队列里指定数据
 */
function delAsecResult(recordId) {
    if (typeof jsApp != 'undefined' && typeof jsApp.delAsecResult == 'function') {
        return jsApp.delAsecResult(recordId);
    }
}

/**
 * 设置进度
 * rate 完成率
 * 题型描述
 */
function setProgress(rate,text) {
    if (typeof jsApp != 'undefined' && typeof jsApp.setProgress == 'function') {
        return jsApp.setProgress(rate,text);
    }
}

/**
 * 获取最小进度
 */
function getMinProgress() {
    if (typeof jsApp != 'undefined' && typeof jsApp.getMinProgress == 'function') {
        return jsApp.getMinProgress();
    }
}

/**
 * 跟新设备测试状态
 */
function updateDeviceStatus(bool){
    if (typeof jsApp != 'undefined' && typeof jsApp.updateDeviceStatus == 'function') {
        return jsApp.updateDeviceStatus(bool);
    }
}

/**
 * 获取录音音量
 */
function getMicVolumn(){
    if (typeof jsApp != 'undefined' && typeof jsApp.getMicVolumn == 'function') {
        return jsApp.getMicVolumn();
    }
}

/**
 * 获取播放音量
 */
function getSpeakerVolumn(){
    if (typeof jsApp != 'undefined' && typeof jsApp.getSpeakerVolumn == 'function') {
        return jsApp.getSpeakerVolumn();
    }
}

/**
 * 设置录音音量
 */
function setMicVolumn(num){
    if (typeof jsApp != 'undefined' && typeof jsApp.setMicVolumn == 'function') {
        return jsApp.setMicVolumn(num);
    }
}

/**
 * 设置播放音量
 */
function setSpeakerVolumn(num){
    if (typeof jsApp != 'undefined' && typeof jsApp.setSpeakerVolumn == 'function') {
        return jsApp.setSpeakerVolumn(num);
    }
}

/**
 * 设置为不评分
 */
function setNoAsec(num){
    if (typeof jsApp != 'undefined' && typeof jsApp.setNoAsec == 'function') {
        return jsApp.setNoAsec(num);
    }
}

var HttpClient = {
    callBackMap: {},
    callBackId: 1,
    getSessionId: function (callback) {
        this.callBackId++;
        this.callBackMap[this.callBackId] = callback;
        return this.callBackId;
    },
    GET: function (url, callback) {
        url = encodeURI(url);
        url = url.replace(/\+/g,'%2B');
        var sessionId = this.getSessionId(callback);
        if (typeof jsApp.requestDataFromServer == 'function') {
            jsApp.requestDataFromServer(sessionId, url);
        }
    },
    POST: function (url, data, callback) {
        var sessionId = this.getSessionId(callback);
        if (typeof jsApp.submitDataForServer == 'function') {
            jsApp.submitDataForServer(sessionId, url, JSON.stringify(data));
        }
    },
    POST2: function (url, data, callback) {
        // post方法 有返回数据
        var sessionId = this.getSessionId(callback);
        if (typeof jsApp.requestPostDataFromServer == 'function') {
            jsApp.requestPostDataFromServer(sessionId, url, JSON.stringify(data));
        }
    },
    onResponse: function (sessionId, data) {
        var callback = this.callBackMap[sessionId];
        if (callback && typeof callback == 'function') {
            callback(data.code, data.info, data.data);
            delete this.callBackMap[sessionId];
        } else {
            console.error("sessionId = " + sessionId + " callback == " + callback);
            return;
        }
    }
}

Object.assign( u3Client, {
    getBookInfo: getBookInfo,
    parseSpecialChapter: parseSpecialChapter,
    getClientInfo: getClientInfo,

    //录音相关的接口
    startRecord: startRecord,
    startRecordWithParams: startRecordWithParams,
    endRecord: endRecord,

    //音频相关的接口
    playAudio: playAudio,
    playAudioWithParams: playAudioWithParams,
    getAudioCurrentTime: getAudioCurrentTime,
    pausePlayAudio: pausePlayAudio,
    resumePlayAudio: resumePlayAudio,
    stopPlayAudio: stopPlayAudio,

    // 其它接口
    disableSlide: disableSlide,
    submitPageEleInfo: submitPageEleInfo,
    loadPageInfo: loadPageInfo,
    getPageIds: getPageIds,
    saveData: saveData,
    loadData: loadData,
    submitEleAttr: submitEleAttr,
    submitTask: submitTask,
    registerEvent: registerEvent,
    unRegisterEvent: unRegisterEvent,
    getTasksUploadStatus: getTasksUploadStatus,
    manualUploadTask: manualUploadTask,
    getBookId: getBookId,
    openTest: openTest,
    openTestChapter: openTestChapter,
    close: close,
    open: open,
    updateNavigationTitle: updateNavigationTitle,
    getUserInfo:getUserInfo,
    getBookTaskStatus:getBookTaskStatus,
    retryUploading:retryUploading,
    similarQuestion:similarQuestion,
    getPagePath:getPagePath,
    jsCharpterObjBackToCatalog:jsCharpterObjBackToCatalog,
    backToCatalog:backToCatalog,
    loadBookInfo:loadBookInfo,
    loadChapterInfo:loadChapterInfo,
    loadTaskInfo:loadTaskInfo,
    HttpClient: HttpClient,

    // 5月23-25日PC目录页提交的接口
    backToBookshelf,
    buyBook,
    ignorClick,
    openWordNote,
    openWrongQuestion,
    viewTraining,
    study,
    downloadChapter,
    doUpdate,
    getUpdateStatus,
    openBrowserWithUrl,
    doContinue,
    goback,
    ShowOnlinePage,
    getServerTime,
    getAsecResult,
    delAsecResult,
    setProgress,
    getMinProgress,
    updateDeviceStatus,
    getMicVolumn,
    getSpeakerVolumn,
    setMicVolumn,
    setSpeakerVolumn,
    setNoAsec
} );

global.u3Client = u3Client;
global.HttpClient = u3Client.HttpClient;
export default u3Client;
