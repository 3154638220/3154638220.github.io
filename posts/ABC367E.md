---
title: ABC367E Permute K times
date: 2024-08-20 18:18:11
tags: 倍增
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/AT_abc367_e)

## Solution

设 $f_{i,k}$ 表示经过 $2^k$ 次操作后，位置 $i$ 上的数字为 $a_{f_{i,k}}$。初始化 $f_{i,0}=x_i$。转移方程

$$f_{i,j}=f_{f_{i,j-1},j-1}$$

<!--more-->

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 2e5 + 10, logN = 62;

ll n, k, a[N], x[N], f[N][logN + 5], t, ans[N];

int main()
{
    scanf("%lld%lld", &n, &k);
    for (int i = 1; i <= n; i++)
        scanf("%lld", &f[i][0]);
    for (int i = 1; i <= n; i++) {
        scanf("%lld", &a[i]);
        ans[i] = i;
    }
    for (int j = 1; j <= logN; j++)
        for (int i = 1; i <= n; i++)
            f[i][j] = f[f[i][j - 1]][j - 1];
    for (int i = 1; i <= n; i++) {
        t = k;
        for (int j = logN; j >= 0 && t > 0; j--) {
            if (t < (1ll << j))
                continue;
            t -= (1ll << j);
            ans[i] = f[ans[i]][j];
        }
    }
    for (int i = 1; i <= n; i++)
        printf("%lld ", a[ans[i]]);
    return 0;
}
```

