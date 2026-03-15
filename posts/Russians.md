---
title: Method of Four Russians
date: 2024-05-05 17:39:15
tags: [笛卡尔树, st表, RMQ]
categories: 笔记
---

## 前置知识

- [笛卡尔树](http://qianianxy.cn/2024/05/05/%E7%AC%9B%E5%8D%A1%E5%B0%94%E6%A0%91/)

- [ST表](https://www.luogu.com.cn/problem/P3865)

- 分块思想

- 状态压缩

  <!--more-->

## 简介

原名 ``the Method of Four Russians``，可在 $O(n+m)$ 时间内解决 ``RMQ`` 问题。

其实质为对原序列建立笛卡尔树，转变为求两点间 ``LCA``。

根据 ``Euler`` 序的特性，可以使用状压，ST 表等奇淫技巧，转化为一种称为 ``+1-1RMQ`` 的算法。

没理解没关系，反正这几句话一点用没有。

## 名词解释

### Euler 序

> 即树按照 DFS 过程，经过所有点，环游回根的序列。

以下图（一棵笛卡尔树）为例

![](https://cdn.jsdelivr.net/gh/3154638220/wocaonima@main/202405051740873.png)

根据定义，从根结点 $1$ 出发，**环游**所有点，回根的序列为：

```
1 3 9 3 7 3 1 5 8 10 12 10 15 20 15 18 15 10 8 5 1
```

此序列即为该树的 `Euler` 序，可手动模拟理解。

### +1-1RMQ

亦称约束 ``RMQ``，与普通 ``RMQ`` 相同，求一段序列的最值问题。

但其所求序列相邻元素的差值绝对值必然为 $1$。

此时对序列建立差分数组 `Dif`，可知 ``Dif`` 内只包括 $+1,-1$。

若将 $-1$ 化为 $0$，则 ``Dif`` 变为一个二进制串。

为方便状态压缩，防止表示状态的十进制数过大，对 ``Dif`` 进行分块。

设 ``Euler`` 序长度为 $t$，块大小 $b=\lceil\dfrac{\log_2t}{2}\rceil$，则块数量 $c=\lceil\dfrac{t}{b}\rceil$。


对一个块进行讨论。将块视为长为 $b$ 的，形式为二进制串的差分数组。

这个串上每一位非 $0$ 即 $1$，所以理论上可能的串共有 $2^b$ 种。

用状压方法枚举所有可能情况。对于每一种情况，都要从头到尾枚举串，求出其所代表的原数组中的最值所在位置。并将位置下标存在数组 $Pos(S)$ 中。$S$ 为状态。

举个例子，有一个序列：

```
原+1-1序列          1 2 3 4 3 2 1 2

差分且转化为二进制后 1 1 1 1 0 0 0 1

下标                 8 7 6 5 4 3 2 1
```

定义一个变量 $sum$，从头开始加上差分数组的值，便可逐位还原原序列并比较大小。

最后可求出位置 $5$ 处最大。又因该串的十进制形式为 $241$，则 $Pos(241)=5$。

此过程的时间复杂度为 $O(b2^b)$。将 $b$ 代入，复杂度为 $O(n)$ 级别。

上述过程是对**询问区间在一个块内**情况的预处理，询问时可 $O(1)$ 求解。

下面对于**询问区间跨块**的情况，就要使用 ST 表。

单独 ST 表处理 `RMQ` 问题时，以数组**一个元素**为基本单位。但是此时要做一些小改动，变为以**一个块**为基本单位。

所以我们要先暴力 $O(n)$ 求每个块的最值并储存。ST 表预处理时，直接取块最值而不用考虑块内具体情况。

ST 表预处理复杂度为 $O(c\log c)$，同样为 $O(n)$ 级别。

预处理完结撒花，接着轮到询问。

对于询问区间，采用分块思想。左右两边不完整块单独处理。中间一片连续完整块的区域用 ST 表处理。

对于询问区间两边两个不完整块，每一个都是一个完整块的部分。用位运算技巧剪出该不完整块的二进制形式，利用 $Pos$ 数组直接取出答案。复杂度 $O(1)$。

对于中间连续完整块，ST 表 $O(1)$ 查询。此处默认读者熟练 ST 表，不再赘述。

单个询问复杂度为 $O(1)$。若有 $m$ 个询问，则复杂度为 $O(m)$。

总时间复杂度为 $O(n+m)$。

## 算法分析

~~进入正题。~~最难的部分已经讲完，现在仅剩的问题是如何将 `+1-1RMQ` 与笛卡尔树结合，成为四毛子算法。

由于笛卡尔树具有堆的性质，且结点编号具有二叉查找树的性质，所以序列中区间 $[l,r]$ 的最值点，为点 $l$ 和点 $r$ 在笛卡尔树中的 `LCA`。

已知 `Euler` 序中相邻点之间深度相差必定为 $1$。所以 `Euler` 序可以使用 `+1-1RMQ` 处理。

截取从第一次到 $l$ 至第一次到 $r$ 的 `Euler` 序片段，用 `+1-1RMQ` 求出该片段中深度最浅的点，即为 `LCA`，即为区间内最值点。

时间复杂度 $O(n+m)$。

## code

代码来自于 2021 CSP-S1，经过本人马蜂调整。

强行啃懂了~~这堆屎山~~并添了点注释，可结合注释理解。

```cpp
#include <iostream>
#include <cmath>
#include <cstdio>
#define rei register int
using namespace std;

template <typename T> inline void read(T &x)
{
	x = 0; int f = 1; char ch = getchar();
	while (!isdigit(ch)) {if (ch == '-') f = -f; ch = getchar();}
	while (isdigit(ch)) {x = x * 10 + ch - 48; ch = getchar();}
	x *= f;
}

const int MAXN = 100000, MAXT = MAXN << 1;
const int MAXL = 18, MAXB = 9, MAXC = MAXT / MAXB;

struct node 
{
	int val;                         // 权值 
	int dep, dfn, end;               // 深度、深搜序、遍历完子树回来时经过的最后一个点 
	node *son[2];                    // 左右儿子 
} T[MAXN];

int n, t, b, c, Log2[MAXC + 1], m;      // 序列长度、Euler序长度、块大小、块数量，log_2预处理、询问数量 
int Pos[(1 << (MAXB - 1)) + 5], Dif[MAXC + 1]; // 状压表示不同差分状态下深度最浅点 、差分数组 
node *root, *A[MAXT], *Min[MAXL][MAXC]; // 笛卡尔树根、Euler序、ST表 

inline void build() // 建笛卡尔树 
{
	static node *S[MAXN + 1]; // 单调栈 
	int top = 0;
	for (int i = 0; i < n; i++)
	{
		node *p = &T[i];
		while (top && S[top]->val < p->val) // 大根堆
			p->son[0] = S[top--];  
		if (top) S[top]->son[1] = p;
		S[++top] = p;
	}
	root = S[1];
}

inline void DFS(node *p) // 求出Euler序 
{
	A[p->dfn = t++] = p;
	for (rei i = 0; i < 2; i++)
		if (p->son[i])
		{
			p->son[i]->dep = p->dep + 1;
			DFS(p->son[i]);
			A[t++] = p;
		}
	p->end = t - 1;
}

inline node *min(node *x, node *y) {return x->dep < y->dep ? x : y;} // 深度越小，值越大 

inline void ST_init()
{
	b = (int)(ceil(log2(t) / 2));
	c = t / b;
	Log2[1] = 0;
	for (rei i = 2; i <= c; i++) Log2[i] = Log2[i >> 1] + 1;
	for (rei i = 0; i < c; i++) // 初始化Min[0]，覆盖大小为一个块 
	{
		Min[0][i] = A[i * b];                 // 初始化为块i的第一个点 
		for (rei j = 1; j < b; j++)
			Min[0][i] = min(Min[0][i], A[i * b + j]); // 求出块内最大值 
	}
	// dp处理ST表 
	for (rei i = 1, l = 2; l <= c; i++, l <<= 1) // l: Min[i]覆盖长度（一个块长度为1） 
		for (rei j = 0; j + l <= c; j++)
			Min[i][j] = min(Min[i - 1][j], Min[i - 1][j + (l >> 1)]);
	
}

inline void small_init()
{
	for (rei i = 0; i <= c; i++) // 预处理dep差分数组 
		for (rei j = 1; j < b && i * b + j < t; j++)
			if (A[i * b + j]->dep < A[i * b + j - 1]->dep)
				Dif[i] |= 1 << (j - 1);
	for (rei S = 0; S < (1 << (b - 1)); S++) // 预处理出不同差分数组深度最浅点，S代表一种差分数组 
	{
		int mx = 0, v = 0;
		for (int i = 1; i < b; i++)
		{
			v += (S >> (i - 1) & 1) ? -1 : 1;
			if (v < mx) mx = v, Pos[S] = i;
		}
	}
}

inline node *ST_query(int l, int r) // ST表求解模板 
{
	int g = Log2[r - l + 1];
	return min(Min[g][l], Min[g][r - (1 << g) + 1]);
}

inline node *small_query(int l, int r) // 同一块内求解 
{
	int p = l / b; // 块的编号 
	// '&'的前半段：把l前的无用状态去掉。然后对二进制串1111...111做&运算，去除r后无用状态     
	int S = (Dif[p] >> (l - p * b)) & ((1 << (r - l)) - 1); // 二进制表示差分数组 
	return A[l + Pos[S]]; 
}

inline node *query(int l, int r)
{
	if (l > r) return query(r, l);
	int pl = l / b, pr = r / b; // 所属块的编号 
	if (pl == pr) return small_query(l, r); // 处于同一块内 
	else 
	{
		node *s = min(small_query(l, pl * b + b - 1), small_query(pr * b, r)); // 分别处理两个左右碎块 
		if (pl + 1 <= pr - 1) s = min(s, ST_query(pl + 1, pr - 1)); // ST表跨块求解 
		return s;
	}
}

int main()
{
	read(n); read(m);
	for (rei i = 0; i < n; i++) read(T[i].val);
	build();
	DFS(root);
	ST_init();
	small_init();
	while (m--)
	{
		int l, r;
		read(l); read(r);
		printf("%d\n", query(T[l].dfn, T[r].dfn)->val);
	}
	return 0;
}
```