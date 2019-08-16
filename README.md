# Alt Changer

Alt Changer 是在 2019 年微软学生夏令营第 07 组在 hackathon 环节的项目。这里存放着这个项目的 demo 以及其他一些相关的资料。尽管我们没有获得 Best Project，但还是放在这里，以作纪念 & 供未来的新同学参考。

## 简介

2019 年的夏令营 hackathon 有三个主题：health, accessibility 和 productivity，三者选其一。我们选择的是 accessibility 方向。

在 HTML 标准中，`<img>` 标签的 `alt` 属性是对应图片的替代文字，不支持图片显示的浏览器以及屏幕阅读器等会使用这个属性的内容代替图片。对普通人来说，这个属性是用不到的。但是对于视障患者来说，这个属性就会被屏幕阅读器使用，告诉他这张图片的内容。

而现在，机器学习的相关技术已经可以做到使用自然语言描述图片的内容。

我们想做的事情，就是结合这样相关的技术，通过开发浏览器的扩展，让视障患者在不改变自己日常使用的浏览器、屏幕阅读器等的基础上，能够获知图片的内容，更加接近健全者浏览网页的体验。

## Demo 的技术细节

我们编写了一个油猴脚本 ([Alt-Changer.js](https://github.com/taoky/Alt-Changer/blob/master/Alt-Changer.js))，在加载网页完成后它会被执行，提取页面中所有的图片标签，将图片的 URL 提交到 [Azure 认知服务中的图像说明](https://docs.microsoft.com/zh-cn/azure/cognitive-services/computer-vision/concept-describing-images)中。如果它所返回的 confidence 超过阈值，流程结束，否则会再将图片 URL 提交到 [Bing 的图像搜索](https://docs.microsoft.com/zh-cn/azure/cognitive-services/bing-image-search)[^1]中，根据返回的内容修改标签的 alt 属性。

如果你需要运行这个脚本，你需要使用 Azure 的国际版账户（学生邮箱可以申请每年 $100 的额度），创建计算机视觉和必应搜索的资源，修改脚本中对应的 URL 和 key。并且修改 `@match` 到你自己的测试站点（或者所有的站点）。

---
[^1]: 默认情况下，Bing 图像搜索的结果与请求者 IP 所处的位置相关。在不同的网络配置环境中，得到的结果可能是不一样的。
