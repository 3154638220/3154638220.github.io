---
title: ABC367F Rearrange Query
date: 2024-08-20 20:21:50
tags: 随机化
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/AT_abc367_f)

## Solution

用 `mt19937` 重新给 $1\sim 2\times 10^5$ 随机赋权为 $1\sim 10^9+7$ 中的一个数，然后判断两个区间内的元素之和是否相等即可。区间和保证在 `long long` 范围内。

<!--more-->

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 2e5 + 10, mod = 1e9 + 7;

ll n, q, a[N], b[N], mp[N], suma[N], sumb[N];

int main()
{
    mt19937 gen(time(0)); // 以系统时间为随机种子
    for (int i = 1; i <= 2e5; i++)
        if (!mp[i])
            mp[i] = gen() % mod;
    scanf("%lld%lld", &n, &q);
    for (int i = 1; i <= n; i++) {
        scanf("%lld", &a[i]);
        a[i] = mp[a[i]];
        suma[i] = suma[i - 1] + a[i];
    }
    for (int i = 1; i <= n; i++) {
        scanf("%lld", &b[i]);
        b[i] = mp[b[i]];
        sumb[i] = sumb[i - 1] + b[i];
    }
    while (q--) {
        ll l, r, L, R;
        scanf("%lld%lld%lld%lld", &l, &r, &L, &R);
        if (suma[r] - suma[l - 1] == sumb[R] - sumb[L - 1] && r - l == R - L)
            printf("Yes\n");
        else
            printf("No\n");
    }
    return 0;
}
```



