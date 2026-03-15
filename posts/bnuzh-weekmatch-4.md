---
title: 2025 bnuzh 周赛-4
date: 2025-11-18 15:02:35
tags:
password:
---

[BNUZH-ACM 周赛 Round 4 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/290567)

<!--more-->

## A 拼数

### Solution

将数字提取到一个数组里面，对数组排序，按序输出即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int num[1000010], cnt, n;
char s[1000010];

int main()
{
    scanf("%s", s + 1);
    n = strlen(s + 1);
    for (int i = 1; i <= n; i++)
        if (isdigit(s[i]))
            num[++cnt] += s[i] - '0';
    sort(num + 1, num + cnt + 1);
    for (int i = cnt; i; i--)
        printf("%d", num[i]);
    return 0;
}
```

## B 座位

先计算小 R 的排名 $rk$，座位列数和行数公式对应代码中的 `ansn` 和`ansm`。

最后根据列数的奇偶，特判一下是否需要反转行数。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 105;
int x, rt, n, m, rk = 1, ansn, ansm;

int main()
{
    scanf("%d%d%d", &n, &m, &rt);
    for (int i = 2; i <= n * m; i++) {
        cin >> x;
        rk += (x > rt);
    }
    ansn = (rk - 1) / n + 1;
    ansm = (rk - 1) % n + 1;
    if (!(ansn & 1))
        ansm = n - ansm + 1;
    printf("%d %d", ansn, ansm);
    return 0;
}
```



## C 社团招新

### Solution

贪心，先将所有人放到最想去的社团。若某个社团人数大于 $\frac{n}{2}$（设为 $k$ 号社团），则继续处理。

设编号为 $i$ 的人对社团的满意度从小到大分别是 $a_i^1$、$a_i^2$、$a_i^3$。按照 $a_i^3-a_i^2$ 的大小，对所有人进行排序。

从小到大枚举人，若 $a^3_i$ 代表的是第 $i$ 个人对 $k$ 号社团的满意度，则答案减去 $a_i^3$ 加上 $a_i^2$。直到社团 $k$ 人数小于 $\frac{n}{2}$ 为止。

时间复杂度 $O(n\log n)$。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e5 + 10;

int T, n, cnt[4], ans;
struct Node {
    pair<int, int> a[4];
    int dif;
} a[N];

bool cmp(const Node &a, const Node &b) {return a.dif < b.dif;}

void solve()
{
    ans = 0;
    memset(cnt, 0, sizeof(cnt));
    cin >> n;
    for (int i = 1; i <= n; i++) {
        int x, y, z;
        cin >> x >> y >> z;
        a[i].a[1] = {x, 1};
        a[i].a[2] = {y, 2};
        a[i].a[3] = {z, 3};
        sort(a[i].a + 1, a[i].a + 1 + 3);
        cnt[a[i].a[3].second]++;
        a[i].dif = a[i].a[3].first - a[i].a[2].first;
        ans += a[i].a[3].first;
    }
    sort(a + 1, a + 1 + n, cmp);
    int X = -1, Y = -1;
    for (int i = 1; i <= 3; i++) {
        if (cnt[i] > n / 2) {
            X = cnt[i];
            Y = i;
            break;
        }
    }
    if (X != -1) {
        X -= n / 2;
        for (int i = 1; i <= n && X > 0; i++) {
            if (a[i].a[3].second == Y) {
                ans -= a[i].dif;
                X--;
            }
        }
    }
    cout << ans << endl;
}

int main()
{
    cin >> T;
    while (T--) solve();
    return 0;
}
```

## D 第 K 小的和

## Solution

注意到 $x$ 越大，排名越大。故二分找第 $k$ 小的数。

首先对 $a$，$b$ 排序。对二分的值 $x$，枚举 $a_i$，二分求出在 $b$ 中有 $tot_i$ 个元素小于等于 $x-a_i$。

$k=\sum tot_i$ 即为 $x$ 在 $a$，$b$ 元素和中的排名。

时间复杂度 $O(n\log(A_i+B_i)\log m)$

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll N = 1e5 + 10;

ll n, m, k, a[N], b[N], ans;

bool check(ll x)
{
    ll res = 0;
    for (int i = 1; i <= n; i++) {
        if (a[i] + b[1] > x)
            break;
        ll tot = upper_bound(b + 1, b + 1 + m, x - a[i]) - b - 1;
        res += tot;
    }
    return (res >= k);
}


int main()
{  
    cin >> n >> m >> k;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 1; i <= m; i++)
        cin >> b[i];
    sort(a + 1, a + 1 + n);
    sort(b + 1, b + 1 + m);
    ll l = 2, r = 2e9, mid;
    while (l <= r) {
        mid = (l + r) >> 1;
        if (check(mid)) {
            ans = mid;
            r = mid - 1;
        } else
            l = mid + 1;
    }
    cout << ans << endl;
    return 0;
}
```

## E 成绩统计

### Solution

注意到检查的同学越多，越可能满足条件。故我们对检查的同学数量 $x$ 进行二分。

因为数字互相越接近，方差越小，所以对 $v$ 的区间 $[1,x]$ 进行排序，并枚举连续 $k$ 个数，判断是否满足条件。

题目条件为
$$
\frac{\sum_{i=1}^k (v_i - \bar{v})^2}{k} < T
$$
即
$$
\sum_{i=1}^k (v_i - \bar{v})^2 < k T
$$

$$
\sum_{i=1}^k v_i - k\bar{v}^2 < k T
$$

将 $\bar{v} = \frac{\sum_{i=1}^k v_i}{k}$ 代入得

$$
\left(\sum v_i^2\right) - \frac{(\sum v_i)^2}{k} < k T
$$

为了在程序中避免浮点数运算带来的精度问题，我们将不等式两边再次同乘以 $k$，得到我们的判断条件：
$$
k \left(\sum_{i=1}^k v_i^2\right) - \left(\sum_{i=1}^k v_i\right)^2 < k^2 T
$$
式子中的两组求和都容易通过预处理，做到 $O(1)$ 查询。时间复杂度为 $O(n\log^2 n)$。

### Code

C++ 需要开启 `__int128`。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int N = 1e5 + 10;

ll n, ans = -1, a[N], b[N], k, T;
__int128 s1[N], s2[N];

bool check(ll x)
{
    __int128 res;
    for (int i = 1; i <= x; i++)
        b[i] = a[i];
    sort(b + 1, b + 1 + x);
    // 前缀和预处理出两组求和
    for (int i = 1; i <= x; i++) {
        s1[i] = s1[i - 1] + b[i];
        s2[i] = s2[i - 1] + b[i] * b[i];
    }
    for (int i = k; i <= x; i++) {
        // 最后求出的公式
        res = k * (s2[i] - s2[i - k]) - (s1[i] - s1[i - k]) * (s1[i] - s1[i - k]);
        if (res < (__int128)k * k * T)
            return 1; 
    }
    return 0;
}

int main()
{
    cin >> n >> k >> T;
    for (int i = 1; i <= n; i++) 
        cin >> a[i];
    ll l = k, r = n, mid;
    while (l <= r) {
        mid = (l + r) >> 1;
        if (check(mid))
            r = mid - 1, ans = mid;
        else
            l = mid + 1;
    }
    cout << ans << endl;
    return 0;
}
```

## F 网络流量监控

### Solution

模拟题。

每条路径都按照 `/` 分割为字符串数组。

对每次询问，枚举恶意路径一个个匹配。注意到通配符只可能出现一次，对恶意路径分类讨论：

1. 不含通配符 `*`，`**`：直接判断两条路径是否相同。
2. 含通配符 `*`：先判断长度是否一致，然后逐位检查字符串是否相同。
3. 含通配符 `**`：`**` 将恶意路径分割成前缀和后缀。分别判断恶意路径的前缀与后缀和询问路径的前缀与后缀是否相同。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e4 + 10;

int val[N], n, m, ans[N];
vector<string> str[N], S;

void solve(int k)
{
    for (int i = 1; i <= n; i++) {
        string s_type = "";
        int s_pos;
        // 找通配符的位置
        for (int j = 0; j < str[i].size(); j++) {
            if (str[i][j] == "*" || str[i][j] == "**") {
                s_type = str[i][j];
                s_pos = j;
                break;
            }
        }
        if (s_type.empty()) { 
            // 不含通配符
            if (str[i] == S) 
                ans[k] = max(ans[k], val[i]);
        } else if (s_type == "*") { 
            // 通配符 *
            if (str[i].size() != S.size()) 
                continue;
            int flg = 1;
            for (int j = 0; j < S.size(); j++) {
                if (S[j] != str[i][j] && str[i][j] != "*") {
                    flg = 0;
                    break;
                }
            }
            if (flg)
                ans[k] = max(ans[k], val[i]);
        } else { 
            // 通配符 **
            int flg = 1, suf = str[i].size() - s_pos - 1;
            if (s_pos + suf > S.size())
                continue;
            // 比较前缀
            for (int j = 0; j < s_pos; j++) {
                if (S[j] != str[i][j]) {
                    flg = 0;
                    break;
                }
            }
            // 比较后缀
            for (int j = 1; j <= suf; j++) {
                if (S[S.size() - j] != str[i][str[i].size() - j]) {
                    flg = 0;
                    break;
                }
            }
            if (flg)
                ans[k] = max(ans[k], val[i]);
        }
    }
}

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++) {
        string seg, s;
        cin >> val[i] >> s;
        // 按斜杠分割路径，存在字符串vector里面
        for (int j = 1; j < s.size(); j++) {
            if (s[j] == '/') {
                str[i].push_back(seg);
                seg = "";
            } else
                seg += s[j];
        }
        str[i].push_back(seg);
    }
    cin >> m;
    for (int i = 1; i <= m; i++) {
        string seg, s;
        S.clear();
        cin >> s;
        for (int j = 1; j < s.size(); j++) {
            if (s[j] == '/') {
                S.push_back(seg);
                seg = "";
            } else
                seg += s[j];
        }
        S.push_back(seg);
        solve(i);
    }
    for (int i = 1; i <= m; i++) {
        if (!ans[i])
            cout << "SAFE\n";
        else
            cout << "ALERT: " << ans[i] << endl;
    }
    return 0;
}
```

## G 上升序列构造

### Solution

贪心 + 构造。要在保证后一个数大于前一个数的同时，后一个数尽可能小。

数字的位数可能会到 $10^{5000}$ 级别，考虑转化成字符串处理。

设前一个字符串（已经加 `0`）为 $a$，长度 $l_a$。当前字符串为 $b$，长度 $l_b$。分类讨论：

1. 若 $l_a<l_b$：不用加 `0`。
2. 若 $l_a=l_b$ 且 $a<b$ ：不用加 `0`。
3. 否则，枚举 $i$ 计算要使得 $a$ 长为 $i$ 的前缀与 $b$ 的前缀相同，需要加多少个 `0` 改造 $b$ 的前缀，且改造后 $b_{i+1}>a_{i+1}$ 成立。若存在 $i$ 使得不等式成立，则在改造后的 $b_{i+1}$ 后插入剩余的 `0` 使得 $l_a=l_b$。否则在 $b$ 的第二位开始插入若干个 `0`，使得 $l_b=l_a+1$。

时间复杂度 $O(n^2)$。

### Code

照着敲一遍应该能理解。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 5010;

int n, ans, c[N], z[N], len_pre, len_cur;
string a[N];

string find(int k)
{
    memset(c, -1, sizeof(c));
    memset(z, -1, sizeof(z));
    int c_cnt = 0, z_cnt = 0, zero = len_pre - len_cur;
    z[0] = c[0] = 0;
    for (int i = 0; i < len_pre; i++) {
        if (c_cnt < len_cur && a[k - 1][i] == a[k][c_cnt])
            c_cnt++;
        else if (a[k - 1][i] == '0')
            z_cnt++;
        else 
            break;
        // 相同的前缀要 c_cnt 个 a_i 的字符组成
        c[i + 1] = c_cnt;
        // 相同的前缀要 z_cnt 个新增的 0 组成
        z[i + 1] = z_cnt;
    }
    // 枚举前缀相同的长度
    for (int i = len_pre - 1; i >= 0; i--) {
        if (c[i] == -1 || z[i] > zero || c[i] >= len_cur)
            continue;
        if (a[k][c[i]] > a[k - 1][i]) {
            // 如果剩余的 0 够用
            if (len_cur - (c[i] + 1) + zero - z[i] == len_pre - i - 1) {
                string res = a[k - 1].substr(0, i) + a[k][c[i]] + string(zero - z[i], '0') + a[k].substr(c[i] + 1);
                return res;
            }
        }
    }
    return "";
}

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 2; i <= n; i++) {
        len_pre = a[i - 1].size();
        len_cur = a[i].size();
        if (len_cur > len_pre || (len_cur == len_pre && a[i] > a[i - 1]))
            continue;
        for (int k = len_pre - len_cur; k <= len_pre + 1 - len_cur; k++) {
            int nlen = len_cur + k;
            if (nlen > len_pre) {
                ans += k;
                if (a[i].size() > 1)
                    a[i] = a[i].substr(0, 1) + string(k, '0') + a[i].substr(1);
                else
                    a[i] = a[i].substr(0, 1) + string(k, '0');
                break;
            }
            // 第3种情况
            string res = find(i);
            if (!res.empty()) {
                ans += k;
                a[i] = res;
                break;
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```

