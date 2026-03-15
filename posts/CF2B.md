---
title: CF2B The least round way
date: 2024-09-02 15:22:24
tags: dp
categories: 题解
---

[传送门](https://www.luogu.com.cn/problem/CF2B)

## Solution

每个 $10$ 都是由一对 $2$、$5$ 相乘而得。设 $F_{i,j,0}$ 为点 $(1,1)$ 到 $(i,j)$ 路上最少 $2$ 的数量，$F_{i,j,1}$ 为最少 $5$ 的数量。答案即为 $ans=\min\{F_{n,n,0},F_{n,n,1}\}$。

<!--more-->

注意若 $ans>1$ 且方阵中有 $0$，则特判将答案改为经过这个 $0$ 的路径，$ans$ 改为 $1$。

dp 求出 $F$，在 dp 过程中记录当前点由上或下转移而来，最后通过递归输出路径。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 1005;

ll n, a[N][N], f[N][N][2], flg, ans = 1e16, zx, zy;
char c[N][N][2];

void print(ll x, ll y, ll k)
{
    if (x == y && x == 1) 
        return;
    if (c[x][y][k] == 'R')
        print(x, y - 1, k);
    else
        print(x - 1, y, k);
    putchar(c[x][y][k]);
}

int main()
{
    scanf("%lld", &n);
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) {
            scanf("%lld", &a[i][j]);
            if (a[i][j] == 0) {
                f[i][j][0] = f[i][j][1] = -1;
                zx = i; zy = j;
                flg = 1;
                continue;
            }
            ll num = a[i][j];
            while (num % 2 == 0) {
                f[i][j][0]++;
                num >>= 1;
            }
            while (num % 5 == 0) {
                f[i][j][1]++;
                num /= 5;
            }
            
        }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i == j && i == 1 || f[i][j][0] == f[i][j][1] && f[i][j][0] == -1) continue;
            if (i > 1 && f[i - 1][j][0] == -1 || i == 1) {
                if (j > 1 && f[i][j - 1][0] == -1 || j == 1) {
                    f[i][j][0] = f[i][j][1] = -1;
                    continue;
                } else if (j > 1) {
                    f[i][j][0] += f[i][j - 1][0];
                    f[i][j][1] += f[i][j - 1][1];
                    c[i][j][0] = c[i][j][1] = 'R';
                }
                continue;
            }
            if (j == 1 || j > 1 && f[i][j - 1][0] == -1) {
                if (i == 1 || i > 1 && f[i - 1][j][0] == -1) {
                    f[i][j][0] = f[i][j][1] = -1;
                    continue;
                } else if (i > 1) {
                    f[i][j][0] += f[i - 1][j][0];
                    f[i][j][1] += f[i - 1][j][1];
                    c[i][j][0] = c[i][j][1] = 'D';
                }
                continue;
            }
            if (f[i - 1][j][0] >= f[i][j - 1][0]) {
                f[i][j][0] += f[i][j - 1][0];
                c[i][j][0] = 'R';
            } else {
                f[i][j][0] += f[i - 1][j][0];
                c[i][j][0] = 'D';
            }
            if (f[i - 1][j][1] >= f[i][j - 1][1]) {
                f[i][j][1] += f[i][j - 1][1];
                c[i][j][1] = 'R';
            } else {
                f[i][j][1] += f[i - 1][j][1];
                c[i][j][1] = 'D';
            }
        }
    }
    if (f[n][n][0] != -1)
        ans = min(ans, f[n][n][0]);
    if (f[n][n][1] != -1)
        ans = min(ans, f[n][n][1]);
    if (ans > 1 && flg) {
        printf("1\n");
        for (int i = 1; i < zx; i++)
            putchar('D');
        for (int i = 1; i < zy; i++)
            putchar('R');
        for (int i = zx; i < n; i++)
            putchar('D');
        for (int i = zy; i < n; i++)
            putchar('R');
    } else if (ans == 1e16) {
        printf("1\n");
        for (int i = 1; i < n; i++)
            putchar('D');
        for (int i = 1; i < n; i++)
            putchar('R');
    } else {
        printf("%lld\n", ans);
        if (f[n][n][0] <= f[n][n][1])
            print(n, n, 0);
        else
            print(n, n, 1);
    }
    return 0;
}
```

