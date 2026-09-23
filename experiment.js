const VERSION="pilot-v3.2.1-datapipe-2026-09-23";
let pid="pending";
const jsPsych=initJsPsych({
  extensions:[{
    type:jsPsychExtensionPipe,
    params:{
      experiment_id:"RCeel1NkihGd",
      filename:()=>`IGD_social_V3_${pid}.csv`
    }
  }],
  on_finish:()=>{
    document.body.innerHTML=`<main class="card" style="max-width:720px;margin:8vh auto"><h2>试测完成</h2><p>数据已自动提交，感谢你帮助我们改进材料和程序。</p><p class="small">被试编号：${pid}</p><button id="backup-download" class="jspsych-btn">备用：下载本地数据</button><p class="small">只有研究者要求时才需要点击备用下载。</p></main>`;
    document.getElementById("backup-download").addEventListener("click",()=>jsPsych.data.get().localSave("csv",`IGD_social_V3_${pid}_backup.csv`));
  }
});
pid=jsPsych.randomization.randomID(10);
jsPsych.data.addProperties({participant_id:pid,experiment_version:VERSION,started_at:new Date().toISOString(),user_agent:navigator.userAgent});

// 模块一：不同日常需要/机会中的活动选择。social仅为后台编码，不向被试显示。
const dailyCritical=[
{id:"A01",need:"positive_share",text:"你刚得知自己申请的项目通过了，心情很好。晚上回到寝室后，你暂时没有其他安排。",options:[["自己看部电影",0,"solo_movie"],["听音乐放松",0,"solo_music"],["约朋友庆祝",1,"meet_friend"],["给朋友发消息",1,"message_friend"]]},
{id:"A02",need:"companionship",text:"周末下午，你已经完成了当天的事情，接下来有两个小时空闲时间。",options:[["独自逛逛",0,"solo_walk"],["回去休息",0,"solo_rest"],["约同学见面",1,"meet_friend"],["去线上找熟人",1,"online_contact"]]},
{id:"A03",need:"advice",text:"选课时，你在两门课程之间犹豫，查过资料后还是拿不定主意。",options:[["再自己查资料",0,"solo_search"],["先放一放再决定",0,"delay"],["问身边的同学",1,"ask_peer"],["在线咨询熟人",1,"ask_online"]]},
{id:"A04",need:"belonging",text:"学院发布了一项自由参加的周末活动，内容比较轻松，你也有时间。",options:[["留出时间休息",0,"solo_rest"],["做自己的兴趣活动",0,"solo_hobby"],["约同学一起报名",1,"join_friend"],["进活动群了解",1,"join_online"]]},
{id:"A05",need:"cooperation",text:"老师布置了一项开放作业，可以独立完成，也可以和别人讨论后再做。",options:[["自己直接完成",0,"solo_task"],["先独立列提纲",0,"solo_plan"],["找同学当面讨论",1,"discuss_face"],["在线和同学讨论",1,"discuss_online"]]},
{id:"A06",need:"interest_share",text:"你看到一条很有意思的内容，正好与最近关注的话题有关。",options:[["自己收藏下来",0,"solo_save"],["继续看相关内容",0,"solo_browse"],["转给现实朋友",1,"share_friend"],["发到熟人群里",1,"share_group"]]},
{id:"A07",need:"relaxation",text:"一周的课程结束了。你有些累，但精神还不错，晚上可以自由安排。",options:[["一个人早点休息",0,"solo_rest"],["独自做点喜欢的事",0,"solo_hobby"],["找朋友一起吃饭",1,"dinner_friend"],["和熟人线上聊天",1,"chat_online"]]},
{id:"A08",need:"new_environment",text:"你提前到达一场公开活动，现场已有一些认识和不认识的同学，活动还要过一会儿才开始。",options:[["自己看看手机",0,"solo_phone"],["找位置安静等待",0,"solo_wait"],["和认识的人打招呼",1,"greet_friend"],["和身边的人聊聊",1,"talk_nearby"]]},
{id:"A09",need:"support",text:"你最近准备一项重要任务，进展还可以，但有些细节让你不太确定。",options:[["自己继续琢磨",0,"solo_think"],["休息后再处理",0,"delay"],["找熟悉的人商量",1,"consult_friend"],["在线向同学请教",1,"consult_online"]]},
{id:"A10",need:"leisure",text:"晚饭后，原定的安排临时取消了。天气不错，第二天也没有早课。",options:[["自己出去走走",0,"solo_walk"],["回寝室看视频",0,"solo_video"],["约朋友一起散步",1,"walk_friend"],["问熟人是否有空",1,"contact_friend"]]},
{id:"A11",need:"achievement",text:"你终于完成了一件花了很长时间的事情，结果也达到了自己的预期。",options:[["独自休息一下",0,"solo_rest"],["买点喜欢的东西",0,"solo_reward"],["和朋友分享结果",1,"share_friend"],["在熟人群里说一声",1,"share_group"]]},
{id:"A12",need:"casual_contact",text:"午饭后离下一节课还有四十分钟，你已经处理完需要回复的消息。",options:[["找地方眯一会儿",0,"solo_rest"],["戴耳机听音乐",0,"solo_music"],["找同学坐一会儿",1,"sit_friend"],["在线和熟人聊聊",1,"chat_online"]]}
];
const dailyFillers=[
{id:"F01",text:"下午突然下雨，原定的户外安排取消了，你已经回到室内。",options:[["整理课程资料","organize"],["看一部电影","movie"],["做室内运动","exercise"],["提前处理作业","study"]]},
{id:"F02",text:"你乘坐的公交车遇到拥堵，预计还要二十分钟才能到达。",options:[["听音乐","music"],["闭目休息","rest"],["看看新闻","news"],["整理日程","planning"]]},
{id:"F03",text:"你比预期更早完成了今天的任务，离睡觉还有一段时间。",options:[["收拾房间","clean"],["预习课程","study"],["看看视频","video"],["早点休息","rest"]]},
{id:"F04",text:"你在整理物品时发现一本很久没翻过的书，今晚没有其他安排。",options:[["读几页书","reading"],["继续收拾","clean"],["先放回原处","replace"],["做原定的事","routine"]]},
{id:"F05",text:"原定的讲座推迟了四十分钟，你已经到达附近，不方便回去。",options:[["在附近散步","walk"],["找地方自习","study"],["去商店看看","shopping"],["坐着休息","rest"]]},
{id:"F06",text:"明天上午的安排临时取消了，今晚可以比原计划晚一点休息。",options:[["继续个人兴趣","hobby"],["整理下周计划","planning"],["看一集节目","video"],["仍然按时睡觉","sleep"]]}
];

// 模块二：明确在“准备玩游戏”时选择伙伴，测游戏关系来源，不再使用含糊的“互动”。
const gameTrials=[
{id:"G01",context:"今晚你准备玩一会儿自己熟悉的多人游戏，时间比较充足。",question:"你最可能怎么开始？",options:[["自己先玩","solo_game"],["叫现实朋友","real_friend"],["找固定游戏好友","game_friend"],["直接随机匹配","stranger"]]},
{id:"G02",context:"游戏里开放了一项需要多人配合的新活动，你想体验一下。",question:"你会优先选择谁一起完成？",options:[["尝试单人完成","solo_game"],["邀请现实朋友","real_friend"],["联系固定队友","game_friend"],["临时招募玩家","stranger"]]},
{id:"G03",context:"你想认真完成几局排位赛，希望队友之间能够配合。",question:"你更可能采用哪种方式？",options:[["自己单排","solo_game"],["约现实朋友组队","real_friend"],["找熟悉游戏好友","game_friend"],["系统随机匹配","stranger"]]},
{id:"G04",context:"你刚开始玩一款新的多人游戏，对玩法还不太熟悉。",question:"接下来你更可能怎么做？",options:[["自己慢慢摸索","solo_game"],["问现实朋友一起玩","real_friend"],["找游戏好友带一带","game_friend"],["加入陌生人队伍","stranger"]]},
{id:"G05",context:"周末晚上，你想轻松玩一会儿游戏，不追求排名或奖励。",question:"你会怎样安排？",options:[["自己随便玩玩","solo_game"],["叫现实朋友上线","real_friend"],["找常玩的游戏好友","game_friend"],["进入公开房间","stranger"]]},
{id:"G06",context:"你有一段时间没有上线，今天重新进入以前常玩的多人游戏。",question:"你最可能先做什么？",options:[["独自熟悉操作","solo_game"],["问现实朋友玩不玩","real_friend"],["联系以前的游戏好友","game_friend"],["直接开始匹配","stranger"]]}
];
const gameFillers=[
{id:"GF01",context:"你准备体验一款刚下载的游戏，可以先选择不同的游戏模式。",question:"你最想先体验哪种？",options:[["剧情模式","story"],["探索模式","explore"],["挑战模式","challenge"],["教学模式","tutorial"]]},
{id:"GF02",context:"游戏更新后增加了几项新内容，而你今天只有半小时空闲时间。",question:"你会优先做什么？",options:[["查看更新说明","update"],["调整操作设置","settings"],["体验新地图","map"],["完成日常任务","daily"]]}
];

const timeline=[];
timeline.push({type:jsPsychSurveyHtmlForm,preamble:`<div class="card"><h2>大学生日常活动与娱乐选择研究</h2><p>本研究关注大学生在不同日常情境下的活动选择，约需15—20分钟。答案没有对错，请按照第一反应作答。</p></div>`,html:`<label>测试编号（没有可留空）</label><input name="research_code" type="text"><label>年龄</label><input name="age" type="number" min="18" max="40" required><label>性别</label><select name="gender" required><option value="">请选择</option><option>女</option><option>男</option><option>其他/不愿回答</option></select><label>目前是否为在校大学生？</label><select name="student" required><option value="">请选择</option><option value="yes">是</option><option value="no">否</option></select><p><label><input type="checkbox" name="consent" required> 我已年满18岁，自愿参加本次试测</label></p>`,button_label:"开始",data:{phase:"demographics"}});
timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><h2>第一部分</h2><p>请想象自己处于接下来的日常情境中，并选择你最可能采取的做法。</p><p class="hint">题目之间没有固定联系，请分别作答。</p></div>`,choices:["开始"],data:{phase:"instruction_a"}});

function addDaily(item,index,total,isFiller=false){const opts=jsPsych.randomization.shuffle(item.options.map(x=>isFiller?{label:x[0],code:x[1],social:null}:{label:x[0],social:x[1],code:x[2]}));timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><div class="progress">${index}/${total}</div><div class="scene">${item.text}</div><div class="question">接下来，你更可能做什么？</div></div>`,choices:opts.map(x=>x.label),data:{phase:"behavior",task:isFiller?"daily_filler":"social_approach",scenario_id:item.id,need_type:item.need||"filler",option_order:opts.map(x=>x.code).join("|")},on_finish:d=>{const c=opts[d.response];d.choice_code=c.code;if(!isFiller)d.seek_social=c.social;}});}
const dailyOrder=jsPsych.randomization.shuffle([...dailyCritical.map(x=>({...x,isFiller:false})),...dailyFillers.map(x=>({...x,isFiller:true}))]);
dailyOrder.forEach((x,i)=>addDaily(x,i+1,dailyOrder.length,x.isFiller));

timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><h2>第二部分</h2><p>下面是另一组有关休闲娱乐安排的情境。请继续根据自己的真实习惯选择。</p></div>`,choices:["继续"],data:{phase:"instruction_b"}});
function addGame(item,index,total,isFiller=false){const opts=jsPsych.randomization.shuffle(item.options.map(x=>({label:x[0],code:x[1]})));timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><div class="progress">${index}/${total}</div><div class="scene">${item.context}</div><div class="question">${item.question}</div></div>`,choices:opts.map(x=>x.label),data:{phase:"behavior",task:isFiller?"game_filler":"game_partner",scenario_id:item.id,option_order:opts.map(x=>x.code).join("|")},on_finish:d=>{d.partner_code=opts[d.response].code;}});}
const gameOrder=jsPsych.randomization.shuffle([...gameTrials.map(x=>({...x,isFiller:false})),...gameFillers.map(x=>({...x,isFiller:true}))]);
gameOrder.forEach((x,i)=>addGame(x,i+1,gameOrder.length,x.isFiller));

// 目的察觉必须放在研究问卷之前，以免问卷内容提示研究目的。
timeline.push({type:jsPsychSurveyHtmlForm,preamble:`<div class="card"><h2>任务体验</h2><p>请根据刚才的实际感受作答。</p></div>`,html:`<label>你认为刚才的任务主要想研究什么？</label><textarea name="purpose_guess" rows="4" required></textarea><label>你作答时是否使用了固定策略？</label><textarea name="strategy" rows="3"></textarea><label>是否有题目让你觉得重复、难懂或不自然？请指出。</label><textarea name="task_feedback" rows="4"></textarea>`,button_label:"继续",data:{phase:"awareness_check"}});

timeline.push({type:jsPsychSurveyHtmlForm,preamble:`<div class="card"><h2>游戏使用情况</h2><p>请根据最近3个月的通常情况填写。</p></div>`,html:`<label>过去12个月是否玩过电子游戏？</label><select name="gaming_12m" required><option value="">请选择</option><option value="yes">是</option><option value="no">否</option></select><label>最近3个月是否玩过电子游戏？</label><select name="gaming_3m" required><option value="">请选择</option><option value="yes">是</option><option value="no">否</option></select><label>平均每周玩游戏多少天？</label><input name="gaming_days_week" type="number" min="0" max="7" required><label>玩游戏的日子里，平均每天多少小时？</label><input name="gaming_hours_day" type="number" min="0" max="24" step="0.5" required><label>最常玩的游戏或类型</label><input name="main_games" type="text" required><label>是否有固定游戏伙伴？</label><select name="fixed_partners" required><option value="">请选择</option><option value="yes">有</option><option value="no">没有</option></select>`,button_label:"继续",data:{phase:"gaming_profile"}});

const f5=["1 从不","2 很少","3 有时","4 经常","5 总是"],a5=["1 非常不同意","2 比较不同意","3 一般","4 比较同意","5 非常同意"];
const igd=["过去12个月，我常常想着游戏或期待下一次游戏。","当不能玩游戏时，我会感到烦躁、焦虑或难过。","我需要花越来越多时间玩游戏才能感到满足。","我曾试图减少游戏时间，但没有成功。","我因游戏而对其他活动失去兴趣。","即使知道游戏带来问题，我仍继续玩。","我曾向家人或他人隐瞒自己的游戏时间。","我会通过游戏缓解负面情绪。","我曾因游戏危及或失去重要关系、学习或工作机会。"];
timeline.push({type:jsPsychSurveyLikert,preamble:`<div class="card"><h2>游戏体验</h2><p>请根据过去12个月作答。当前为试测措辞。</p></div>`,questions:igd.map((prompt,i)=>({prompt,labels:f5,required:true,name:`igd${i+1}`})),button_label:"继续",data:{phase:"questionnaire",scale:"IGDS9_pilot"},on_finish:d=>d.igd_total=Object.values(d.response).map(x=>Number(x)+1).reduce((a,b)=>a+b,0)});
const embed=["我在游戏中有可以稳定联系的人。","我觉得自己属于某个游戏群体或小队。","游戏伙伴会关心我的感受或近况。","与游戏伙伴相处能满足我的社交需要。","游戏中的人际关系对我很重要。","离开常玩的游戏时，我会舍不得其中的人。","即使对游戏内容兴趣下降，我也可能因为伙伴继续上线。","我愿意花时间维持游戏中的关系。"];
timeline.push({type:jsPsychSurveyLikert,preamble:`<div class="card"><h2>游戏中的关系体验</h2><p>以下是试测题目，请按实际情况作答。</p></div>`,questions:embed.map((prompt,i)=>({prompt,labels:a5,required:true,name:`embed${i+1}`})),button_label:"继续",data:{phase:"questionnaire",scale:"custom_game_embeddedness"},on_finish:d=>d.embed_total=Object.values(d.response).map(x=>Number(x)+1).reduce((a,b)=>a+b,0)});
const real=["我通常能从现实中的朋友那里获得陪伴。","遇到事情时，我愿意联系现实中认识的人。","我在现实群体中通常能感到自己是其中一员。","和现实中的人相处时，我一般能够自然表达自己。","我拥有可以稳定联系的现实朋友。","现实中的人际关系能够满足我的社交需要。"];
timeline.push({type:jsPsychSurveyLikert,preamble:`<div class="card"><h2>日常关系体验</h2><p>以下是试测题目，请按实际情况作答。</p></div>`,questions:real.map((prompt,i)=>({prompt,labels:a5,required:true,name:`real${i+1}`})),button_label:"继续",data:{phase:"questionnaire",scale:"custom_real_social_connection"},on_finish:d=>d.real_total=Object.values(d.response).map(x=>Number(x)+1).reduce((a,b)=>a+b,0)});

timeline.push({type:jsPsychSurveyHtmlForm,preamble:`<div class="card"><h2>最后一个问题</h2></div>`,html:`<label>你对情境、选项或程序还有什么建议？</label><textarea name="final_feedback" rows="5"></textarea>`,button_label:"继续",data:{phase:"final_feedback"}});
timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><h2>谢谢参与</h2><p>点击下方按钮提交本次试测数据。提交后请不要立即关闭页面。</p></div>`,choices:["提交数据"],data:{phase:"end"}});
jsPsych.run(timeline);
