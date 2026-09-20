# 游戏成瘾社会机制两阶段任务：V2试测版

## 本版变化

- 对外名称改为“大学生日常情境与活动选择研究”；
- 24个正式情境：8个社会受挫、8个一一匹配的中性情境、8个填充情境；
- 关键情境扩展为较完整的日常片段；
- Stage 1改为4个具体行动选项，后台编码是否寻求互动；
- 只有Stage 1选择互动时才触发Stage 2；
- Stage 2区分现实线下、现实朋友线上、稳定游戏好友和陌生玩家，并使用多组措辞；
- 增加随机情境操纵检验、游戏经历、IGDS9试测措辞、游戏社交嵌入自编题、现实社交困难自编题；
- 增加目的察觉、策略、材料反馈和程序反馈开放题。

## 当前定位

这是供老师、师姐和少量同学检查材料与程序的试测版。自编题不能作为已验证量表；IGDS9中文措辞也应在正式研究前替换为确认使用的中文版。

## 主要指标

- `seek_social`：Stage 1选择互动行为=1；
- `channel_code`：`offline_face`、`offline_online`、`game_friend`、`game_stranger`；
- `condition`：`social_setback`、`neutral`、`filler`；
- `igd_total`、`embed_total`、`socialdiff_total`：对应试测总分。

预计时长约20—25分钟。建议先让5—10名同学试做，检查情境理解、目的察觉、Stage 2触发率、选项分布和开放反馈。

## 更新GitHub Pages

在原仓库中覆盖旧的`index.html`、`experiment.js`、`styles.css`、`README.md`和`quick_analysis.py`。提交后原实验链接不变。首页显示“约需20分钟”、下载文件名以`IGD_social_V2_`开头，即为新版。
