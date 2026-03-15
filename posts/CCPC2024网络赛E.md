---
title: CCPC2024网络赛 E 随机过程
date: 2024-09-11 13:23:07
tags: 期望
categories: 题解
---

[传送门](https://codeforces.com/gym/105336)

## Solution

设最大节点数为 $M$，因为第 $i$ 层最多有 $26^i$ 个节点，所以有 $M=\sum \limits ^m_{i=0}\min \{26^i,n\}$。

<!--more-->

对于第 $i$ 层上的一个节点，一个字符串包含它的概率为 $\dfrac{1}{26^i}$。该节点不存在即为没有字符串包含它，这个事件的概率为 $(1-\dfrac{1}{26^i})^n$。因此它对答案的贡献为 $1-(1-\dfrac{1}{26^i})^n$。这一层共有 $26^i$ 个可能的节点，它们对答案的贡献即为 $(1-(1-\dfrac{1}{26^i})^n)26^i$。

所以整棵 Trie 树节点数量的期望为

$$\sum \limits ^m_{i=1}(1-(1-\dfrac{1}{26^i})^n)26^i+1$$ 

最后加上的 $1$ 为根节点。

计算 $M$ 的时候要注意，不要对 $26^i$ 直接取模，因为可能 $26^i\bmod p < n$ 导致答案出错。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll mod = 998244353;

ll n, m, sum, maxn;

ll fst(ll a, ll b)
{
    ll res = 1;
    while (b) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}

void exgcd(ll a, ll b, ll &x, ll &y)
{
    if (b == 0) {
        x = 1;
        y = 0;
        return;
    }
    exgcd(b, a % b, y, x);
    y = y - a / b * x;
}

int main()
{
    maxn = sum = 1;
    scanf("%lld%lld", &n, &m);
    ll mul = 1;
    for (int i = 1; i <= m; i++) {
        if (mul <= n) mul *= 26;
        maxn = (maxn + min(mul, n) + mod) % mod;
    }
    for (int i = 1; i <= m; i++) {
        ll inv, y, mi = fst(26, i);
        exgcd(mi, mod, inv, y);
        inv = (inv % mod + mod) % mod;
        sum = (sum + (1 - fst(1 - inv, n) + mod) % mod * fst(26, i) % mod) % mod;
    }
    printf("%lld %lld", maxn, sum);
    return 0;
}
```

