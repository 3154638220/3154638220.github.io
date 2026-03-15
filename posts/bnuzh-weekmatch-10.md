---
title: bnuzh-weekmatch-10
date: 2026-02-16 10:30:19
tags:
---

[BNUZH-ACM 周赛 Round 10 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/309684)

<!--more-->

## A

### Solution

有解当且仅当四个数相同，或者分别两两相同。手造样例易得结论。

用 dfs 枚举填格子方案也能做。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int T, a[10];

void solve()
{
    for (int i = 1; i <= 4; i++)
        cin >> a[i];
    sort(a + 1, a + 1 + 4);
    if (a[1] == a[2] && a[3] == a[4])
        cout << "Yes\n";
    else
        cout << "No\n";
}

int main()
{   
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## B

### Solution

定义指针 $l$, $r$，初始分别指向字符串的头尾。

1. 当 $s_l=s_r$ 时，执行 $l+1$，$r-1$，意味着两个字符已经匹配。
2. 当 $s_l\neq s_r$ 时，此时有两种选择。$l+1$ 且 $r$ 不变，或者 $r-1$ 且 $l$ 不变。两种操作分别对应着删除 $s_l$ 或 $s_r$.

当 $l\ge r$ 时，代表着得到了回文串。

按上述规则进行搜索，记录删除操作的次数即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int ans = 4;
string s;
struct Status {
    int l, r, w;
};
queue<Status> q;

void dfs(int l, int r, int w)
{
    if (w >= ans)
        return;
    if (l >= r) {
        ans = min(ans, w);
        return;
    }
    if (s[l] == s[r])
        dfs(l + 1, r - 1, w);
    else {
        q.push((Status){l, r, w + 1});
        return;
    }
}

int main()
{
    cin >> s;
    dfs(0, s.size() - 1, 0);
    while (q.size() && q.front().w < ans) {
        Status st = q.front();
        q.pop();
        dfs(st.l + 1, st.r, st.w);
        dfs(st.l, st.r - 1, st.w);
    }
    if (ans == 4)
        cout << -1;
    else
        cout << ans;
    return 0;
}
```

## C

### Solution

用栈模拟括号匹配。遍历括号串，遇到 `(` 压入栈中，遇到 `)` 弹出栈顶。

显然，叶节点的特征是它的左右两半括号在括号序列中相邻，且它与根的距离等于它匹配成功并弹出后，栈的剩余元素个数。

### Code

注意，栈维护字符序号比维护字符本身简洁。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll ans;
string s;

int main()
{
    cin >> s;
    stack<int> st;
    for (int i = 0; i < s.size(); i++) {
        if (s[i] == '(')
            st.push(i);
        else {
            if (st.top() + 1 == i)
                ans += st.size() - 1;
            st.pop();
        }
    }
    cout << ans;
    return 0;
}
```

## D

### Solution

- 一个子串是 $4$ 的倍数，当且仅当最后两位组成的十位数是 $4$ 的倍数。

- 一个子串是 $5$ 的倍数，当且仅当末位是 $0$ 或 $5$。

因此子串是否合法与前缀无关。枚举子串的末位位置 $i$ ，只要符合上述条件，对答案的贡献就至少是前缀的数量 $i-1$。

最后特判长度为 $1$ 的子串情况即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int N = 1e6 + 10;

string s;
ll ans, a[N], tot;

int main()
{   
    cin >> s;
    for (int i = 0; i < s.size(); i++)
        a[i + 1] = s[i] - '0';
    for (int i = 1; i <= s.size(); i++) {
        ll x = a[i - 1] * 10 + a[i];
        if (x % 4 == 0 || x % 5 == 0)
            ans += i - (a[i] % 4 && a[i] % 5);
        else
            ans += !(a[i] % 4 && a[i] % 5);
    }
    cout << ans;
    return 0;
}
```

## E

### Solution

形式化题意：对给定的正整数 $n$，找最小的 $k$，使得 $n=2^k-1+p$。其中 $p$ 为素数或 $0$。

移项得 $p=n-2^k+1$。注意到 $n\le 10^5$，$k$ 不会很大。枚举 $k$ 并判断 $n-2^k+1$ 是否为素数即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int logN = 25, N = 1e5 + 10;

int T, n, isP[N], ans;

void prime()
{
    for (int i = 2; i <= 1e5; i++) {
        if (!isP[i]) {
            for (int j = i + i; j <= 1e5; j += i)
                isP[j] = 1;
        }
    }
}

void solve()
{
    cin >> n;
    ans = 1e9;
    for (int i = 1; i <= logN; i++)
        if (n == (1 << i) - 1)
            ans = i;
    for (int i = 0; i <= logN; i++) {
        int p = n - ((1 << i) - 1);
        if (p > 1 && !isP[p])
            ans = min(ans, i + 1);
    }
    if (ans == 1e9)
        cout << "-1\n";
    else
        cout << ans << '\n';
}

int main()
{
    prime();
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## F 

### Solution

数位 dp。设 $p_i$ 表示按题意去掉一种数字后，位数小于等于 $i$ 的数有多少个。由乘法原理，每一位都有 $9$ 种选择，$p_i=9^{i}$。

设 $n$ 第 $i$ 位上的数为 $a_i$。从高位到低位依次统计答案。对于第 $i$ 位，我们需要计算比 $a_i$ 小的合法数字有多少个，这些数字可以作为当前位，且其后的 $i-1$ 位可以任意填合法数字。

由于数字 $x$ 被去掉了：

- 若 $a_i < x$，在 0 到 $a_i-1$ 中没有数字被去掉，共有 $a_i$ 种选择，对答案的贡献为 $p_{i-1} \times a_i$。
- 若 $a_i > x$，在 0 到 $a_i-1$ 中数字 $x$ 被去掉了，共有 $a_i - 1$ 种选择，对答案的贡献为 $p_{i-1} \times (a_i - 1)$。

将每一位的贡献累加即可得出 $n$ 前面有多少个数。由于题目要求的排名从 1 开始（即自然数 0 排在第 1 位），最终的累加结果需要加 1。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll T, n, x, a[20], tot, ans, p[20];

void solve()
{
    cin >> n >> x;
    tot = ans = 0;
    while (n) {
        a[++tot] = n % 10;
        n /= 10;
    }
    p[0] = 1;
    for (int i = 1; i <= 18; i++)
        p[i] = p[i - 1] * 9;
    for (int i = tot; i; i--)
        ans += p[i - 1] * (a[i] - (a[i] > x));
    cout << ans + 1ll << '\n';
}

int main()
{
    cin >> T;
    while (T--) solve();
    return 0;
}
```

