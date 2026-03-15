---
title: CCPC2024网络赛 D 编码器-解码器
date: 2024-09-09 17:01:19
tags: [dp,区间dp]
categories: 题解
---

[传送门](https://codeforces.com/gym/105336)

## Solution

注意到  $S'_n$ 由左右两个相同的 $S'_{n-1}$ 夹着一个新字符 $S_n$ 拼接而来。所以可以尝试从 $S'_{n-1}$ 的答案转移得到 $S'_n$ 的答案。

<!--more-->

设 $F_{i,l,r}$ 表示 $T$ 的 $[l,r]$ 以子序列形式在 $S'_{i}$ 中出现的次数，并初始化为 $0$。首先考虑到 $S'_{i}$ 中含有两个 $S'_{i-1}$，因此枚举所有区间把 $2F_{i-1,l,r}$ 加到 $F_{i,l,r}$ 中。接下来继续枚举所有区间，转移过程分类讨论：

1. $T$ 的 $[l,r]$ 中不含 $S_i$。此时枚举区间断点 $k$，有 

   $$F_{i,l,r}=\sum \limits _{k\in [l,r)} F_{i-1, l,k}F_{i-1,k+1,r}$$

2. $T$ 的 $[l,r]$ 中不含 $S_i$。此时枚举区间断点 $k$，表示 $T_k=S_i$。有 

   $$F_{i,l,r}=\sum \limits _{k\in (l,r)} F_{i-1, l,k-1}F_{i-1,k+1,r}$$ 

   $k=l$ 或 $k=r$ 的情况需要特判讨论。

答案即为 $F_{|S|,1,|T|}$。时间复杂度 $O(|S||T|^3)$。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 105, mod = 998244353;

ll f[N][N][N], n, m, maxl;
char s[N], t[N];

int main()
{
    scanf("%s%s", s + 1, t + 1);
    n = strlen(s + 1); m = strlen(t + 1);
    maxl = 1;
    for (int i = 1; i <= n; i++) {
        ll len = min(m, maxl);
        if (maxl <= m)
            maxl = maxl * 2 + 1;
        for (int l = 1; l <= m; l++) {
            for (int r = l; r <= min(l + len - 1, m); r++) {
                f[i][l][r] = (f[i - 1][l][r] << 1) % mod;
                for (int k = l; k <= r; k++) {
                    if (k < r)
                        f[i][l][r] = (f[i][l][r] + f[i - 1][l][k] * f[i - 1][k + 1][r] % mod) % mod;
                    if (t[k] != s[i]) continue;
                    ll mul = 1;
                    if (k > l)
                        mul = (mul * f[i - 1][l][k - 1]) % mod;
                    if (k < r)
                        mul = (mul * f[i - 1][k + 1][r]) % mod;
                    f[i][l][r] = (f[i][l][r] + mul) % mod;
                }
            }
        }
    }
    printf("%lld", f[n][1][m]);
    return 0;
}
```

