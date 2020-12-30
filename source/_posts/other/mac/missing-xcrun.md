---
title: Mac系统升级后出现 "xcode-select error"
date: 2020-12-30 13:49:58
tags: ['Mac']
category: 'Mac'
---

> 升级mac系统之后使用git时，出现了报错信息：
>
> xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun

重装xcode command line 得到解决

```powershell
xcode-select --install
```

