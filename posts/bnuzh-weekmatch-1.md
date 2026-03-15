---
title: 2025 bnuzh 周赛-1
date: 2025-11-02 19:13:55
tags:
---

([BNUZH-ACM 周赛 Round 1 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/282997#problems))

<!--more-->

## A 成绩分析

### Code

```c++
#include <bits/stdc++.h>
using namespace std;

double maxn, minn, sum, x, n;

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> x;
        sum += maxn;
        maxn = max(maxn, x);
        minn = min(minn, x);
    }
    printf("%d\n%d\n%.2lf", (int)maxn, (int)minn, sum / n);
    return 0;
}
```

## B 刷题统计

### Solution

注意到 $n=10^{18}$，一天一天减法计算会超时。考虑除法。

一周七天能做 $x=5a+2b$ 道题，那么至少要做 $\lfloor \frac{n}{x} \rfloor$ 周的题。

$n$ 对 $x$ 取余，得最后不完整的一周要做多少道题，容易计算最后一周要做几天题目。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll a, b, n, ans, week;

int main()
{
    cin >> a >> b >> n;
    week = 5 * a + 2 * b;
    ans = n / week * 7;
    n %= week;
    if (a * 5 >= n) 
        ans += n / a + (n % a > 0);
    else if (a * 5 + b >= n)
        ans += 6;
    else
        ans += 7;
    cout << ans << endl;
    return 0;
}
```

## C 整数变换

### Solution-1

洛谷 AC，蓝桥杯赛场上不能满分。

对于正整数 $n$，$n \bmod{10}$ 为 $n$ 的最后一位。对 $n$ 多次对 $10$ 取余并除以 $10$，即可算出 $n$ 各数位之和。

### Code

```cpp
#include<bits/stdc++.h>
using namespace std;

int n, ans;

int main()
{
    cin >> n;
    while (n && ++ans) {
        int num = n, sum = 0;
        while (num) {
            sum += num % 10;
            num /= 10;
        }
        n -= sum;
    }
    cout << ans << endl;
    return 0;
}
```

### Solution-2

赛场上 AC。

注意到每一次减去的数不会超过 $9\times 8=72$，因此 $n$ 在大多数情况下都是末几位在变动。考虑预处理。

设 $a_{i,j}$ 为一个数末四位为 $j$，其余数位之和为 $i$ 时，需要操作多少次才能让第五位变动。$b_{i,j}$ 表示一个数末四位为 $j$，其余数位之和为 $i$ 时，使得第五位变动的第一次操作后，末四位的值。

用循环暴力计算即可预处理出 $a$、$b$ 数组。

计算 $n$ 的答案时，计算它的 $i$ 和 $j$，答案加上 $a_{i,j}$，更新 $n=n/1000-1+b_{i,j}$ 即可。

相当于从几十几十地减，变成了一万一万地减。

### Code

```python
n = int(input())
a = [[0 for _ in range(105)] for _ in range(10010)]
b = [[0 for _ in range(105)] for _ in range(10010)]
ans = 0
for i in range(1, 1001):
    for j in range(0, 80):
        num, cnt = i, 0
        while num:
            res, sum = num, 0
            while res:
                sum += res % 10
                res //= 10
            num -= sum + j
            cnt += 1
            if num <= 0:
                a[i][j] = cnt
                b[i][j] = num
                break
while n:
    if n < 1000:
        ans += a[n][0]
        break
    x = n % 1000
    if x == 0:
        res, sum = n, 0
        while res:
            sum += res % 10
            res //= 10
        n -= sum
        ans += 1
        continue
    y = n // 1000
    z = 0
    while y:
        z += y % 10
        y //= 10
    ans += a[x][z]
    n = n - x + b[x][z]
print(ans)
```

