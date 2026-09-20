"""将所有V2被试CSV放进 data/ 后运行：python quick_analysis.py"""
from pathlib import Path
import pandas as pd

files=list(Path("data").glob("*.csv"))
if not files:
    raise SystemExit("data/ 中没有CSV文件")
raw=pd.concat((pd.read_csv(f) for f in files),ignore_index=True)
formal=raw.query("phase == 'formal'").copy()

# Stage 1：只比较8个社会受挫与8个匹配中性情境；填充题不进入主比较。
s1raw=formal.query("task == 'stage1_activity' and condition != 'filler'").copy()
s1=s1raw.groupby(["participant_id","condition"],as_index=False).agg(
    seek_rate=("seek_social","mean"),median_rt=("rt","median"),n=("seek_social","size"))
print("\nStage 1：寻求互动比例")
print(s1.groupby("condition")["seek_rate"].agg(["mean","std","count"]))

# Stage 2是条件性数据：比例的分母为该被试实际进入Stage 2的次数。
s2raw=formal.query("task == 'stage2_channel'").copy()
if len(s2raw):
    counts=s2raw.groupby(["participant_id","condition","channel_code"]).size().rename("n_choice").reset_index()
    counts["n_stage2"]=counts.groupby(["participant_id","condition"])["n_choice"].transform("sum")
    counts["proportion"]=counts["n_choice"]/counts["n_stage2"]
    print("\nStage 2：条件性渠道选择比例")
    print(counts.groupby(["condition","channel_code"])["proportion"].agg(["mean","std","count"]))
else:
    counts=pd.DataFrame()
    print("\n没有被试触发Stage 2；需检查Stage 1选项吸引力。")

# 被试层面的受挫效应：负值表示受挫后更少寻求互动。
wide=s1.pivot(index="participant_id",columns="condition",values="seek_rate").reset_index()
if {"neutral","social_setback"}.issubset(wide.columns):
    wide["setback_effect"]=wide["social_setback"]-wide["neutral"]
    scales=[]
    for col in ["igd_total","embed_total","socialdiff_total"]:
        if col in raw.columns:
            tmp=raw.loc[raw[col].notna(),["participant_id",col]].drop_duplicates("participant_id")
            scales.append(tmp)
    for tmp in scales:
        wide=wide.merge(tmp,on="participant_id",how="left")
    print("\n被试层面摘要")
    print(wide.to_string(index=False))

Path("results").mkdir(exist_ok=True)
s1.to_csv("results/stage1_by_participant.csv",index=False,encoding="utf-8-sig")
if len(counts): counts.to_csv("results/stage2_by_participant.csv",index=False,encoding="utf-8-sig")
wide.to_csv("results/participant_summary.csv",index=False,encoding="utf-8-sig")
