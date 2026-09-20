"""把所有被试CSV放入 data/ 后运行：python quick_analysis.py"""
from pathlib import Path
import pandas as pd

files = list(Path("data").glob("*.csv"))
if not files:
    raise SystemExit("data/ 中没有CSV文件")

raw = pd.concat((pd.read_csv(f) for f in files), ignore_index=True)
formal = raw.query("phase == 'formal'").copy()

stage1 = formal.query("task == 'stage1_seek_social'")
s1 = stage1.groupby(["participant_id", "condition"], as_index=False).agg(
    seek_rate=("seek_social", "mean"), median_rt=("rt", "median"), n=("seek_social", "size")
)
print("\nStage 1：寻求互动比例")
print(s1.groupby("condition")["seek_rate"].agg(["mean", "std", "count"]))

stage2 = formal.query("task == 'stage2_channel'")
s2 = (stage2.groupby(["participant_id", "condition", "channel_code"]).size()
      .groupby(level=[0,1]).apply(lambda x: x / x.sum(), include_groups=False)
      .rename("proportion").reset_index())
print("\nStage 2：渠道选择比例")
print(s2.groupby(["condition", "channel_code"])["proportion"].agg(["mean", "std", "count"]))

igd = raw.loc[raw["igd_total"].notna(), ["participant_id", "igd_total"]].drop_duplicates()
wide = s1.pivot(index="participant_id", columns="condition", values="seek_rate").reset_index()
if {"neutral", "social_setback"}.issubset(wide.columns):
    wide["setback_effect"] = wide["social_setback"] - wide["neutral"]
    wide = wide.merge(igd, on="participant_id", how="left")
    print("\n被试层面摘要（setback_effect < 0 表示社会受挫后更少寻求互动）")
    print(wide.to_string(index=False))

Path("results").mkdir(exist_ok=True)
s1.to_csv("results/stage1_by_participant.csv", index=False, encoding="utf-8-sig")
s2.to_csv("results/stage2_by_participant.csv", index=False, encoding="utf-8-sig")
