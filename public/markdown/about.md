### 关于网站

这里是bangrecs, 这个网站致力于提供精确的bangumi番剧推荐, 同时保留高度灵活的番剧过滤系统，能够通过tag和时间等信息缩小推荐的候选范围。

### 关于模型
* 默认模型: 一种基于统计的启发式模型, 会维护一个条目之间的转移得分, 是根据用户收藏序列统计出来的, 压低了同季度和热门作品之间的转移得分权重
* SAS: 深度学习模型sasrec, 是一个序列推荐模型，根据收藏序列预测下一作品
* HT: 把作品分成了7个类别，分别单独训练，混杂了MF(anime 和 tv), 默认模型(书籍)，序列推荐模型 BanTrans(anime_nsfw, 游戏)

### 感谢
* bangumi 官方提供的 [相关数据](https://github.com/bangumi/Archive) 和 [API](https://bangumi.github.io/api/)
* 这个项目有大量代码由 [ChatGPT4](https://openai.com/) 完成，尤其是网页
* 网站设计参考了 咕咕子的 [bangumi客户端](https://bgm.tv/group/topic/350677) 和 [chii.ai](https://chii.ai) 网站 的设计风格
* 每一个参与相关讨论的ban友

### 开发人员
* klion: [bangumi:@klove](https://bgm.tv/user/klove) | [telegram:@klion2](https://t.me/klion2) 