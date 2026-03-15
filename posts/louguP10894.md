---
title: luoguP10894 虚树
date: 2024-08-22 18:02:47
tags: [dp,exgcd]
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/P10894)

## Solution

树上 dp，设 $f_u$ 为以 $u$ 为根的子树中好的非空子集数量。若 $u$ 为叶节点， 则  $f_u=1$。下面假设 $u$ 非叶节点，$v$ 为 $u$ 的子节点：

<!--more-->

1. 点集取 $u$，则 $u$ 的子树可任意取，根据乘法原理，贡献为 $\prod (f_v+1)$。
2. 点集不取 $u$，则只能取 $u$ 的一棵子树，根据加法原理，贡献为 $\sum f_v$。

由于 $f_v$ 保证 $v$ 子树非空，因此情况一中贡献多出来的 $1$，为整棵 $v$ 子树不取的情况。由此

$$f_u=\prod (f_v+1)+\sum f_v$$

根据这个式子，若 $v_0$ 是 $u$ 的其中一个子节点且 $f_{v_0}$ 减少 $k$，则 $f_u$ 减少

$$k(1+\dfrac{\prod (f_v+1)}{f_{v_0}+1})$$

并设其为 $g_{v_0}$。现在假设 $f_u$ 减少 $k$，则 $f_1$ 的减少值为 $kg_1\cdot \cdot \cdot g_u$。又设 $d_u$ 为 $1\sim u$ 这条链上所有 $g_i$ 的前缀积，则删去子树 $u$ 的答案为

$$f_1-d_uf_u$$

所以先用第一遍 dfs 求出 $f_i$、$g_i$，再用第二遍 dfs 求出 $d_i$。

注意求 $g_i$ 的时候，不能直接除，需要用 [exgcd](https://www.qianianxy.cn/2024/08/13/二元一次不定方程/) 求乘法逆元。

时间复杂度 $O(n)$

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 5e5 + 10, mod = 998244353;

ll n, q, d[N], f[N], fa[N];
vector<ll> g[N];

void exgcd(ll a, ll b, ll &x, ll &y)
{
    if (b == 0) {
        x = 1; y = 0;
        return;
    }
    exgcd(b, a % b, y, x);
    y = y - a / b * x;
}

void dfs1(ll u, ll pre)
{
    ll mul = 1, sum = 0;
    fa[u] = pre;
    for (ll v : g[u]) {
        if (v == pre) 
            continue;
        dfs1(v, u);
        sum = (sum + f[v] + mod) % mod;
        mul = (mul * (f[v] + 1) % mod + mod) % mod;
    }
    f[u] = (sum + mul + mod) % mod;
    for (ll v : g[u]) {
        if (v == pre)
            continue;
        ll inv, y;
        exgcd(f[v] + 1, mod, inv, y);
        d[v] = (mul * inv % mod + 1 + mod) % mod;
    }
}

void dfs2(ll u)
{
    d[u] = (d[u] * d[fa[u]] % mod + mod) % mod;
    for (ll v : g[u]) {
        if (v == fa[u]) 
            continue;
        dfs2(v);
    }
}

int main()
{
    scanf("%lld", &n);
    for (int i = 1; i < n; i++) {
        ll u, v;
        scanf("%lld%lld", &u, &v);
        g[u].push_back(v);
        g[v].push_back(u);
    }
    dfs1(1, 0);
    d[0] = d[1] = 1;
    dfs2(1);
    scanf("%lld", &q);
    while (q--) {
        ll x;
        scanf("%lld", &x);
        printf("%lld\n", (f[1] - f[x] * d[x] % mod + mod) % mod);
    }
    return 0;
}
```

