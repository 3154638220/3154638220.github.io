---
title: KMP
date: 2024-06-23 16:11:59
tags: KMP
categories: 笔记
---

## 简介

对比朴素枚举，KMP 的思想是当匹配出现不一样的字符时，根据模式串当前子串的最大相同前后缀，将模式串的指针回退到最大相同前缀的末尾而非模式串的开头，从而优化时间复杂度。

记录子串最大相同前后缀长度的数组为 $next_i$。下图展示了 $next_i$ 的求解过程。

<!--more-->

![](https://upload-images.jianshu.io/upload_images/11023579-8e5da803cfa21d91.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

## Code

[模板传送门](https://www.luogu.com.cn/problem/P3375)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 10;

string s, t;
int lens, lent, nxt[N];

void getNext()
{
	for (int i = 1, j = 0; i < lent; i++) {
		while (j > 0 && t[i] != t[j])
			j = nxt[j - 1];
		if (t[j] == t[i]) ++j;
		nxt[i] = j;
	}
}

void KMP()
{
	int j = 0;
	for (int i = 0; i < lens; i++) {
		while (j > 0 && s[i] != t[j])
			j = nxt[j - 1];
		if (s[i] == t[j]) j++;
		if (j == lent) {
			printf("%d\n", i - lent + 2);
			j = nxt[j - 1];
		}
	}
}

int main()
{
	cin >> s >> t;
	lens = s.size(); lent = t.size();
	getNext();
	KMP();
	for (int i = 0; i < lent; i++)
		printf("%d ", nxt[i]);
	return 0;
} 
```

