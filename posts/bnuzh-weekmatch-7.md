---
title: bnuzh_weekmatch_7
date: 2025-12-12 14:21:54
tags:
---

[BNUZH-ACM 周赛 Round 7 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/295792#problems)

<!--more-->

## C 铺设能源管道

### Solution

找出大于 $n$ 的最小 $10^x$ 即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int n, ans = 1;

int main()
{
    cin >> n;
    while (ans < n)
        ans *= 10;
    cout << ans;
    return 0;
}
```

### D 优秀的拆分

### Solution

本质上是求 $n$ 的二进制转换，用位运算操作一下即可。

注意特判 $n$ 为奇数时答案为 $-1$。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int n, x = (1 << 29);

int main()
{
    cin >> n;
    if (n & 1) 
        cout << "-1";
    else {
        while (x) {
            if (n & x)
                cout << x << ' ';
            x >>= 1;
        }
    }
    return 0;
}
```

## E 报数游戏

### Solution

打表发现第 $2n$ 个数为 $24n$。答案为 $24 \times 101210121012$。

## F 植树节

### Solution 

差分模板题。定义 $x_i$ 的差分数组为 $y_i$，满足 $y_i=x_i-x_{i-1}$。显然  **$x_i$ 和 $y_i$ 是相互一一确定的**。维护 $y_i$ 就等于维护 $x_i$。

对 $x$ 的 $[l,r]$ 区间内的每个元素加一，在 $y_i$ 中相当于 $y_{l}=y_{l}+1$ 和 $y_{r+1}=y_{r+1}-1$。将原本在 $x_i$ 上 $O(r-l+1)$ 的操作放在 $y_i$ 上，就变成了 $O(1)$ 的操作。

最后由 $x_i=x_{i-1}+y_i$，$O(n)$ 求出 $x_i$ 即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e6 + 10;

int n, x[N], ans;

int main()
{
    cin >> n;
    while (n--) {
        int l, r;
        cin >> l >> r;
        x[l]++;
        x[r + 1]--;
    }
    ans = x[0];
    for (int i = 1; i <= 1e6; i++) {
        x[i] += x[i - 1];
        ans = max(ans, x[i]);
    }
    cout << ans << endl;
    return 0;
}
```

## F 多边形

### Solution

注意到数据范围 $n\le 5000$，考虑 $O(n^2)$ 的 dp。

对木棍长度排序，然后枚举木棍 $i$。

设 $f_x$ 表示 长度和为 $x$ 的木棍集合有多少种。将 $x<l_i$ 的所有 $f_x$ 相加，即为以木棍 $i$ 为最长木棍时，多边形的方案数。

转移方程为

$$f_{x+l_i} = f_{x+l_i} + f_{x}$$

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int mod = 998244353;

int n, maxn, ans;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    sort(a.begin(), a.end());
    maxn = a[n];
    vector<int> f(maxn + 10, 0);
    f[0] = 1;
    for (int i = 1; i <= n; i++) {
        if (i >= 3)
            for (int j = a[i] + 1; j <= maxn + 1; j++)
                ans = (ans + f[j]) % mod;
        for (int j = maxn + 1; j >= 0; j--) {
            if (!f[j]) continue;
            if (j + a[i] <= maxn)
                f[j + a[i]] = (f[j + a[i]] + f[j]) % mod;
            else
                f[maxn + 1] = (f[maxn + 1] + f[j]) % mod;
        }
    }
    cout << ans << endl;
    return 0;
}
```

