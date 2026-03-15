---
title: 2025 bnuzh 周赛-3
date: 2025-11-13 18:34:09
tags:
password:
---

[BNUZH-ACM 周赛 Round 3 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/289012#problems)

<!--more-->

## A Profit S

### Solution

变量 $s$ 从左到右累加 $P_i$，当 $s<0$ 时，果断抛弃之前的和，赋值 $s=0$，重新累加。

$s$ 计算过程中出现过的最大值即为答案。 

正确性显然，时间复杂度 $O(n)$。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e5 + 10;
int n, x, ans, sum;

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> x;
        if (sum < 0) 
            sum = 0;
        sum += x;
        ans = max(sum, ans);
    }
    cout << ans << endl;
    return 0;
}
```

## B 园艺

### Solution

由于合法子序列相邻元素的间隔是一样的，故枚举可能的间隔和起点，遍历该子序列，使用和 A 题一样的方法可得到最大的答案。

时间复杂度 $O(n^2)$

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 5005;
int n, a[N], f[N], ans, sum;

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int k = 1; k <= n; k++) {
        for (int st = 1; st <= k; st++) {
            sum = 1;
            for (int i = st + k; i <= n; i += k) {
                if (a[i] > a[i - k]) {
                    ++sum;
                    ans = max(ans, sum);
                } else
                    sum = 1;
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```

## C 火车运输

### Solution

01 背包问题的一种拓展，理解 01 背包后本题可秒。

$f_{i,j}$ 表示车厢 1 容量为 $i$，车厢 2 容量为 $j$ 时，总的最大载重。

转移方程类似 01 背包，参考代码。

答案为 $f_{A,B}$，时间复杂度 $O(nm^2)$。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 205, M = 1005;
int n, A, B, a[N], f[M][M];

int main()
{
    cin >> n >> A >> B;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 1; i <= n; i++) {
        for (int j = A; j >= 0; j--) {
            for (int k = B; k >= 0; k--) {
                if (a[i] <= j)
                    f[j][k] = max(f[j - a[i]][k] + a[i], f[j][k]);
                if (a[i] <= k)
                    f[j][k] = max(f[j][k - a[i]] + a[i], f[j][k]);
            }
        }
    }
    cout << f[A][B] << endl;
    return 0;
}
```

## D 纪念品

### Solution

注意到连续 $n$ 天持有一件物品，相当于在这期间内每天卖出后立即买入。因此不妨假设每一天开始时，手上的所有物品都按照今天的价格卖出。

我们将一件纪念品第 $n$ 和 $n+1$ 两天的价格差视为第 $n$ 天纪念品的价值。对今天的纪念品计算完全背包，容量是手上的钱。可得到明天开始时手上最多有多少钱。

做 $T$ 次完全背包即可得到答案，时间复杂度 $O(TNM)$。

### Code

```cpp
#include <bits/stdc++.h>
#define N 105
#define M 10010
#define rei register int
using namespace std;
int t, n, m, a[N][N], c[N], w, f[M], ans;
int main()
{
	scanf("%d%d%d", &t, &n, &m);
	for (rei i = 1; i <= t; i++) 
		for (rei j = 1; j <= n; j++)
			scanf("%d", &a[i][j]);
	for (rei i = 1; i < t; i++) {
		memset(f, 0, sizeof(f));
		for (rei j = 1; j <= n; j++) {
			c[j] = a[i + 1][j] - a[i][j];
			w = a[i][j];
			if (w < 0) continue;
			for (rei k = w; k <= m; k++)
				f[k] = max(f[k], f[k - w] + c[j]);
		}
		m += f[m]; // 每件物品强制卖出
	}
	printf("%d\n", m);
	return 0;
}
```

## E 异或和

### Solution

异或和存在前缀和的性质。设 $S_{1,n} = \bigoplus_{i=1}^{n} a_i$，$l\le k$，有

$$S_{l,k}=S_{1,k}\oplus S_{1,l-1}$$

若 $[j,i]$ 是一个合法区间（满足 $S_{j,i}=k$），则有

$$k=S_{j,i}=S_{1,j-1}\oplus S_{1,i}$$

由异或运算的性质，移项得

$$S_{1,j-1}=k\oplus S_{1,i} \tag{1}$$

换言之，对于任意的 $i$，若存在 $j<i$ 满足 $(1)$ 式，则 $[j,i]$ 为合法区间。

设 $f_i$ 表示区间 $[1,i]$ 最多能选出多少个子区间满足题意，转移方程为

$$f_i=max\{f_{i-1},f_{j-1}+1\}$$

$f_i$ 是随 $i$ 递增的，所以只要选出满足 $(1)$ 式的最大 $j$ 即可。可以开桶存 $S$ 的值，做到 $O(1)$ 查询。代码中 $mp_x$ 存的是使得 $S_{1,i}=x$ 的最大 $i$。

时间复杂度 $O(n)$。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 2e6 + 10;
int f[N], n, k, x, p, a[N], sum[N], ans, mp[N];

int main()
{
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; i++) {
        scanf("%d", &a[i]);
        sum[i] = sum[i - 1] ^ a[i];
        f[i] = f[i - 1];
        if (mp[sum[i] ^ k] || !(sum[i] ^ k))
            f[i] = max(f[i], f[mp[sum[i] ^ k]] + 1);
        mp[sum[i]] = i;
        ans = max(ans, f[i]);
    }
    printf("%d", ans);
    return 0;
}
```

## F 松散子序列

### Solution

$f_i$ 表示 $[1,i]$ 中的合法子序列种类。朴素的想法是，新增的子序列种类数量为 $f_{i-k-1}+1$（$1$ 为单独一个 $s_i$），转移方程为

$$f_i=f_{i-1}+(f_{i-k-1}+1)$$

但是这样会算重。比如样例 `aabb` 在 $i=3$ 时已经计算了 `ab`，在 $i=4$ 时会把 `ab` 再次考虑进答案。

注意到，只要 $s_i$ 这个字符之前已经出现过，就会出现算重的情况。所以我们设一个用于去重的数组 $g_x$，表示当前有多少个以字符 $x$ 结尾的合法子序列。为了不将它们重复计算，每次计算 $f_i$ 时都要减去一个 $g_{s_i}$。得到转移方程

$$f_i=f_{i-1}+(f_{i-k-1}+1)-g_{s_i}$$

$$g_{s_i}=g_{s_i}+(f_i-f_{i-1})$$

答案为 $f_n$，时间复杂度 $O(n)$。

### Code

```C++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll mod = 998244353, N = 1e6 + 10;

ll T, n, f[N], k, g[28];
char s[N];

void solve()
{
    cin >> n >> k;
    scanf("%s", s + 1);
    memset(g, 0, sizeof(g));
    for (int i = 0; i <= n; i++)
        f[i] = 0;
    for (int i = 1; i <= min(n, k + 1); i++) {
        f[i] = (f[i - 1] + 1 - g[s[i] - 'a'] + mod) % mod;
        g[s[i] - 'a'] = (g[s[i] - 'a'] + f[i] - f[i - 1] + mod) % mod;
    }
    for (int i = k + 2; i <= n; i++) {
        f[i] = (f[i - 1] + f[i - k - 1] + 1 - g[s[i] - 'a'] + mod) % mod;
        g[s[i] - 'a'] = (g[s[i] - 'a'] + f[i] - f[i - 1] + mod) % mod;
    }
    cout << f[n] << endl;
}

int main()
{
    cin >> T;
    while (T--) solve();
    return 0;
}
```

