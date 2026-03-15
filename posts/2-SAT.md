---
title: 2-SAT
date: 2024-05-11 09:49:52
tags: [2-SAT, Tarjan]
categories: 笔记
---

## 问题描述：

有 $n$ 个 bool 变量，有$m$个条件，如 $\lfloor x_i$ 为 true/flase  或 $x_j$ 为 true/false $\rfloor$。求是否有方案能满足所有条件。构造出一组符合题意的解。

## 算法思路：

按照条件建立分层图，令 $x_i$ 为 true，$x_{i+n}$ 为 false。

<!--more-->

举个例子，设有条件 $\lfloor x_i$ 为 flase 或 $x_j$ 为 true $\rfloor$。则当 $x_i$ 为 true 时，$x_j$ 必定为 true。当 $x_j$ 为 false时，$x_i$ 必定为 false。

此时建立有向边 $x_i \rightarrow x_j$，$x_{j + n} \rightarrow x_{i+n}$。当箭头左边条件成立时，右边条件一定成立。但注意，右边条件成立时，左边条件不一定成立。这也是建立有向边而非无向边的原因。

建完所有边后，跑 Tarjan，如果发现 $x_i$ 与 $x_{i+n}$ 在同一强连通分量，即条件两两等价，此时矛盾，问题无解。

若有解，$x_i$ 与 $x_{i+n}$ 的拓扑序更大的即是 $i$ 的解。

注意 Tarjan 的 feature，代码实现中解为 $color_i$ 值更小的点。

[模板传送门](https://www.luogu.com.cn/problem/P4782)

```cpp
#include <bits/stdc++.h>
#define rei register int
#define N 4000005
using namespace std;
typedef long long LL;
typedef unsigned long long ull;

int n, m, dfn[N], low[N], cnt, co[N], st[N], top, col;
vector<int> g[N];

struct edge
{
	int v, nxt;
} e[N];

template <typename T> inline void read(T &x)
{
	x = 0; int f = 1; char ch = getchar();
	while (!isdigit(ch)) {if (ch == '-') f = -f; ch = getchar();}
	while (isdigit(ch)) {x = x * 10 + ch - 48; ch = getchar();}
	x *= f;
}

inline void Tarjan(int x)
{
	dfn[x] = low[x] = ++cnt;
	st[++top] = x;
	for (rei i = 0; i < g[x].size(); i++)
	{
		int v = g[x][i];
		if (!dfn[v])
		{
			Tarjan(v);
			low[x] = min(low[x], low[v]);
		}
		else if (!co[v])
			low[x] = min(low[x], dfn[v]);
	}
	if (low[x] == dfn[x])
	{
		co[x] = ++col;
		while (st[top] != x)
		{
			co[st[top]] = col;
			top--;
		}
		top--;
	}
}

int main()
{
	read(n); read(m);
	for (rei i = 1; i <= m; i++)
	{
		int j, a, k, b;
		read(j); read(a); read(k); read(b);
		g[j + n * (a & 1)].push_back(k + n * (b ^ 1));
		g[k + n * (b & 1)].push_back(j + n * (a ^ 1));
	}
	for (rei i = 1; i <= n * 2; i++)
		if (!dfn[i]) Tarjan(i);
	for (rei i = 1; i <= n; i++)
	{
		if (co[i] == co[i + n])
		{
			printf("IMPOSSIBLE\n");
			return 0;
		}
	}
	printf("POSSIBLE\n");
	for (rei i = 1; i <= n; i++)
	{
		int res = co[i] < co[i + n];
		printf("%d ", res);
	}
	return 0;
}
```

