const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=require('path');const dir=__dirname;
const mats=require('./materials.js');
assert.equal(mats.dailyMaterials.length,20);assert.equal(mats.gameMaterials.length,9);
assert.equal(mats.dailyMaterials.filter(x=>!x.filler).length,12);
assert.equal(mats.gameMaterials.filter(x=>!x.filler).length,6);
const ids=[...mats.dailyMaterials,...mats.gameMaterials].map(x=>x.id);assert.equal(new Set(ids).size,29);
for(const m of [...mats.dailyMaterials,...mats.gameMaterials]){assert.equal(m.options.length,4);assert.equal(new Set(m.options.map(o=>o.label)).size,4);}
for(const m of mats.gameMaterials.filter(x=>!x.filler))assert.deepEqual(m.options.map(x=>x.code),mats.partnerCodes);
function simulate({multi=false,g12=false,g3=false,relations=false,na=false,decline=false,none=false}={}){
 let config,tl,aborted=false,properties={},rows=[];
 const collection=(rs)=>({values:()=>rs,filter:q=>collection(rs.filter(r=>Object.entries(q).every(([k,v])=>r[k]===v))),localSave:()=>{}});
 const psych={randomization:{randomID:()=> 'test-only',shuffle:x=>[...x]},data:{addProperties:p=>{Object.assign(properties,p);rows.forEach(r=>Object.assign(r,p));},get:()=>collection(rows)},run:t=>{tl=t;},abortExperiment:()=>{aborted=true;}};
 const context={window:{innerWidth:390,innerHeight:844},document:{getElementById:()=>({innerHTML:'',onclick:null})},initJsPsych:c=>{config=c;return psych;},jsPsychHtmlButtonResponse:'button',jsPsychSurveyHtmlForm:'form',console};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(dir,'materials.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(dir,'experiment.js'),'utf8'),context);
 assert(!config.extensions);assert.equal(properties.session_complete,0);
 function walk(list){for(const t of list){if(aborted)return;if(t.timeline){if(!t.conditional_function||t.conditional_function())walk(t.timeline);continue;}
 const d={...properties,...t.data,response:0,rt:100};
 if(t.type==='form')d.response={multi:multi?'yes':'no',gaming_12m:g12?'yes':'no',gaming_3m:g3?'yes':'no',relations:relations?'yes':'no',reference_game:'<test game>',purpose_guess:'不知道'};
 if(d.module==='consent'&&decline)d.response=1;
 if(d.module==='scale_item')d.response=na?5:3;
 if((d.module==='daily_task'||d.module==='game_task')&&none)d.response=4;
 if(typeof t.stimulus==='function')assert(t.stimulus().includes('&lt;test game&gt;'));
 rows.push(d);if(t.on_finish)t.on_finish(d);
 }}walk(tl);config.on_finish();return rows;
}
let rows=simulate({multi:true,g12:true,g3:true,relations:true});
assert.equal(rows.filter(r=>r.module==='game_task').length,9);assert.equal(rows.filter(r=>r.module==='scale_item').length,7);assert.equal(rows.filter(r=>r.module==='scale_pending').length,3);
assert(rows.every(r=>r.review_only===1&&r.formal_collection_ready===0&&r.session_complete===1&&r.upload_status==='disabled_review'));
assert.equal(rows.at(-1).SOC_translation_draft_total,16);assert.equal(rows.at(-1).RSC_translation_draft_mean,4);
rows=simulate();assert.equal(rows.filter(r=>r.module==='game_task').length,0);assert.equal(rows.filter(r=>r.module==='scale_item').length,0);assert.equal(rows.filter(r=>r.module==='scale_pending').length,1);
rows=simulate({g12:true,g3:true});assert.equal(rows.filter(r=>r.module==='scale_pending').length,3);assert.equal(rows.filter(r=>r.module==='game_task').length,0);
rows=simulate({g12:true});assert.equal(rows.filter(r=>r.module==='scale_pending').length,2);
rows=simulate({multi:true,g12:true,g3:true,relations:false});assert.equal(rows.filter(r=>r.module==='scale_item').length,0);
rows=simulate({multi:true,g12:true,g3:true,relations:true,na:true,none:true});assert.equal(rows.at(-1).SOC_translation_draft_total,null);assert(rows.filter(r=>r.module==='daily_task').every(r=>r.seek_social===null&&r.none_fit===1));assert(rows.filter(r=>r.module==='scale_item').every(r=>r.applicable===0&&r.item_value===null));
rows=simulate({decline:true});assert.equal(rows.length,2);assert(rows.every(r=>r.session_complete===0));
rows=simulate({multi:true});assert.equal(rows.find(r=>r.module==='gaming_profile').profile_inconsistent,1);
console.log('PASS: materials, 8 review paths, completion, draft scoring, missingness, escaping and no-upload initialization');
