---
title: USACO2.3 最长前缀 Longest Prefix
date: 2024-06-23 15:58:44
tags: [KMP,字符串,dp]
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/P1470)

逐个对集合 $P$ 中的字符串进行 KMP ，得出其在串 $S$ 中的所有覆盖区间。问题转换成如何选取相互无重合部分的区间，以 $S$ 串的左端点为起点，能覆盖最大的连续区域。

对区间以左端点为关键字，从小到大进行排序。定义数组 $b_i$ 记录点 $i$ 的左侧是否已被全部无重合地覆盖。枚举区间，若区间左端点的左边已全部覆盖，即 $b_l = 1$，则该区间可选取，使 $b_{r+1} = 1$。同时更新答案 $ans = r$。

<!--more-->

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2000010; 

string t[N], s, str;
int nxt[N], cnt, b[N], tot, ans = -1;
struct Node {
	int l, r;
	friend bool operator < (const Node &a, const Node &b) {
		return a.l < b.l;
	}
} a[N];

int main()
{
	freopen("c.txt", "r", stdin);
	while (1) {
		cin >> str;
		if (str == ".") break;
		t[++tot] = str;
	}
	while (cin >> str) {
		s = s + str;
	}
	for (int i = 1; i <= tot; i++) {
		memset(nxt, 0, sizeof(nxt));
		for (int j = 1, k = 0; j < t[i].size(); j++) {
			while (k > 0 && t[i][k] != t[i][j])
				k = nxt[k - 1];
			if (t[i][k] == t[i][j]) ++k;
			nxt[j] = k;
		}
		for (int j = 0, k = 0; j < s.size(); j++) {
			while (k > 0 && s[j] != t[i][k])
				k = nxt[k - 1];
			if (s[j] == t[i][k]) k++;
			if (k == t[i].size()) {
				a[++cnt] = (Node){j - t[i].size() + 1, j};
				k = nxt[k - 1];
			}
		}
	}
	sort(a + 1, a + 1 + cnt);
	b[0] = 1;
	for (int i = 1; i <= cnt; i++) {
		if (!b[a[i].l]) continue;
		b[a[i].r + 1] = 1;
		ans = max(ans, a[i].r);
	}
	printf("%d", ans + 1);
	return 0;
}
```

