'use strict';
const VERSION='V4-review-2026-09-24';
// Review-only build: intentionally no DataPipe extension or network save request.
// Existing production experiment RCeel1NkihGd is not changed by this package.
const state={multi:false,g12:false,g3:false,relations:false,reference:'',complete:false};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsPsych=initJsPsych({display_element:'experiment',on_finish:()=>{
 const root=document.getElementById('experiment');
 root.innerHTML=`<div class="jspsych-content" style="margin:auto"><div class="card"><h2>${state.complete?'审阅流程已完成':'已退出审阅'}</h2><p>本版没有向 DataPipe 或 Google Drive 上传任何作答。部分量表仍待补齐，完成本流程不代表完成正式实验。</p><p>如需把意见交给研究者，请下载本地文件并自行发送。关闭页面后，未下载的数据无法从后台找回。</p><div class="end-actions"><button class="jspsych-btn" id="csv">下载审阅 CSV</button><button class="jspsych-btn" id="json">下载审阅 JSON</button></div><p class="small">版本：${VERSION}</p></div></div>`;
 document.getElementById('csv').onclick=()=>jsPsych.data.get().localSave('csv',`IGD_${VERSION}_${pid}.csv`);
 document.getElementById('json').onclick=()=>jsPsych.data.get().localSave('json',`IGD_${VERSION}_${pid}.json`);
}});
const pid=jsPsych.randomization.randomID(10);
jsPsych.data.addProperties({participant_id:pid,experiment_version:VERSION,review_only:1,formal_collection_ready:0,session_complete:0,upload_status:'disabled_review',started_at:new Date().toISOString(),viewport_width:window.innerWidth,viewport_height:window.innerHeight});
const base=(module,construct='')=>({module,construct,is_filler:0,applicable:1});
const card=(title,body)=>`<div class="card"><h2>${title}</h2>${body}</div>`;
const info=(title,body,data={},label='继续')=>({type:jsPsychHtmlButtonResponse,stimulus:card(title,body),choices:[label],data});
const select=(name,label,options)=>`<label for="${name}">${label}</label><select id="${name}" name="${name}" required><option value="">请选择</option>${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select>`;
const yn=[['yes','是'],['no','否']];
const form=(title,html,module,on_finish)=>({type:jsPsychSurveyHtmlForm,preamble:card(title,''),html,button_label:'继续',data:base(module),on_finish});
const conditional=(test,yes,no=[])=>[{timeline:yes,conditional_function:test},{timeline:no,conditional_function:()=>!test()}];
const skip=(name)=>info('模块跳过','<p>这一部分不适用于刚才填写的经历，直接进入下一部分。</p>',{...base('skip'),scale_name:name,applicable:0});
const pending=(name,title,count,detail)=>info(title,`<p>审阅说明：拟用${count}，正式中文条目尚未补齐。本页只呈现模块位置，不要求作答，也不生成量表分数。</p><p>${detail}</p>`,{...base('scale_pending'),scale_name:name,scale_status:'missing_verified_chinese',item_count_planned:count});
const timeline=[];
timeline.push(info('日常活动与娱乐选择研究',`<p>这是提供给研究者、导师和师姐检查材料的审阅版本，可查看流程并填写修改意见。不是正式招募链接，不作心理诊断。</p><p>尚缺三个正式中文量表模块；游戏关系问卷为待审译稿。所有输入只保留在当前页面，可在最后自行下载，不自动上传。</p><p>请勿输入姓名、学号、手机号或其他可识别个人的信息。可随时关闭页面退出。完整版本时长需要量表补齐后重新实测。</p>`,base('review_intro'),'进入审阅'));
timeline.push({type:jsPsychHtmlButtonResponse,stimulus:card('自愿试填','<p>你是否已年满18岁，并愿意自愿试填本审阅程序？不愿试填可以直接退出。</p>'),choices:['愿意试填','退出'],data:base('consent'),on_finish:d=>{if(d.response!==0)jsPsych.abortExperiment();}});
timeline.push(form('基本信息',`<label for="age">年龄</label><input id="age" name="age" type="number" min="18" max="100" required>${select('gender','性别',[['female','女'],['male','男'],['other','其他或不愿回答']])}${select('student','目前是否为在校大学生？',yn)}`,'demographics'));
timeline.push(info('第一部分 日常选择','<p>请分别想象接下来的情境，选择自己最可能采取的一种做法。各题独立，没有正确答案。</p><p>如果四个选项都不符合你的想法，可以选择“这些都不符合”。本版保留这一试测选项，用于发现材料遗漏。</p>',base('daily_instruction')));
function task(item,index,total,gameTask=false){
 const opts=jsPsych.randomization.shuffle(item.options.map(o=>({...o})));
 opts.push({label:'这些都不符合我的想法',code:'none_fit',social:null});
 return {type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><div class="progress">${gameTask?'游戏情境':'日常情境'} ${index+1}/${total} · ${item.id}</div><div class="scene">${item.text}</div><div class="question">在这个情境中，你最可能怎么做？</div></div>`,choices:opts.map(o=>o.label),data:{...base(gameTask?'game_task':'daily_task',item.filler?'filler':gameTask?'partner_source':'social_approach'),scenario_id:item.id,is_filler:Number(item.filler),option_order:opts.map(o=>o.code).join('|')},on_finish:d=>{const o=opts[d.response];d.choice_code=o.code;d.none_fit=Number(o.code==='none_fit');d.seek_social=!gameTask&&!item.filler&&o.code!=='none_fit'?o.social:null;d.partner_source=gameTask&&!item.filler&&o.code!=='none_fit'?o.code:null;}};
}
jsPsych.randomization.shuffle(dailyMaterials).forEach((m,i)=>timeline.push(task(m,i,dailyMaterials.length)));
timeline.push(form('下一部分的适用情况',select('multi','最近3个月，你是否玩过有其他真实玩家参与的多人或联机游戏？仅与电脑角色游玩不算。',yn),'game_eligibility',d=>{state.multi=d.response.multi==='yes';}));
timeline.push(...conditional(()=>state.multi,[info('第二部分 游戏中的选择','<p>这一部分独立于刚才的日常题，不是对上一题选择的追问。请根据实际游戏习惯作答。</p><p>“游戏外原本认识的朋友”：最初通过同学、同事或其他非游戏途径认识。“游戏里认识的熟人”：最初因一起玩游戏而认识，即使后来线下见过面，也归在这里。</p><p>“不专门找伙伴”包括让系统自动匹配；“主动招募”指自己发消息、联系或加入招募队伍。没有相应朋友时，不必选择该项。</p>',base('game_instruction')),...jsPsych.randomization.shuffle(gameMaterials).map((m,i)=>task(m,i,gameMaterials.length,true))],[skip('game_task')]));
timeline.push(form('任务体验',`<label for="purpose">你觉得刚才的任务主要想研究什么？不知道也可以直接写“不知道”。</label><textarea id="purpose" name="purpose_guess" required></textarea><label for="strategy">是否采用了固定的选择策略？</label><textarea id="strategy" name="strategy"></textarea><label for="feedback">哪些题重复、难懂，或者四个选项都不合适？尽量填写题号以及你实际想做的事。</label><textarea id="feedback" name="task_feedback"></textarea>`,'awareness_check'));
timeline.push(form('游戏使用情况',select('gaming_12m','过去12个月是否玩过电子游戏？',yn)+select('gaming_3m','最近3个月是否玩过电子游戏？',yn),'gaming_profile',d=>{state.g12=d.response.gaming_12m==='yes';state.g3=d.response.gaming_3m==='yes';d.profile_inconsistent=Number((state.g3&&!state.g12)||(state.multi&&!state.g3));}));
timeline.push(...conditional(()=>state.g3,[form('近期游戏习惯',`<label for="days">通常每周有几天玩游戏？</label><input id="days" name="gaming_days_week" type="number" min="0" max="7" required><label for="hours">玩游戏的日子里，平均每天玩多少小时？</label><input id="hours" name="gaming_hours_day" type="number" min="0" max="24" step="0.1" required><label for="games">常玩的游戏或类型（不填写游戏账号）</label><input id="games" name="main_games" required>${select('fixed_partners','是否有固定游戏伙伴？',yn)}`,'gaming_details')]));
timeline.push(...conditional(()=>state.g12,[pending('IGDS9_SF','游戏体验问卷',9,'拟测过去12个月的游戏障碍症状倾向，采用连续得分。旧版九道试测措辞不当作正式中文版。')],[skip('IGDS9_SF')]));
timeline.push(...conditional(()=>state.g3,[pending('CMOGQ_Escape','游戏动机问卷',4,'拟关注逃避动机。需补齐作者中文条目与指导语；仅使用四题子量表还是完整27题，还需要导师确认。')],[skip('CMOGQ_Escape')]));
timeline.push(...conditional(()=>state.multi&&state.g3,[form('游戏中的交往经历',select('relations','最近3个月，你是否在某款游戏中与其他玩家有过交流或合作，而不只是系统匹配到同一局？',yn),'relationship_eligibility',d=>{state.relations=d.response.relations==='yes';})]));
const relationBlock=[form('确定后续问卷的参照游戏','<p>请填写最近3个月最常玩、且与其他玩家有交流或合作的一款游戏。后面七题都以这一款游戏为准，不要在题目之间更换参照。</p><label for="reference_game">游戏名称（不填账号）</label><input id="reference_game" name="reference_game" required>','reference_game',d=>{state.reference=d.response.reference_game;})];
for(const scale of draftScales){
 relationBlock.push(info(scale.title,'<p>审阅说明：以下为依据原英文条目制作的中文译稿，尚未完成翻译核对和中文验证。本版暂用五点评分，评分设置同样待核对；只用于检查理解和呈现。</p>',{...base('scale_instruction'),scale_name:scale.name,scale_status:'translation_draft'}));
 scale.items.forEach((prompt,i)=>relationBlock.push({type:jsPsychHtmlButtonResponse,stimulus:()=>card(scale.title,`<p class="small">参照游戏：${escapeHTML(state.reference)} · ${i+1}/${scale.items.length}</p><p class="scene">${prompt}</p>`),choices:['非常不同意','比较不同意','一般','比较同意','非常同意','不适用或无法判断'],data:{...base('scale_item',scale.name),scale_name:scale.name,item_name:`${scale.name}_${i+1}`,scale_status:'translation_draft'},on_finish:d=>{d.reference_game=state.reference;d.item_value=d.response<5?d.response+1:null;d.applicable=Number(d.response<5);}}));
}
timeline.push(...conditional(()=>state.multi&&state.g3&&state.relations,relationBlock,[skip('SOC_RSC')]));
timeline.push(pending('SCS_Chinese_Wu2022','日常社会联结问卷',9,'拟用吴才智等（2022）的中文修订版本，完整条目、题数、指导语和反向计分键仍需最终核对。不能从其他18题或20题版本中自行挑九题替代；一般社会联结也不能未经说明就等同于纯线下联结。'));
timeline.push(form('整体审阅意见','<label for="final">对研究内容、选项、问卷或页面显示还有什么建议？</label><textarea id="final" name="final_feedback"></textarea>','final_feedback'));
timeline.push({type:jsPsychHtmlButtonResponse,stimulus:card('结束审阅','<p>点击后结束当前审阅流程，可以下载本地记录。本版不会自动上传数据。</p>'),choices:['完成审阅'],data:base('review_end'),on_finish:d=>{
 state.complete=true;jsPsych.data.addProperties({session_complete:1,completed_at:new Date().toISOString()});d.session_complete=1;
 for(const s of draftScales){const rows=jsPsych.data.get().filter({scale_name:s.name,module:'scale_item'}).values();const values=rows.filter(r=>r.item_value!=null).map(r=>r.item_value);d[`${s.name}_n_valid`]=values.length;d[`${s.name}_total`]=values.length===s.items.length?values.reduce((a,b)=>a+b,0):null;d[`${s.name}_mean`]=values.length===s.items.length?values.reduce((a,b)=>a+b,0)/values.length:null;}
}});
jsPsych.run(timeline);
