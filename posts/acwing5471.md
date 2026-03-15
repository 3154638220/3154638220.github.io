---
title: 【CSP 202312】树上搜索
date: 2024-08-10 16:04:15
tags: [set,二分]
categories: 题解
---

[传送门](https://www.acwing.com/problem/content/5420/)

## Solution

### 朴素算法

遍历所有点来选择询问点，每次删点后，暴力更新每个点的 $w_{\delta}$。

时间复杂度 $O(mn^2)$，可通过 CCF 原数据。

<!--more-->

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 5010;

ll n, Q, a[N], tot, fa[N], sum[N], TOT, tag[N], b[N], rt, kk, isf[N], pre, lstu;
vector<ll> g[N];

void dfs(ll u) 
{
	sum[u] = a[u];
	for (ll v : g[u]) {
		dfs(v);
		sum[u] += sum[v];
	}
}

void del(ll u, ll rt)
{
	if (u == rt) return;
	b[u] = 1;
	for (ll v : g[u])
		del(v, rt);
}

int main()
{
	scanf("%lld%lld", &n, &Q);
	for (int i = 1; i <= n; i++) {
		scanf("%lld", &a[i]);
		TOT += a[i];
	} 
	for (int i = 2; i <= n; i++) {
		scanf("%lld", &fa[i]);
		g[fa[i]].push_back(i);
	}
	dfs(1);
	for (int k = 1; k <= Q; k++) {
		lstu = 0;
		rt = 1;
		tot = TOT;
		scanf("%lld", &kk);
		memset(b, 0, sizeof(b));
		memset(tag, 0, sizeof(tag));
		memset(isf, 0, sizeof(isf));
		pre = kk;
		while (pre) {
			isf[pre] = 1;
			pre = fa[pre];
		} 
		while (1) {
			ll minn = 1e16, u = 1, cnt = 0;
			for (int i = 1; i <= n; i++) {
				if (b[i]) continue;
				++cnt;
				if (minn > abs(tot - (sum[i] - tag[i]) - (sum[i] - tag[i]))) {
					minn = abs(tot - (sum[i] - tag[i]) - (sum[i] - tag[i]));
					u = i;
				}
			}
			if (lstu == u || cnt <= 1) break;
			printf("%lld ", u);
			lstu = u;
			if (isf[u]) {
				del(rt, u);
				rt = u;
				tot -= tot - (sum[u] - tag[u]);
			} else {
				if (u == kk) break;
				del(u, 0);
				tot -= sum[u] - tag[u];
				pre = fa[u];
				while (pre) {
					tag[pre] += sum[u] - tag[u];
					pre = fa[pre];
				}
			}
		}
		putchar('\n');
	}
	return 0;
}
```

### AC算法

设所有点的权值和为 $tot$，以点 $i$ 为根的子树权值和为 $w_i$，用 `set` 维护所有点的 $2w_i$。

选择询问点时，用 `lower_bound` 找出 $2w_i$ 最接近 $tot$ 的前后两个 $i_1$、$i_2$，并比较 $tot-2w_i$ 的大小即可。

删除一个子树，则将该子树根的所有祖先在 `set` 中的值逐个更新。当树退化为链状时，复杂度最坏为 $O(mn^2\log n)$。但是因为 $w_i\le 10^7$，所以不可能在大数据下出现 $n$ 个点全为询问点，且它们组成链的情况。

被删除的部分要在 `set` 中逐个清除。

时间复杂度为 $O(mn\log n \log w)$。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 5010;

ll n, Q, a[N], tot, fa[N], sum[N], TOT, rt, kk, isf[N], pre, w[N];
vector<ll> g[N];
set<pair<ll, ll> > s;

void dfs(ll u) 
{
	sum[u] = a[u];
	for (ll v : g[u]) {
		dfs(v);
		sum[u] += sum[v];
	}
}

void del(ll u, ll rt)
{
	if (u == rt) return;
	s.erase(make_pair(w[u], u));
	for (ll v : g[u])
		del(v, rt);
		
}

ll find()
{
	ll wa, ua, wb, ub;
	auto res = s.lower_bound(make_pair(tot, 0));
	wa = (*res).first; ua = (*res).second;
	res--;
	res = s.lower_bound(make_pair((*res).first, 0));
	wb = (*res).first; ub = (*res).second; 
	if (abs(tot - wa) < abs(tot - wb))
		return ua;
	else if (abs(tot - wa) > abs(tot - wb))
		return ub;
	else
		return min(ua, ub);
}

int main()
{
	scanf("%lld%lld", &n, &Q);
	for (int i = 1; i <= n; i++) {
		scanf("%lld", &a[i]);
		TOT += a[i];
	} 
	for (int i = 2; i <= n; i++) {
		scanf("%lld", &fa[i]);
		g[fa[i]].push_back(i);
	}
	dfs(1);
	for (int k = 1; k <= Q; k++) {
		rt = 1;
		tot = TOT;
		scanf("%lld", &kk);
		memset(isf, 0, sizeof(isf));
		pre = kk;
		while (pre) {
			isf[pre] = 1;
			pre = fa[pre];
		} 
		s.clear();
		for (int i = 1; i <= n; i++) {
			w[i] = sum[i] * 2;
			s.insert(make_pair(w[i], i));
		}
		while (s.size() > 1) {
			ll u = find();
			printf("%lld ", u);
			if (isf[u]) {
				tot = w[u] / 2;
				del(rt, u);
				rt = u;
			} else {
				tot -= w[u] / 2;
				del(u, 0);
				pre = fa[u];
				while (pre) {
					if (s.erase(make_pair(w[pre], pre)) == 0)
						break;
					w[pre] -= w[u];
					s.insert(make_pair(w[pre], pre));
					pre = fa[pre];
				}
			}
		} 
		putchar('\n');
	}
	return 0;
}
```

