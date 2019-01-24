
export let LineBasePCTemp =
    `<div class="u3compo-qst u3compo-line">
        <div class="u3-qst-order"><span>{{_option.quesNum}}</span> 本题分值<label>{{question_score}}</label>分</div>
        {{each options opt i}}
            {{if opt.flag == 1}}
                {{each options _opt j}}
                {{if opt.idx == j+1}}
                <div class="u3-qst-cont">
                    <div class="u3-qst-left u3-qst-option swiper-no-swiping">
                        <div class="u3-qst-opt u3-label-grey" value="{{opt.id}}" index="{{opt.idx}}">
                            <div class="u3-qst-opt-cont"><span>{{opt.idx}}.{{@opt.content}}</span></div>
                        </div>
                    </div>
                    {{each options _opt_right k}}
                    {{if _opt_right.idx == j+1 && _opt_right.flag == 2}}
                    <div class="u3-qst-right u3-qst-option swiper-no-swiping">
                        <div class="u3-qst-opt u3-label-grey" value="{{_opt_right.id}}" index="{{opt.idx}}">
                            <div class="u3-qst-opt-cont"><span>{{opt.idx}}.{{@_opt_right.content}}</span></div>
                        </div>
                    </div>
                    {{/if}}
                    {{/each}}
                </div>
                {{/if}}
                {{/each}}
            {{/if}}
        {{/each}}
        <div class="u3-qst-my-answer">
            <span class="u3-qst-my-answer-key">我的答案：</span>
            <div class="u3-qst-my-answer-list">
            {{each answers_list ans i}}
                <div>
                    <span>{{i+1}} - </span>
                    <input type="text"> ;
                </div>
            {{/each}}
            </div>
        </div>
        <div class="u3-qst-score">
            <span class="u3-qst-score-title">得分：</span><div class="u3-qst-score-txt"><span>0</span>分</div>
        </div>
        <div class="u3-qst-answer">
            <span class="u3-qst-answer-key">参考答案：</span>
            <div class="u3-qst-answer-list">
                {{each answers_list ans i}}
                <div element-id="{{ans.element_id}}">
                    <span class="u3-qst-answer-cont">{{ans.content}}</span>
                </div>
                {{/each}}
            </div>
        </div>
        <div class="u3-line-lead-mask">
            <div class="u3-line-lead">
                <div class="u3-confirm"></div>
            </div>
        </div>
    </div>`;
