---
title: HTTPS
date: 2020-12-25 20:49:58
tags: ['HTTPS','性能优化']
category: 'HTTP'
---

> HTTPS：加密传输协议

> HTTP协议是基于TCP协议进行传输的。在HTTP协议与TCP协议之间添加一个安全协议层（TLS、SSL）即我们所说的HTTPS。

# HTTPS的作用

1. 对数据进行加密，建立一个安全的信息通道，保障传输过程中数据的安全。
2. 对网站服务器进行真实身份认证

# HTTPS对性能的影响

HTTPS对性能的影响主要来自两方面：

1. 协议交互所增加的RTT（Round-trip time）
2. 加解密相关的计算消耗

