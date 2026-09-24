# V4 审阅版使用说明

版本：V4-review-2026-09-24。独立的完整流程审阅版本，部署在旧 V3 的 `review-v4/` 子目录。

## 先看什么

- `index.html`：完整顺序试填，需要联网加载 jsPsych。将本文件夹上传到已有 GitHub 仓库后，GitHub Pages 地址为 `https://miao0815.github.io/igd-social-pilot/review-v4/`。
- `materials_review.html`：离线题库，全题及后台编码可查看，适合老师逐题审阅；不可用它检验研究目的是否容易被猜到。
- `materials.js`：只改情境与选项时编辑此文件。
- `experiment.js`：顺序、分支、字段和完成页。
- `styles.css`：按钮自动换行、无固定高度，手机单列。

这版从知情同意走到结束页，按游戏经历分支呈现各部分，适合给导师和师姐检查。IGDS9-SF、C-MOGQ Escape、SCS 先以待补说明页保留，尚无前三个量表得分；SOC 4题和RSC 3题为待审译稿，五点评分也不是已核实的正式评分。量表缺口单列于 `量表状态与缺失项.md`。因此可以审阅完整流程，不能据此开始正式量表收数。

## 在 GitHub 增加独立链接

1. 解压 ZIP，找到 `review-v4` 文件夹。
2. 打开现有仓库 `miao0815/igd-social-pilot`，选择 Add file → Upload files。
3. 拖入整个 `review-v4` 文件夹，确认预览的路径以 `review-v4/` 开头，不是在仓库根目录覆盖旧文件。
4. 提交后等待 Pages 部署成功。
5. 部署后打开 `https://miao0815.github.io/igd-social-pilot/review-v4/`。

此 V4 版本尚未上传到仓库；这是你上传后的预期地址。旧链接继续指向现有V3。

## 数据与隐私

本包不加载 DataPipe 扩展，也不发送作答到 Google Drive。审阅结束页可以下载 CSV/JSON，需自行发送给研究者。关闭或刷新前未下载的记录无法从后台找回；本包不提供自动 partial 文件或断点续答。加载 jsPsych 的第三方 CDN 仍会接收常规网页资源请求，不要把本地保存等同于零网络访问。

`review_only=1`、`formal_collection_ready=0`、`upload_status=disabled_review` 始终存在。`session_complete=1` 仅说明审阅流程到了末页，不说明正式量表完整，也不说明已上传。退出为0。

研究者转正式收数时，应另做正式构建：补齐量表、确定取样及伦理材料、核对评分、接回 DataPipe 并验证成功/失败/中断三种状态，不能只删除审阅提示。

## 编码与分析

- 日常20题：12关键题、8填充题；游戏9题：6关键题、3填充题。题目与四个主要选项随机排序。
- 末尾固定第五项 `none_fit` 是本版新增的材料诊断项，不计作“不社交”。所有关键指标先排除填充题和 `none_fit`，另报不适配比例和有效分母。
- 日常关键题：`seek_social=0/1` 只表示是否主动联系他人，不是回避、社交能力或亚型诊断。
- 游戏关键题：`partner_source` 为 `no_active_partner/real_friend/game_friend/public_recruit`，按关系最初来源划分；自动匹配属于不主动找伙伴。
- `choice_code`、`option_order`、`scenario_id` 可回查材料；每题保存RT。手机RT受设备/阅读影响，不作为精确认知加工时间。
- `profile_inconsistent=1` 表示时间窗回答冲突，应人工核对，不把无游戏经历默认成低IGD分。
- SOC/RSC每题单独保存 `scale_name,item_name,item_value,applicable,reference_game`；选择不适用记空值，不记0。只有全部题有效时才输出译稿总分/均分（末页），否则留空。
- 三个待补量表只有 `scale_pending` 记录，无总分。跳过模块记录 `applicable=0`。

## 已做和仍需做的测试

随包 `test_review.cjs` 用 Node 的模拟 jsPsych 环境检查题数、选项编码、不同游戏经历分支、未完成/已完成标记、量表不适用处理及译稿计分。运行 `node test_review.cjs`。

这不等于真实浏览器验收。本交付尚未完成真实安卓/iOS/桌面浏览器视觉和点击测试，也没有测试线上上传（本版没有上传）。发布后请在电脑和手机各完整运行一次，特别检查换行、下拉框、滚动、CDN加载和下载行为。

## 量表来源与待定事项

IGDS9-SF：Pontes量表作者页面及Qin等（2020），doi:10.3389/fpsyt.2020.00470。正式中文条目与指导语待核对。

C-MOGQ：Wu等（2017），doi:10.1556/2006.6.2017.007。Escape四题编号2、9、16、23；完整中文文本待补。原研究建议综合完整量表与子量表信息，不能把单独四题称为已经充分独立验证；完整版/短版由导师决定。

SCS：吴才智等（2022），doi:10.7652/jdyxb202204003。拟采用修订版，最终题目、题数、反向计分键待查原文/作者版本。一般社会联结不自动等同于纯线下社会联结。

SOC/RSC：Tseng等（2015）Table 3，doi:10.1111/jcc4.12141。中文译稿待独立翻译核对与理解度试测。该文解释持续游戏意愿，不是验证游戏成瘾亚型。
