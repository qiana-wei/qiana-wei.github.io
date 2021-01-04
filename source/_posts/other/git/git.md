---
title: Git
date: 2020-5-9 14:50:58
tags: ['Mac','Git']
category: 'Git'
---


# 一. 安装git

安装命令：

```bash
brew install git
```

检验安装结果：

```shell
git --version

# 运行结果
git version 2.24.2 (Apple Git-127)
```

# 二. 配置git信息

**配置username和email**

```shell
git config --global user.name "username"
git config --global user.email "email"
```

**配置ssh-key**

1. 检查电脑是否生成过密钥

```shell
cd ~/.ssh
```

2. 若没有密钥，则生成密钥

```shell
ssh-keygen -o
```



```shell
# 确认私钥路径，输入密码～
# 结果
ssh-keygen -o
Enter file in which to save the key (/Users/qiana/.ssh/id_rsa):
Created directory '/Users/qiana/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/qiana/.ssh/id_rsa.
Your public key has been saved in /Users/qiana/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:i1vBlWnpPlZLcWkAGDsoyxpeJzQJg9met/yPAs5oNls qiana@QianadeMacBook-Pro.local
The key's randomart image is:
+---[RSA 3072]----+
| +o     .o...    |
|o .o . ... + . . |
| . .= . o * . +  |
|  oo.+ . =   +   |
|  .o=.. S . o    |
| ..+oo . + o .   |
| +oE .. o + .    |
|.++ . .+ . .     |
|o.o  .o..        |
+----[SHA256]-----+
```

3. 复制ssh到github

```shell
# 进入ssh目录
cd ~/.ssh

# 查看id_rsa.pub 并复制
vim id_rsa.pub

# 粘贴到github SSH and GPG keys
```

# 三. 不输入ssh key 密码

```shell
ssh-add ~/.ssh/id_rsa
```
