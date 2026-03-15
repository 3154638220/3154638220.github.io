---
title: ABC362E Count Arithmetic Subsequences
date: 2024-07-14 21:53:05
tags: dp
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/AT_abc362_e)

## Solution

设 $F_{i,len, d}$ 表示以 $a_i$ 结尾，长度为 $len$，公差为 $d$ 的等差数列数量。转移方程为

$$F_{i,len,d}=\sum\limits_{j=1}^{i-1} F_{j,len-1,d}$$

<!--more-->

其中 $j$ 要满足 $a_i-a_j=d$。

因为 $d$ 可能为负数，所以 dp 数组最后一维用 map。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 105, mod = 998244353;

ll n, a[N], ans[N];
map<ll, ll> f[N][N];

int main()
{
	scanf("%lld", &n);
	for (int i = 1; i <= n; i++) {
		scanf("%lld", &a[i]);
		for (int j = 1; j < i; j++) {
			ll d = a[i] - a[j];
			f[i][2][d] = (f[i][2][d] + 1) % mod;
		}
		for (auto &t : f[i][2])
			ans[2] = (ans[2] + t.second) % mod;
	}
	ans[1] = n;
	for (int i = 1; i <= n; i++) {
		for (int l = 3; l <= i; l++) {
			for (int j = 1; j < i; j++) {
				ll d = a[i] - a[j];
				f[i][l][d] = (f[i][l][d] + f[j][l - 1][d]) % mod;
			}
			for (auto &t : f[i][l])
				ans[l] = (ans[l] + t.second) % mod;
		}
	}
	for (int l = 1; l <= n; l++)
		printf("%lld ", ans[l]);
	return 0;
} 
```

