---
title: ARC181D Prefix Bubble Sort
date: 2024-08-06 18:29:30
tags: [树状数组,逆序对,优先队列]
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/AT_arc181_d)

## Solution

先用树状数组求逆序对，得出数组总共的逆序对数量 $tot$。设 $a_i$ 和它**前面**的数共组成 $inv_i$ 对逆序对。

手玩样例后不难理解，操作 $i$ 的本质，其实就是对所有 $j\le i$，若 $a_j$ 非零，则 $a_j-1$。设执行操作 $i$ 前有 $m$ 个 $a_j$ 非零，则执行操作后整个序列的逆序对数量减少 $m$。

<!--more-->

由于操作保证升序，所以每次操作都可以把新的非零 $a_j$ 放入优先队列，并将优先队列里的元素全部减一。当然，只用新建一个变量 $flg$ $O(1)$ 记录减的值即可。若计算得出队头为零，则弹出。$m$ 即为优先队列的规模。$tot-m$ 为当前答案。

每个 $a_i$ 最多入队出队各一次，时间复杂度为 $O(n\log n)$。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 1e6 + 10;

ll n, a[N], q, sum[N], tr[N], ans, flg;
priority_queue<ll, vector<ll>, greater<ll> > que;

ll lowbit(ll x) {return x & -x;}

void add(ll x, ll c)
{
	for (; x <= n; x += lowbit(x))
		tr[x] += c;
}

ll query(ll x)
{
	ll res = 0;
	for (; x > 0; x -= lowbit(x))
		res += tr[x];
	return res; 
}

int main()
{
	scanf("%lld", &n);
	for (ll i = 1; i <= n; i++)
		scanf("%lld", &a[i]);
	scanf("%lld", &q);
	ll p = 1;
	for (ll i = 1; i <= n; i++) {
		sum[i] = i - query(a[i]) - 1;
		ans += sum[i];
		add(a[i], 1);
	}
	while (q--) {
		++flg;
		ll x;
		scanf("%lld", &x);
		while (p <= x) {
			if (sum[p] + flg - 1 > 0 && sum[p])
				que.push(sum[p] + flg - 1);
			++p;
		}
		ans -= que.size();
		while (que.size() && que.top() <= flg)
			que.pop();
		
		printf("%lld\n", ans);
	}
	return 0;
}
```

