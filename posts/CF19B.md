---
title: CF19B Checkout Assistant
date: 2024-08-25 17:17:14
tags: dp
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/CF19B)

## Solution

若设 $F_a$ 为选择付款的商品的 $t_i$ 之和为 $a$ 时，支付的最小金额，$k$ 为这些商品的数量。那么只有 $a\ge n-k$ 时，$F_a$ 才为一种合法的答案。

<!--more-->

但是在 dp 过程中，我们无法把 $a$ 和 $k$ 一起维护。所以选择把上式中的 $k$ 移至左边，启发我们把 $F_a$ 的定义改为选择付款的商品的 $t_i+1$ 之和为 $a$ 时，支付的最小金额。这样一来，当 $a\ge n$ 时，$F_a$ 为一种合法的答案。

用 01 背包求解所有的 $F_a$，答案即为满足 $a\ge n$ 的最小 $F_a$。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 1e5 + 10;

ll n, t[N], c[N], f[N], T, tot, W, ans = 1e16;

int main()
{
    scanf("%lld", &n);
    memset(f, 0x3f, sizeof(f));
    f[0] = 0;
    for (int i = 1; i <= n; i++) {
        scanf("%lld%lld", &t[i], &c[i]);
        t[i]++;
        T = max(t[i], T);
    }
    T += n;
    for (int i = 1; i <= n; i++) 
        for (int j = T; j >= t[i]; j--)
            f[j] = min(f[j], f[j - t[i]] + c[i]);
    for (int i = n; i <= T; i++)
        ans = min(ans, f[i]);
    printf("%lld", ans);
    return 0;
}
```

