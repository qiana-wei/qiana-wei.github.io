---
title: iTerm2 配置
date: 2020-5-9 13:50:58
tags: ['Mac','iTerm2']
category: 'iTerm2'
---

# 一. 安装 iTerm2

1. 直接在官网上[http://iterm2.com/](https://iterm2.com/) 下载并安装
2. 使用brew安装

```shell
brew tap caskroom/cask
brew cask install iterm2
```

# 二. 安装oh-my-zsh

git地址： [https://github.com/robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

使用`curl` 或 `wget`安装 (大概是需要翻墙的，终端翻墙和浏览器翻墙不太一样呢。。)

**curl**

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**wget**

```shell
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

终端翻墙：

在命令行输入代理命令：

```shell
export https_proxy=http://xxx.xxx.xxx.xxx:xxxx http_proxy=http://1xxx.xxx.xxx.xxx:xxxx all_proxy=socks5://xxx.xxx.xxx.xxx:xxxx
```



# 三. 配置主题

1. 检查颜色终端配置为xterm-256color

> 位置：iTerm2->Preferences->Profiles->Terminal->Report terminal type

2. 下载 [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) 配色合集

```shell
#创建文件夹并进入（文件夹名字随意取，位置随意放）
mkdir ~/.iterm2 && cd ~/.iterm2
# 下载iTerm2-Color-Schemes
git clone https://github.com/mbadolato/iTerm2-Color-Schemes
```

3. 导入配色方案

iTerm2->Preferences->Profiles->Colors->Color Presets...->Import

选择iTerm2-Color-Schemes 文件夹中schemes下所有配色

然后就可以选择自己喜欢的配色啦

4. 安装字体

```shell
brew tap homebrew/cask-fonts
proxychains4 brew cask install font-hack-nerd-font   # 需要翻墙
```

5. 设置zsh为默认shell

检查系统shell

```shell
cat /etc/shells
# 显示
/bin/bash
/bin/csh
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```

设置zsh为默认shell

```shell
chsh -s $(which zsh)
```

6. 配置主题

[各种主题样式在这里](https://github.com/ohmyzsh/ohmyzsh/wiki/themes)

选择喜欢的主题

```shell
vim ~/.zshrc
# 修改 ZSH_THEME,
```

应用修改后的.zshrc

```shell
source ~/.zshrc
```

我配置了一个名为[powerlevel9k](https://github.com/bhilburn/powerlevel9k) 的主题，然后通过[Prompt Customization](https://github.com/bhilburn/powerlevel9k#prompt-customization) 和 [Stylizing Your Prompt](https://github.com/bhilburn/powerlevel9k/wiki/Stylizing-Your-Prompt) 进行一些自己喜欢的配置

**下载**

```shell
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
```

**修改zsh主题配置**

```shell
vim ~/.zshrc

# 添加配置
ZSH_THEME="powerlevel9k/powerlevel9k"
POWERLEVEL9K_MODE="nerdfont-complete"  # 字体
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=() # 右边不放元素
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(time ssh dir vcs newline status) # 左边元素：时间、ssh标志、路径、git信息、换行、上一条命令返回的状态
POWERLEVEL9K_PROMPT_ADD_NEWLINE=true # 在新命令前添加换行

# 应用配置
source ~/.zshrc
```

# 四. zsh插件

1. 解压缩 extract

在~/.zshrc中添加extract插件

```shell
plugins=(... extract)
```

[git地址在这里](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/extract),支持的解压缩文件也在这里

解压缩命令

```shell
x filename.zip
```

2. 高亮命令 zsh-syntax-highlighting

**安装**

```shell
brew install zsh-syntax-highlighting
```

**应用**  *路径在安装成功的界面上有哦～* 

```shell
# 添加路径到zshrc中
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
# source zshrc
```

3. 自动提示zsh-autosuggestions

**安装**

```shell
brew install zsh-autosuggestions
```

**应用**

```shell
# 添加路径到zshrc中
source /usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh
# source zshrc
```

# 五. VSCode 终端字体设置

在配置完iTerm2之后，打开VSCode命令行会发现Nerd图标字体没有显示

需要在VSCode中进行配置

在setting.json中添加字体配置

```json
{
  "terminal.integrated.fontFamily": "Hack Nerd Font",
  "terminal.integrated.fontSize": 12,
}
```

就可以显示正常啦