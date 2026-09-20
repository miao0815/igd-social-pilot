const VERSION = "pilot-v1.0-2026-09-17";
const N_PRACTICE = 2;

const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  on_finish: () => {
    const id = jsPsych.data.get().values()[0]?.participant_id || "unknown";
    jsPsych.data.get().localSave("csv", `IGD_social_${id}_${Date.now()}.csv`);
    document.body.innerHTML = `<main class="card" style="max-width:720px;margin:8vh auto"><h2>实验完成</h2><p>数据文件已下载。请将 CSV 文件发送给研究者。</p><p class="small">若浏览器询问是否允许下载，请选择“允许”。现在可以关闭页面。</p></main>`;
  }
});

const participantId = jsPsych.randomization.randomID(10);
jsPsych.data.addProperties({
  participant_id: participantId,
  experiment_version: VERSION,
  started_at: new Date().toISOString(),
  user_agent: navigator.userAgent
});

const scenarios = [
  {id:"R01", condition:"social_setback", text:"你在小组讨论中提出了一个想法，但大家很快转向了别的话题。回到宿舍后，你暂时没有其他安排。"},
  {id:"R02", condition:"social_setback", text:"你给几位同学发了周末活动的消息，过了一段时间还没有收到回复。此时你有一段自由时间。"},
  {id:"R03", condition:"social_setback", text:"今天和熟人聊天时，你几次想加入话题，却没找到合适的机会。晚上你可以自行安排活动。"},
  {id:"R04", condition:"social_setback", text:"课程分组刚刚确定，你发现熟悉的同学都去了别组，自己要和不太熟的人合作。现在你回到了寝室。"},
  {id:"R05", condition:"social_setback", text:"你分享的一件开心事只得到很简短的回应，聊天很快结束了。接下来的一小时没有任务。"},
  {id:"R06", condition:"social_setback", text:"聚会中大家谈论你不熟悉的话题，你大部分时间都在旁听。回去后你想放松一下。"},
  {id:"R07", condition:"social_setback", text:"你约朋友吃饭，但对方临时有事取消了。原本空出来的时间现在由你支配。"},
  {id:"R08", condition:"social_setback", text:"群聊里你的消息被后面的讨论盖过去了，没有人接着回应。此刻你正独自在房间里。"},
  {id:"R09", condition:"social_setback", text:"一次合作结束后，其他成员相约继续聊天，却没有叫上你。你随后回到自己的住处。"},
  {id:"R10", condition:"social_setback", text:"你在社团活动中感觉和周围的人不太合拍，提前离开了。现在还有不少空闲时间。"},
  {id:"R11", condition:"social_setback", text:"你尝试向朋友倾诉最近的烦恼，但对方很忙，谈话很快结束。你准备自己休息一会儿。"},
  {id:"R12", condition:"social_setback", text:"你看到熟悉的人一起活动，却没有收到邀请。当天晚上你没有必须完成的事情。"},
  {id:"N01", condition:"neutral", text:"你刚整理完桌面和文件，接下来有一段自由时间，可以自行安排。"},
  {id:"N02", condition:"neutral", text:"今天的课程按计划结束，你回到住处，晚上暂时没有其他安排。"},
  {id:"N03", condition:"neutral", text:"你刚吃完饭，手头没有紧急任务，接下来可以选择一种活动。"},
  {id:"N04", condition:"neutral", text:"你完成了今天计划中的学习内容，现在准备休息一会儿。"},
  {id:"N05", condition:"neutral", text:"你乘车回到学校，路上没有发生特别的事情，现在有一些空闲时间。"},
  {id:"N06", condition:"neutral", text:"你刚洗完衣服并收拾好物品，接下来可以自由安排一个小时。"},
  {id:"N07", condition:"neutral", text:"今天的日程比较普通，晚饭后你没有固定计划。"},
  {id:"N08", condition:"neutral", text:"你查完明天需要的信息，暂时没有新的消息需要处理。"},
  {id:"N09", condition:"neutral", text:"你从图书馆回到寝室，已经完成了预定任务，可以放松一下。"},
  {id:"N10", condition:"neutral", text:"下午的事情顺利结束，你坐下来准备选择接下来做什么。"},
  {id:"N11", condition:"neutral", text:"你完成了一次日常采购，回到住处后有一段完整的自由时间。"},
  {id:"N12", condition:"neutral", text:"今天没有特别的事情发生，你完成日常安排后准备休息。"}
];

const practice = [
  {id:"P01",condition:"practice",text:"练习：你完成了今天的安排，现在有半小时空闲时间。"},
  {id:"P02",condition:"practice",text:"练习：一次聊天刚刚结束，你准备选择接下来如何放松。"}
];

const timeline = [];
timeline.push({
  type: jsPsychSurveyHtmlForm,
  preamble: `<div class="card"><h2>社会需求满足渠道选择任务（试测版）</h2><p>本研究关注大学生在不同日常情境下的活动与互动选择。全程约 12–15 分钟，答案没有对错。数据仅用于研究试测。</p><p class="small">继续即表示你已年满18岁、自愿参加，并知悉可随时关闭页面退出。</p></div>`,
  html: `<label>被试编号（由研究者提供；没有可留空）</label><input name="research_code" type="text"><label>年龄</label><input name="age" type="number" min="18" max="40" required><label>性别</label><select name="gender" required><option value="">请选择</option><option>女</option><option>男</option><option>其他/不愿回答</option></select><p><label><input type="checkbox" name="consent" required> 我已阅读说明并同意参加</label></p>`,
  button_label: "开始",
  data: {phase:"demographics"}
});

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div class="card"><div class="eyebrow">任务说明</div><h2>每个情境包含两个连续选择</h2><p><b>阶段1：是否寻求社交</b><br>请选择此刻更想独自活动，还是与他人互动。</p><p><b>阶段2：如何社交</b><br>无论阶段1选择什么，都请假设“如果此刻要通过游戏与人互动”，再选择最愿意联系的对象。</p><p class="hint">请根据第一直觉作答。先完成 ${N_PRACTICE} 个练习情境，再进入正式任务。</p></div>`,
  choices:["进入练习"], data:{phase:"instruction"}
});

function addScenarioTrials(items, phase){
  items.forEach((s, i) => {
    const side = jsPsych.randomization.shuffle(["alone","social"]);
    const labels = {alone:"独自活动，不与他人互动", social:"与他人进行互动"};
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<div class="card"><div class="progress">${phase==="formal"?`正式情境 ${i+1}/${items.length}`:"练习"}</div><div class="eyebrow">情境</div><div class="scene">${s.text}</div><div class="question">阶段1：此刻你更愿意怎么做？</div></div>`,
      choices: side.map(x=>labels[x]),
      data:{phase, task:"stage1_seek_social", scenario_id:s.id, condition:s.condition, option_order:side.join("|")},
      on_finish:d=>{ d.choice_code=side[d.response]; d.seek_social=d.choice_code==="social"?1:0; }
    });
    const channels = jsPsych.randomization.shuffle([
      {code:"offline_friend",label:"联系现实中认识的朋友，一起玩游戏"},
      {code:"game_friend",label:"联系只在游戏中认识的游戏好友"},
      {code:"stranger",label:"随机匹配陌生玩家，一起玩游戏"}
    ]);
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<div class="card"><div class="eyebrow">同一情境</div><div class="scene">${s.text}</div><div class="question">阶段2：如果此刻要通过游戏与人互动，你最愿意选择谁？</div><p class="hint">即使上一题选择了独自活动，也请回答这个假设问题。</p></div>`,
      choices: channels.map(x=>x.label),
      data:{phase, task:"stage2_channel", scenario_id:s.id, condition:s.condition, option_order:channels.map(x=>x.code).join("|")},
      on_finish:d=>{ d.channel_code=channels[d.response].code; d.game_embedded_choice=d.channel_code==="game_friend"?1:0; }
    });
  });
}

addScenarioTrials(practice, "practice");
timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><h2>练习结束</h2><p>接下来共有 24 个正式情境。请继续按第一直觉作答。</p></div>`,choices:["开始正式任务"],data:{phase:"transition"}});
addScenarioTrials(jsPsych.randomization.shuffle(scenarios), "formal");

const scale = ["1 从不","2 很少","3 有时","4 经常","5 总是"];
const igdItems = [
  "过去12个月，我常常想着游戏或期待下一次游戏。","当不能玩游戏时，我会感到烦躁、焦虑或难过。","我需要花越来越多时间玩游戏才能感到满足。","我曾试图减少游戏时间，但没有成功。","我因游戏而对其他活动失去兴趣。","即使知道游戏带来问题，我仍继续玩。","我曾向家人或他人隐瞒自己的游戏时间。","我会通过游戏缓解负面情绪。","我曾因游戏危及或失去重要关系、学习或工作机会。"
];
timeline.push({
  type:jsPsychSurveyLikert,
  preamble:`<div class="card"><h2>游戏使用情况</h2><p>请根据过去12个月的实际情况作答。</p></div>`,
  questions:igdItems.map((prompt,i)=>({prompt,labels:scale,required:true,name:`igd${i+1}`})),
  button_label:"继续", data:{phase:"questionnaire",scale:"IGDS9-SF_Chinese_pilot_wording"},
  on_finish:d=>{ const vals=Object.values(d.response).map(Number); d.igd_total=vals.reduce((a,b)=>a+b,0); }
});

const pilotItems = [
  "当我想找人一起玩时，通常能很快找到游戏伙伴。","我在游戏中有可以稳定联系的人。","游戏中的伙伴关系让我感到自己属于某个群体。","与游戏伙伴互动能满足我的社交需要。","现实社交让我紧张或担心被否定。","比起现实中的面对面互动，我更容易在游戏中与人交流。"
];
timeline.push({
  type:jsPsychSurveyLikert,
  preamble:`<div class="card"><h2>游戏与社交体验（试测题）</h2><p>以下是为本次程序试测设置的探索性题目，并非正式量表。</p></div>`,
  questions:pilotItems.map((prompt,i)=>({prompt,labels:["1 非常不同意","2 比较不同意","3 一般","4 比较同意","5 非常同意"],required:true,name:`pilot_social${i+1}`})),
  button_label:"提交并下载数据", data:{phase:"questionnaire",scale:"custom_pilot_social_items"}
});

timeline.push({type:jsPsychHtmlButtonResponse,stimulus:`<div class="card"><h2>谢谢参与</h2><p>点击下方按钮后将下载 CSV 数据。</p></div>`,choices:["下载数据"],data:{phase:"end"}});
jsPsych.run(timeline);
