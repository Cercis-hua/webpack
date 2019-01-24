/**
 * 页面中每个问题的基类
 */
import u3Event from '../u3Event';
import { trim } from '../u3Util';

export default class QuestionBase extends u3Event{
    constructor(quesObj){
        super();
        this.quesObj = quesObj;
        this.elements = {};
    }
    initElements(){
        // 试题元素（element_type===1）
        this.elements[this.quesObj.element_id] = {
            elementId: this.quesObj.element_id,
            elementType: this.quesObj.element_type,
            elementAttr: {
                question_id: this.quesObj.question_id,
                question_type: this.quesObj.question_type,
                order: ( this.quesObj._option && this.quesObj._option.quesNum ) || 1,
                user_score: 0,
                user_answer: '',
                answer: this.quesObj.answer_text || '',
                score: this.quesObj.question_score - 0,
                result: -1,
                timestamp: 0,
                wrongnote_flag: (this.quesObj._option && this.quesObj._option.wrongNoteFlag == 0)?0:1
            }
        };
        // 填空题，改错题，连线题，拖拽题的小题元素（element_type===2）
        if (typeof this.quesObj.answers_list != 'undefined') {
            for (var i = 0, l = this.quesObj.answers_list.length; i < l; i++) {
                var childEle = this.quesObj.answers_list[i];
                this.elements[childEle.element_id] = {};
                this.elements[childEle.element_id].elementId = childEle.element_id;
                this.elements[childEle.element_id].elementType = childEle.element_type;
                this.elements[childEle.element_id].elementAttr = {
                    question_id: this.quesObj.question_id,
                    question_type: this.quesObj.question_type,
                    order: childEle.id - 0,
                    answer: trim(childEle.content) || '',
                    user_answer: '',
                    score: childEle.score - 0,
                    user_score: 0,
                    result: -1,
                    timestamp: 0,
                    wrongnote_flag: (this.quesObj._option && this.quesObj._option.wrongNoteFlag == 0)?0:1
                };
            }
        }
        if( this.quesObj.question_type === 9
            || this.quesObj.question_type === 12
            || this.quesObj.question_type === 13 ){
            // PartB 或者 PartC 的录音元素
            if (typeof this.quesObj.record_speak != 'undefined') {
                var recordEle = this.quesObj.record_speak[0];
                this.elements[recordEle.element_id] = {};
                this.elements[recordEle.element_id].elementId = recordEle.element_id;
                this.elements[recordEle.element_id].elementType = recordEle.element_type;
                this.elements[recordEle.element_id].elementAttr = {
                    question_id: this.quesObj.question_id,
                    question_type: this.quesObj.question_type,
                    order: 1,
                    answer: recordEle.content,
                    user_answer: '',
                    score: this.quesObj.question_score,
                    user_score: 0,
                    record_result: '',
                    record_url: '',
                    result: -1,
                    timestamp: 0,
                    wrongnote_flag: (this.quesObj._option && this.quesObj._option.wrongNoteFlag == 0)?0:1,
                    accuracy: 0,
                    completion: 0,
                    fluency: 0
                };
            }
            // PartA（句子跟读等）的录音元素
            if (typeof this.quesObj.record_follow_read != 'undefined') {
                for(var i = 0,l = this.quesObj.record_follow_read.paragraph_list.length; i < l; i++){
                    for(var j = 0,k = this.quesObj.record_follow_read.paragraph_list[i].sentences.length; j < k; j++){
                        var recordEle = this.quesObj.record_follow_read.paragraph_list[i].sentences[j];
                        this.elements[recordEle.element_id] = {};
                        this.elements[recordEle.element_id].elementId = recordEle.element_id;
                        this.elements[recordEle.element_id].elementType = recordEle.element_type;
                        this.elements[recordEle.element_id].elementAttr = {
                            question_id: this.quesObj.question_id,
                            question_type: this.quesObj.question_type,
                            order: recordEle.id-0,
                            answer: recordEle.content_en,
                            user_answer: '',
                            score: this.quesObj.question_score,
                            user_score: 0,
                            record_result: '',
                            record_url: '',
                            result: -1,
                            timestamp: 0,
                            wrongnote_flag: (this.quesObj._option && this.quesObj._option.wrongNoteFlag == 0)?0:1,
                            accuracy: 0,
                            completion: 0,
                            fluency: 0
                        };
                    }
                }
            }
        }
    }
    getQuestionId(){
        return this.quesObj.question_id;
    }
    getQuestionType(){
        return this.quesObj.question_type;
    }
    setElements(elements) {
        if (!elements) return;
        this.elements = elements;
    }
    getElements() {
        return this.elements;
    }
    modifyElement(elementId, elementAttr) {
        if( typeof this.elements[elementId] != 'undefined' ){
            Object.assign(this.elements[elementId].elementAttr, elementAttr);
        }
    }
    judge(){
        var resultMap = {}, primaryUserScore = 0;
        var pElement = this.elements[this.quesObj.element_id];
        // 填空题，改错题，连线题，拖拽题的小题元素（element_type===2）
        // if (typeof this.quesObj.answers_list != 'undefined') {
        if( this.quesObj.question_type == 4
            || this.quesObj.question_type == 6
            || this.quesObj.question_type == 8
            || this.quesObj.question_type == 10 ){
            for (var elementId in this.elements) {
                if (!Object.prototype.hasOwnProperty.call(this.elements, elementId)) continue;
                if( elementId === this.quesObj.element_id ) continue;
                var eleAttr = this.elements[elementId].elementAttr;
                var ans = $.trim(eleAttr.answer.replace(/’|'/g,"'").replace(/\s+/g,' '));   // 答案中有引号的处理
                ans = ans.split('/');
                // 用户答案为空
                if (eleAttr.user_answer === "") {
                    eleAttr.result = 2;
                    eleAttr.user_score = 0;
                    _resultMap(elementId, eleAttr.user_answer, eleAttr.user_score, eleAttr.result);
                    continue;
                }
                var uanswer = $.trim(eleAttr.user_answer.replace(/'|’/g,"'").replace(/\s+/g,' '));  // 用户答案用有引号的处理
                if (ans.indexOf(uanswer) > -1) {
                    eleAttr.result = 1;
                    eleAttr.user_score = eleAttr.score;
                    primaryUserScore += eleAttr.score;
                } else {
                    eleAttr.result = 2;
                    eleAttr.user_score = 0;
                }
                _resultMap(elementId, eleAttr.user_answer, eleAttr.user_score, eleAttr.result);
            }
            pElement.elementAttr.user_score = primaryUserScore;
            if (primaryUserScore === pElement.elementAttr.score) {
                pElement.elementAttr.result = 1;
            } else if ( primaryUserScore > 0 ){
                pElement.elementAttr.result = 3;
            } else {
                pElement.elementAttr.result = 2;
            }
        }else if( this.quesObj.question_type == 9
            || this.quesObj.question_type == 12
            || this.quesObj.question_type == 13 ){
            // 口语题
            for (var elementId in this.elements) {
                if (!Object.prototype.hasOwnProperty.call(this.elements, elementId)) continue;
                var element = this.elements[elementId];
                // 如果 elementAttr.timestamp 有值 ，代表用户录过音
                if(element.elementAttr.timestamp){
                    // element_type === 6 代表录音元素
                    // if( element.element_type === 6 ){
                    // user_score 为 0 判错 result = 2
                    // user_score 为 100 判对 result = 1
                    // user_score 为其他值 判半对半错 result = 3
                    element.elementAttr.result =
                        element.elementAttr.user_score==0?2:
                            element.elementAttr.user_score==100?1:3;
                    // }else{
                    //
                    // }
                }else{
                    // 用户为录过音，直接判错
                    element.elementAttr.result = 2;
                }
                _resultMap(elementId, element.elementAttr.user_answer, element.elementAttr.user_score, element.elementAttr.result);
            }
        }else {
            // 用户答案为空
            if ( pElement.elementAttr.user_answer !== pElement.elementAttr.answer ) {
                pElement.elementAttr.result = 2;
                pElement.elementAttr.user_score = 0;
            } else {
                pElement.elementAttr.result = 1;
                pElement.elementAttr.user_score = pElement.elementAttr.score;
            }
            _resultMap( pElement.elementId, pElement.elementAttr.user_answer, pElement.elementAttr.user_score, pElement.elementAttr.result);
        }
        function _resultMap(eleId, uans, usc, res) {
            resultMap[eleId] = {
                user_answer: uans,
                user_score: usc,
                result: res
            }
        }
        return resultMap;
    }
    getQstUserScore() {
        return this.elements[this.quesObj.element_id].elementAttr.user_score - 0;
    }
    getQstScore() {
        return this.elements[this.quesObj.element_id].elementAttr.score - 0;
    }
    resetQstEles() {
        for (var elementId in this.elements) {
            if (!Object.prototype.hasOwnProperty.call(this.elements, elementId)) continue;
            var rAttr = {
                user_score: 0,
                user_answer: '',
                result: -1,
                timestamp: 0
            };
            if( typeof this.elements[elementId].elementAttr.record_result != 'undefined' ){
                rAttr.record_result = '';
            }
            if( typeof this.elements[elementId].elementAttr.record_url !== 'undefined' ){
                rAttr.record_url = '';
                rAttr.duration = 0;
            }
            if( typeof this.elements[elementId].elementAttr.accuracy !== 'undefined' ){
                rAttr.accuracy = 0;
                rAttr.completion = 0;
                rAttr.fluency = 0;
            }
            Object.assign(this.elements[elementId].elementAttr, rAttr);
        }
    }
    recoverQstEles(elements) {
        var resultMap = {};
        for (var index in elements) {
            var element = elements[index];
            var pAttr = {
                user_score: element.elementAttr.user_score || 0,
                user_answer: element.elementAttr.user_answer,
                result: element.elementAttr.result,
                timestamp: element.elementAttr.timestamp || 0
            }
            if( typeof element.elementAttr.record_result !== 'undefined' ){
                pAttr.record_result = element.elementAttr.record_result;
            }
            if( typeof element.elementAttr.record_url !== 'undefined' ){
                pAttr.record_url = element.elementAttr.record_url;
                pAttr.duration = element.elementAttr.duration;
            }
            if( typeof element.elementAttr.accuracy !== 'undefined' ){
                pAttr.accuracy = element.elementAttr.accuracy;
                pAttr.completion = element.elementAttr.completion;
                pAttr.fluency = element.elementAttr.fluency;
            }
            Object.assign(this.elements[element.elementId].elementAttr,pAttr);
        }
        for (var elementId in this.elements) {
            if (!Object.prototype.hasOwnProperty.call(this.elements, elementId)) continue;
            var eleAttr = this.elements[elementId].elementAttr;
            var rAttr = {
                user_answer: eleAttr.user_answer,
                user_score: eleAttr.user_score || 0,
                result: eleAttr.result,
                timestamp: eleAttr.timestamp || 0
            };
            if( typeof eleAttr.record_result !== 'undefined' ){
                rAttr.record_result = eleAttr.record_result;
            }
            if( typeof eleAttr.accuracy !== 'undefined' ){
                rAttr.accuracy = eleAttr.accuracy;
                rAttr.completion = eleAttr.completion;
                rAttr.fluency = eleAttr.fluency;
            }
            resultMap[elementId] = rAttr;
        }
        return resultMap;
    }
    getQstElementAttrs() {
        var elements = [];
        for (var elementid in this.elements) {
            if (!Object.prototype.hasOwnProperty.call(this.elements, elementid)) continue;
            elements.push(this.elements[elementid]);
        }
        var eleMap = {};
        eleMap[this.getQuestionId()]=elements;
        return eleMap;
    }
    /**
     * 检验答案，该方法由子类重写
     */
    validateAnswer(){
    }
    /**
     * 停止所有的音频、视频、录音，该方法由子类重写
     */
    stopAllMedia(){
    }

    /**
     * 异步评分页面调用接口
     * @param asynResultMap result异步队列的数据
     */
    asecResult(asynResultMap){
        let realScore = (this.quesObj.question_score * (asynResultMap.score - 0) / 100).toFixed(1);
        if(this.quesObj.question_type == 9) {
            if( typeof this.quesObj.record_follow_read !== 'undefined' ){
                this.modifyElement(this.quesObj.record_follow_read.paragraph_list[0].sentences[0].element_id,{
                    record_result: asynResultMap.result,
                    user_score: realScore,
                    timestamp: Date.now(),
                    record_url:asynResultMap.record_url,
                    duration:asynResultMap.duration,
                    msg:asynResultMap.msg
                });
            }else if( typeof this.quesObj.record_speak !== 'undefined' ){
                this.modifyElement(this.quesObj.record_speak[0].element_id,{
                    record_result: asynResultMap.result,
                    user_score: realScore,
                    timestamp: Date.now(),
                    record_url:asynResultMap.record_url,
                    duration:asynResultMap.duration,
                    msg:asynResultMap.msg
                });
            }
            this.modifyElement(this.quesObj.element_id,{
                record_result: asynResultMap.result,
                user_score: realScore,
                timestamp: Date.now(),
                record_url:asynResultMap.record_url,
                duration:asynResultMap.duration,
                msg:asynResultMap.msg
            });
        }else if(this.quesObj.question_type == 12
            || this.quesObj.question_type == 13) {
            this.modifyElement(this.quesObj.record_speak[0].element_id,{
                user_score: realScore,
                timestamp: Date.now(),
                record_url:asynResultMap.record_url,
                duration:asynResultMap.duration,
                msg:asynResultMap.msg
            });
            this.modifyElement(this.quesObj.element_id,{
                user_score: realScore,
                timestamp: Date.now(),
                record_url:asynResultMap.record_url,
                duration:asynResultMap.duration,
                msg:asynResultMap.msg
            });
        }
    }
}
