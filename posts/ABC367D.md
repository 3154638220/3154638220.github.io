---
title: ABC367D Pedometer
date: 2024-08-19 21:45:33
tags: 前缀和
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/AT_abc367_d)

## Solution

首先拆环成链，令 $a_{i+n}=a_i$。

然后求出 $a_i$ 的前缀和 $s_i$。当 $s_i\equiv s_j\pmod M$ 时，说明 $M | a_{i+1}+\cdot \cdot \cdot + a_j$。

<!--more-->

遍历 $s_i$，开桶记录属于不同余数的 $s_i$ 数量，并计算答案。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 2e5 + 10;

ll n, m, a[N << 1], sum[1000010], ans;

int main()
{
    scanf("%lld%lld", &n, &m);
    for (int i = 1; i <= n; i++) {
        scanf("%lld", &a[i]);
        a[i + n] = a[i];
    }
    sum[0]++;
    for (int i = 1; i < n * 2; i++) {
        a[i] = (a[i] +  a[i - 1]) % m;
        sum[a[i]]++;
        if (i - n >= 0)
            sum[a[i - n]]--;
        ans += sum[a[i]] - 1;
        if (i >= n) 
            sum[a[i]]--; // 防算重
    }
    printf("%lld", ans);
    return 0;
}
```

