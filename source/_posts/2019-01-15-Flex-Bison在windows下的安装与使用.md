---
title: Flex-Bison在windows下的安装与使用
date: 2019-01-15 00:00
categories:
  - 编译原理
---
**Linux下安装：**
    
    
    sudo apt-get install flex bison
    flex -h
    bison -h

**Windows下安装：** Flex下载地址：http://gnuwin32.sourceforge.net/packages/flex.htm Biosn下载地址：http://gnuwin32.sourceforge.net/packages/bison.htm

下载选择 **Complete Package，except sources** ![下再说明](https://img-blog.csdnimg.cn/2018102715103511.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L29yaW9uX3Bpc3RhY2hpbw==,size_27,color_FFFFFF,t_70)

安装过程和一般的win应用一样，点击setup.exe安装，默认安装位置是**C盘** ，可以自己修改，先安装 **Flex** 在安装 **Bison** （比如我的目录是“**D:** ”， _一般来说Bison的安装位置和Flex一致，如果不一致请修改成一样_ ）

安装完成后打开安装目录（flex和bison在一起）： ![就是这个样子的](https://img-blog.csdnimg.cn/20181027151608641.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L29yaW9uX3Bpc3RhY2hpbw==,size_27,color_FFFFFF,t_70)

**接下来配置环境变量：** 将“**D:*”添加到**“系统变量**”中。

**接下来在cmd中查看是否安装成功：**
    
    
    flex -V      //就是大写的VVVVVVVV！！！！！
    bison -V     //就是大写的VVVVVVVV！！！！！

可以得到如下结果 ![cmd结果](https://img-blog.csdnimg.cn/2018102715204969.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L29yaW9uX3Bpc3RhY2hpbw==,size_27,color_FFFFFF,t_70)
    
    
    [Tips]
    1.如果没有出现以上结果，请重启之后再试。（默认会修改环境变量）
    2.作为词法分析器使用并编译C代码需要在安装GCC，自行百度。

**下面进行一个小测试：** 代码要求：进行数字转换，比如2e3转换成2000、1.23e1转换成12.3...

这里发个链接供参考：https://blog.csdn.net/mayuko2012/article/details/51207192?locationNum=5

JNU CS1604 Orion233