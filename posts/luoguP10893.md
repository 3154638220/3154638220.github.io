---
title: luoguP10893 城市化发展委员会
date: 2024-08-21 22:14:39
tags: 数论
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/P10893)

## Solution

设 $A_0$ 所有元素之和为 $sum$。

若 $sum \le 0$ ，答案为 $0$。

<!--more-->

若 $sum>0$，因为 $A_0$ 各项均不大于 $1$，则一定存在 $k$，使得 $A_0$ 经过 $k$ 次循环左移后，$A_0$ 是安全的，且此时可把 $A_0$ 分为 $sum$ 块，每一块的元素之和都恰好为 $1$。以样例循环左移三次后为例：

```
1 1 -1 0 | 1 1 1 -2
```

此时两部分之和分别都为 $1$。

所以对于满足 $sum>0$ 的任意 $A_0$，其实可以把它分成 $sum$ 块整体，循环左移时一块一块地捆绑在一起。这样 $A_0$ 循环左移的结果只有 $sum$ 种，且显然它们都是安全的数列。而且易证对于确定的 $A_0$，捆绑的方式只有一种，循环左移后的数列也只有 $sum$ 个是安全的。

设 $A_i$ 的长度为 $p_i$ 倍的 $A_0$，取 $p_0=1$，有

$$p_{i+1}=p_{i}^2sum$$

这个递推公式可以通过手玩得到。由它又可推出答案 

$$\dfrac{p_{i+1}}{p_i}=sum^{2^k}$$

设 $M=998244353$，因为 $k$ 最大为 $10^6$，且要对 $M$ 取模，用[扩展欧拉定理](https://oi-wiki.org/math/number-theory/fermat/#扩展欧拉定理)可得

$$\dfrac{p_{i+1}}{p_i}=sum^{2^k}=sum^{2^k\bmod {M-1}}\bmod M$$

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 1e6 + 10, mod = 998244353;

ll n, a[N], k, sum[N], ans = 0, low, cnt, len, minn[N], mini, tot;
priority_queue<int> q;

ll qpow(ll a, ll b, ll p)
{
    ll res = 1;
    while (b) {
        if (b & 1) res = res * a % p;
        a = a * a % p;
        b >>= 1;
    }
    return res;
}

int main()
{
    scanf("%lld%lld", &n, &k);
    len = 1;
    for (int i = 1; i <= n; i++) {
        scanf("%lld", &a[i]);
        sum[i] = sum[i - 1] + a[i];
    }
    if (sum[n] <= 0) {
        printf("0");
        return 0;
    }
    printf("%lld", qpow(sum[n], qpow(2, k, mod - 1), mod));
    return 0;
}
```



