---
title: ARC181C Row and Column Order
date: 2024-08-06 17:33:51
tags: 构造
categories: 题解
---

[传送门](https://atcoder.jp/contests/arc181/tasks/arc181_c)

## Solution

小清新构造题。

把每一格初始化为 $-1$，接下来进行 $n$ 次操作。第 $i$ 次操作将第 $p_i$ 行为 $-1$ 的格子全部变成 $0$，然后将第 $q_{n-i+1}$ 列为 $-1$ 的格子全部变成 $1$。

<!--more-->

对于 $i<j$，显然 $p_j$ 行相比 $p_i$ 行，$-1$ 的格子更少。少掉的格子一定是在前面的操作中被改成了 $1$。所以即使 $p_j$ 行其余所有格子直接改成 $0$，也不影响正确性。同理，$q_i$ 的顺序同样得到满足，正确性得证。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 505;

int p[N], q[N], ans[N][N], n;

int main()
{
	memset(ans, -1, sizeof(ans));
	scanf("%d", &n);
	for (int i = 1; i <= n; i++)
		scanf("%d", &p[i]);
	for (int i = 1; i <= n; i++)
		scanf("%d", &q[i]);
	for (int i = 1; i <= n; i++) {
		for (int j = 1; j <= n; j++)
			if (ans[p[i]][j] == -1)
				ans[p[i]][j] = 0;
		for (int j = 1; j <= n; j++)
			if (ans[j][q[n - i + 1]] == -1)
				ans[j][q[n - i + 1]] = 1;
	}
	for (int i = 1; i <= n; i++) {
		for (int j = 1; j <= n; j++)
			printf("%d", ans[i][j]);
		putchar('\n');
	}
	return 0;
}
```

