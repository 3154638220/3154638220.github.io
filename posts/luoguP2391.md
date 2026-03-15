---
title: luoguP2391 白雪皑皑
date: 2024-09-02 17:01:19
tags: 链表
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/P2391)

## Solution

倒序染色使得每个点被染色后，可从序列中删去。使用单向链表，设 $nxt_i$ 为点 $i$ 在链表中指向的下一个点。设当前染色区间为 $[L,R]$，点 $i$ 染色结束后，令 $nxt_i=nxt_R$。

<!--more-->

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e6 + 10;

int n, m, p, q, nxt[N], a[N], b[N], cnt;

int main()
{
    scanf("%d%d%d%d", &n, &m, &p, &q);
    cnt = n;
    for (int i = 0; i <= n; i++)
        nxt[i] = i + 1;
    while (m && cnt > 0) {
        int l = (m * p + q) % n + 1, r = (m * q + p) % n + 1;
        m--;
        if (l > r)
            swap(l, r);
        while (l <= r) {
            int nnn = nxt[l];
            if (!b[l]) {
                a[l] = m + 1;
                b[l] = 1;
                nxt[l] = nxt[r];
            }
            l = nnn;
        }
    }
    for (int i = 1; i <= n; i++)
        printf("%d\n", a[i]);
    return 0;
}
```

