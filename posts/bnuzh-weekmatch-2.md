---
title: 2025 bnuzh 周赛-2
date: 2025-11-03 20:32:57
tags:
password: ""
---

[比赛链接](https://www.luogu.com.cn/contest/287471)

<!--more-->

## A 2025 图形

Python 大法好

### Code

```python
n, m = map(int, input().split())
s = "2025"
for i in range(n):
    print(s * (m // 4) + s[:m % 4])
    s = s[1:] + s[:1]
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
	int h, w;
	cin >> h >> w;
	string s = "2025";
	for (int i = 0; i < h; i++)
	{
		int k = i % 4;
		for (int j = 0; j < w; j++)
			cout << s[(k + j) % 4];
		cout << endl;
	}
	return 0;
}
```

## B 迷宫

### Code

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int n, m, map[100][100], t, ans = 0, sx, sy, fx, fy;
int dx[4] = {0, 1, 0, -1},
	dy[4] = {1, 0, -1, 0};
bool p[100][100];

void dfs(int x, int y)
{
	
	if (x == fx && y == fy)
	{
		ans++;
		return;
	}
	p[x][y] = true;
	for (int i = 0; i < 4; i++)
	{
		int x1 = x + dx[i], y1 = y + dy[i];
		if (x1 > 0 && x1 <= n && y1 > 0 && y1 <= m && !p[x1][y1] && !map[x1][y1])
			dfs(x1, y1);
	}
	p[x][y] = false;
}

int main()
{
	int x, y;
	memset(p, false, sizeof(p));
	memset(map, 0, sizeof(map));
	cin >> n >> m >> t >> sx >> sy >> fx >> fy;
	for (int i = 1; i <= t; i++)
	{
		cin >> x >> y;
		map[x][y] = 1;
	}
	dfs(sx, sy);
	cout << ans << endl;
	return 0;
}
```

## C 在哈尔滨指路

### Solution

使用 C++ 的 `map` 或 Python 的 `defaultdict` 将方向映射到数字 $1234$ 而非字母上，更容易判断转弯的方向。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e4 + 10;

int T, n, tot, st, a[N];
map<char, int> mp;
char s[N];

void solve()
{
    scanf("%d", &n);
    mp['N'] = 1; mp['E'] = 2; mp['S'] = 3; mp['W'] = 4;
    for (int i = 1; i <= n; i++) {
        cin >> s[i] >> a[i];
    }
    cout << n * 2 - 1 << ' ' << s[1] << endl;
    for (int i = 1; i <= n; i++) {
        printf("Z %d\n", a[i]);
        if (i == n) continue;
        if (mp[s[i + 1]] == mp[s[i]] + 1 || mp[s[i]] == 4 && mp[s[i + 1]] == 1)
            printf("R\n");
        else
            printf("L\n");
    }
}

int main()
{
    scanf("%d", &T);
    while (T--) solve();
    return 0;
}
```

## D 数的划分

### Solution

逐位往后搜索，枚举每个位置的数，最后判断各位相加是否等于 $n$。

$\text{dfs}(a,b,c)$ 表示当前位置为 $a$，剩余可分配的数字为 $b$，还有 $c$ 个位置未分配。

### Code

```cpp
#include <iostream>
using namespace std;
int n, k, ans = 0;
void dfs(int a, int b, int c)
{
	if (c == 1)
	{
		if (b == 0) ans++;
		return;
	}
	for (int i = a; i <= b / (c - 1); i++)
		dfs(i, b - i, c - 1);
}
int main()
{
	cin >> n >> k;
	for (int i = 1; i <= n / k; i++)
		dfs(i, n - i, k);
	cout << ans << endl;
	return 0;
}
```

## E 瞬移

### Solution

注意到位置状态不超过 $L\le 2000$ 种，考虑使用广度优先搜索（BFS）。

先枚举计算可移动的距离有哪些。

搜索中，用 $vis_i$ 记录是否已经搜索过位置 $i$。由于使用队列，越快到达的地点必定越快被搜索到。因此 $vis_i$ 存在时，可跳过点 $i$。

每个点只可能入队一次，时间复杂度为 $O(n^2+L)$。

### Code

```python
import sys
from collections import defaultdict

input = sys.stdin.readline

if __name__ == '__main__':
    n, L = map(int, input().split())
    a = list(map(int, input().split()))
    vis = defaultdict(int)
    d = []
    
    # 计算可移动的距离
    for i in range(n):
        for j in range(n):
            nxt = (a[i] + a[j]) % L
            if not vis[nxt] and nxt:
                d.append(nxt)
                vis[nxt] = 1
                
    # BFS
    vis = defaultdict(int)
    que, head, tail, end = [1], 0, 0, 0
    while head <= tail:
        u = que[head]
        head += 1
        if u == L:
            end = 1
            print(vis[u])
            break
        for k in d:
            nxt = (u + k - 1) % L + 1
            if vis[nxt] or nxt == 1:
                continue
            tail += 1
            que.append(nxt)
            vis[nxt] = vis[u] + 1
    if end == 0:
        print(-1)
```

## F 贵校是构造王国吗 Ⅰ

### Solution

注意到 $\gcd(n,n+1)=1$，以 $n=4$，$k=8$ 为例，这样阶梯式填写网格一定符合题意：

|             | 第 1 列 | 第 2 列 | 第 3 列 | 第 4 列 |
| :---------- | :-----: | :-----: | :-----: | :-----: |
| **第 1 行** |    1    |    2    |         |         |
| **第 2 行** |         |    3    |    4    |         |
| **第 3 行** |         |         |    5    |    6    |
| **第 4 行** |    8    |         |         |    7    |

同理可推广到任意 $n$ 的网格上。

当 $k>2n$ 时，多出来的数任意填写即可。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int N = 1e5 + 10;

ll n, m, a[N], ans;
map<ll, ll> mp;

int main()
{
    cin >> n >> m;
    ll x = 1, y = 1;
    for (int i = 1; i <= (n << 1) - 1; i++) {
        printf("%lld %lld\n", x, y);
        mp[(x - 1) * n + y] = 1;
        if (x == y) y++;
        else x++;
    }
    printf("%lld %d\n", n, 1);
    ll p = (n << 1) + 1;
    mp[n * (n - 1) + 1] = 1;
    for (int i = 1; p <= m; i++) {
        if (mp[i]) continue;
        y = i % n;
        if (y == 0) y = n;
        x = (i - y) / n + 1;
        printf("%lld %lld\n", x, y);
        p++;
    }
    return 0;
}
```

