"""把V3的CSV放入data/后运行：python quick_analysis.py"""
from pathlib import Path
import pandas as pd

files=list(Path("data").glob("*.csv"))
if not files: raise SystemExit("data/中没有CSV文件")
raw=pd.concat((pd.read_csv(f) for f in files),ignore_index=True)

a=raw.query("task == 'social_approach'").copy()
approach=a.groupby("participant_id",as_index=False).agg(social_approach_rate=("seek_social","mean"),approach_median_rt=("rt","median"),n_approach=("seek_social","size"))

g=raw.query("task == 'game_partner'").copy()
if len(g):
    partner=(g.groupby(["participant_id","partner_code"]).size().rename("n_choice").reset_index())
    partner["n_game_trials"]=partner.groupby("participant_id")["n_choice"].transform("sum")
    partner["proportion"]=partner["n_choice"]/partner["n_game_trials"]
    partner_wide=partner.pivot(index="participant_id",columns="partner_code",values="proportion").fillna(0).reset_index()
else:
    partner=pd.DataFrame();partner_wide=pd.DataFrame({"participant_id":approach.participant_id})

summary=approach.merge(partner_wide,on="participant_id",how="left")
for col in ["igd_total","embed_total","real_total"]:
    if col in raw.columns:
        score=raw.loc[raw[col].notna(),["participant_id",col]].drop_duplicates("participant_id")
        summary=summary.merge(score,on="participant_id",how="left")

Path("results").mkdir(exist_ok=True)
summary.to_csv("results/participant_summary.csv",index=False,encoding="utf-8-sig")
if len(partner): partner.to_csv("results/game_partner_choices.csv",index=False,encoding="utf-8-sig")
print("\n被试层面指标：")
print(summary.to_string(index=False))
print("\n注意：少量试测只用于检查分布和材料，不用于正式划分亚型。")
