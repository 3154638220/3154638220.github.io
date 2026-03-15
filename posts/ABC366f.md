---
title: ABC366F Maximum Composition
date: 2024-08-12 11:25:33
tags: dp
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/AT_abc366_f)

## Solution

设 $f_1(x)=a_1x+b_1$，$f_2(x)=a_2x+b_2$。若 $f_1(f_2(x))<f_2(f_1(x))$，则 $a_1b_2+a_1<a_2b_1+b_2$。又因为 $b_1,b_2>0$，移项得$\dfrac{a_1-1}{b_1}<\dfrac{a_2-1}{b_2}$。

<!--more-->

因此对于选定的 $K$ 个 $f(x)$，从内到外 $\dfrac{a-1}{b}$ 应升序排列。

我们对 $N$ 个函数以 $\dfrac{a-1}{b}$ 为关键字升序排序，用 01 背包求解即可。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 2e5 + 10;

ll n, k, f[N];
struct Node {
	ll a, b;
	friend bool operator < (const Node &a, const Node &b) {
		return (a.a - 1) * b.b < (b.a - 1) * a.b;
	}
} a[N];

int main()
{
	scanf("%lld%lld", &n, &k);
	for (int i = 1; i <= n; i++)
		scanf("%lld%lld", &a[i].a, &a[i].b);
	sort(a + 1, a + 1 + n);
	f[0] = 1;
	for (int i = 1; i <= n; i++)
		for (int j = k; j; j--)
			f[j] = max(f[j], a[i].a * f[j - 1] + a[i].b);
	printf("%lld", f[k]);
	return 0;
}
```

