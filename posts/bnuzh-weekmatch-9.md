---
title: bnuzh-weekmatch-9
date: 2026-02-08 22:17:37
tags:
---

[BNUZH-ACM 周赛 Round 9 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/307236)

<!--more-->

## A

### Solution

答案为 
$$
(((n \bmod k) + k) \bmod k)c
$$

## B

### Solution

按以下优先级安排乘船方案：

1. $[100]$，$[80, 20]$，$[60, 40]$
2. $[80]$
3. $[60, 20, 20]$
4. $[40, 40, 20]$
5. $[40, 20, 20, 20]$
6. $[20, 20, 20, 20, 20]$

注意到所有数字都可表示为若干个 $20$ 相加，因此 $20$ 作为优先级最低的上船者。显然上述方案是最优的。

### Code

```c++
#include <bits/stdc++.h>
using namespace std;

int a[6], n, x, ans, minn;

int main()
{   
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> x;
        a[x / 20]++;
    }
    ans = a[5] + min(a[4], a[1]) + min(a[3], a[2]);
    minn = min(a[4], a[1]);
    a[4] -= minn; a[1] -= minn;
    minn = min(a[3], a[2]);
    a[3] -= minn; a[2] -= minn;
    ans += a[4]; a[4] = 0;
    ans += a[3]; a[1] = max(0, a[1] - a[3] * 2);
    while (a[2]) {
        if (a[2] == 1) {
            a[2]--;
            a[1] = max(0, a[1] - 3);
        } else {
            a[2] -= 2;
            a[1] = max(0, a[1] - 1);
        }
        ans++;
    }
    ans += a[1] / 5 + (a[1] % 5 != 0);
    cout << ans;
    return 0;
}
```

## C

### Solution1

低价买入，高价卖出，中间商赚差价。贪心问题。

由于：

1.  对商店根据 `a` 从小到大排序后，从前面便宜的商店买入一次，需要从后面贵的商店卖出一次，让商品全部出手，一次的利润为这两个商店的差价；
2.  交易数量越多，总利润越大；
3.  不存在手续费，如果在价格相同的两间店铺（如第二组样例）之间买入卖出，或在同一家店买入卖出，不影响利润，不需要算作特殊情况；

则有：
$$
买入数量==卖出数量==可交易数//2==\Sigma b_i//2
$$
已排序的商店中，前半部分用来计算成本，后半部分计算销售额，同时记录数量以划分买卖边界。

由于数值较大，使用乘法代替多次重复操作，并将交易次数和利润相关变量开到 `long long`。

### Code1

```c++
#include <bits/stdc++.h>
using namespace std;
#define ll long long
struct STORE
{
	ll a, b;
};
bool cmp(STORE a, STORE b)
{
	return a.a <= b.a;
}
int main()
{
	int T; cin >> T;
	while (T--)
	{
		int n; cin >> n;
		STORE s[n];
		ll sum = 0;
		for (int i = 0; i < n; i++)
		{
			cin >> s[i].a >> s[i].b;
			sum += s[i].b;
		}
		sort(s, s + n, cmp);

		// 计算成本，利润为负数
		int i = 0; // 商店，从最便宜的商店开始买
		ll cnt = 0; // 已交易次数（买入次数）
		ll ans = 0; // 利润
		while (cnt <= sum / 2)
		{
			if (cnt + s[i].b <= sum / 2) // 防止超过可交易次数
			{
				cnt += s[i].b;
				ans -= s[i].a * s[i].b;
				i++;
			}
			else
			{
				ans -= s[i].a * (sum / 2 - cnt); 
				break;
			}
		}

		// 利润 = -成本 + 销售额
		i = n - 1, cnt = 0; // 从最贵的商店开始卖，此时cnt为卖出次数
		while (cnt <= sum / 2)
		{
			if (cnt + s[i].b <= sum / 2)
			{
				cnt += s[i].b;
				ans += s[i].a * s[i].b;
				i--;
			}
			else
			{
				ans += s[i].a * (sum / 2 - cnt);
				break;
			}
		}
		cout << ans << endl;
	}
	return 0;
}
```

### Solution2

或使用双指针，同时进行相同数量的买入卖出。看起来更简洁。

### Code2

```c++
	int i = 0, j = n - 1, p;
	long long ans = 0;
	while (i < j && s[i].a < s[j].a)
	{
		p = min(s[i].b, s[j].b);
		ans += (s[j].a - s[i].a) * (long long)p;
		s[i].b -= p;
		s[j].b -= p;
		if (!s[i].b) i++;
		if (!s[j].b) j--;
	}
```

## D

### Solution

并查集模板题。

一个父亲可以有多个儿子，但是一个儿子只能有一个父亲，故建立儿子到父亲的映射关系。对于每个成员，不断向上查询就能找到最早祖先。（这道题其实这样就能AC了）

多次递归查询耗时，可以做路径压缩，若能查询到最早祖先，直接将成员连到最早祖先下，减少树的深度，减少下一次查询耗时。

### Code

```c++
#include <bits/stdc++.h>
using namespace std;
map<string, string> mp;
string find(string x)
{
	if (mp[x] == x)
		return x;
	mp[x] = find(mp[x]); // 路径压缩
	return mp[x];
}
int main()
{
	string s;
	cin >> s;
	string fa;
	while (s != "$")
	{
		if (s[0] == '#')
		{
			fa = s.substr(1);
			if (mp[fa].empty())
				mp[fa] = fa;
		}
		else if (s[0] == '+')
		{
			string son = s.substr(1);
			mp[son] = fa;
		}
		else
		{
			string son = s.substr(1);
			cout << son << " " << find(son) << endl;
		}
		cin >> s;
	}
	return 0;
}
```

## E

### Solution

单源最短路径问题。

背景只是给出边权的计算方法。

没有负权边，节点数少（$n\le100$），建图之后使用最短路算法即可，比如Dijkstra、Bellman-Ford、SPFA、Floyd（多元最短路径算法），甚至直接搜索+剪枝也能通过。

由于只是套模板，就不详细阐述了。

### Code1 - Dijkstra

```c++
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 105;
const int INF = 1e9;
int h[8] = {0, 2, 6, 4, 8, 6, 10, 14};
int graph[MAXN][MAXN];
int dist[MAXN];
bool visited[MAXN];
int main()
{
  for (int i = 1; i <= 7; i++)
  {
    int s; cin >> s;
    if (s == 1) h[i] /= 2;
  }
  int start, end; cin >> start >> end;
  int c; cin >> c;
  memset(graph, 0x3f, sizeof(graph));
  for (int i = 1; i < MAXN; i++)
    graph[i][i] = 0;
  for (int i = 0; i < c; i++)
  {
    int u, v, t;
    cin >> u >> v >> t;
    graph[u][v] = h[t];
    graph[v][u] = h[t];
  }
  memset(dist, 0x3f, sizeof(dist));
  memset(visited, false, sizeof(visited));
  dist[start] = 0;

  for (int i = 1; i < MAXN; i++)
  {
    // 找到未访问的、距离起点最近的城市u
    int u = -1;
    int min_dist = INF;
    for (int j = 1; j < MAXN; j++)
    {
      if (!visited[j] && dist[j] < min_dist)
      {
        min_dist = dist[j];
        u = j;
      }
    }
    if (u == -1) break;
    visited[u] = true;
    for (int v = 1; v < MAXN; v++) // 松弛操作
    {
      // 如果v未访问，且u到v有路径，且经过u到v的路径更短
      if (!visited[v] && graph[u][v] != INF)
        dist[v] = min(dist[v], dist[u] + graph[u][v]);
    }
  }
  cout << dist[end] << endl;
  return 0;
}
```

### Code2 - Floyd

```c++
#include <bits/stdc++.h>
using namespace std;
const int maxn = 105;
int s[8] = {0, 2, 6, 4, 8, 6, 10, 14};
int d[maxn][maxn];
int main()
{
  for (int i = 1, u; i <= 7; i++)
  {
    cin >> u;
    if (u)
      s[i] /= 2;
  }
  for (int i = 1; i < maxn; i++)
  {
    for (int j = 1; j < maxn; j++)
      d[i][j] = 1e9;
    d[i][i] = 0;
  }
  int a, b, c;
  cin >> a >> b >> c;
  for (int i = 1, m, n, w; i <= c; i++)
  {
    cin >> m >> n >> w;
    d[m][n] = s[w];
    d[n][m] = s[w];
  }
  for (int k = 1; k < maxn; k++)
    for (int i = 1; i < maxn; i++)
      for (int j = 1; j < maxn; j++)
        if (d[i][j] > d[i][k] + d[k][j])
          d[i][j] = d[i][k] + d[k][j];
  cout << d[a][b];
  return 0;
}
```

### Code3 - DFS

```c++
#include <bits/stdc++.h>
using namespace std;
const int maxn = 105;
int h[8] = {0, 2, 6, 4, 8, 6, 10, 14};
int st, ed;
int city[maxn][maxn];
bool vis[maxn];
int ans = 2e9, now;
void dfs(int u)
{
	if (now >= ans) return; // 不剪枝会TLE
	if (u == ed)
	{
		ans = min(ans, now);
		return;
	}
	for (int i = 1; i < maxn; i++)
	{
		if (city[u][i] && !vis[i])
		{
			vis[i] = 1; now += city[u][i];
			dfs(i);
			vis[i] = 0; now -= city[u][i];
		}
	}
}
int main()
{
	for (int i = 1; i <= 7; i++)
	{
		int s; cin >> s;
		if (s) h[i] /= 2;
	}
	cin >> st >> ed;
	int c; cin >> c;
	while (c--)
	{
		int x, y, z;
		cin >> x >> y >> z;
		city[x][y] = h[z];
		city[y][x] = h[z];
	}
	vis[st] = 1;
	dfs(st);
	cout << ans;
	return 0;
}
```

## F

### Solution

$n=1$ 时，答案为 `N`。以下考虑 $n>1$ 的情况。

所有 $n$ 都可分解质因数，即表示为 $n=\prod p_i^{k_i}$。设 $n$ 有 $m$ 个因数。

引入一个显然正确的先手胜利必要条件：存在 $p_{i_0}$，使得**至少**有 $m-1$ 个 $n$ 的因数是 $p_{i_0}$ 的倍数。否则在双方都最聪明的情况下，先手取的数的 $\gcd$ 最终必定为 $1$。

对 $n$ 有多少种质因数进行分类讨论。

1. $n$ 只有一种质因数，即 $n=p^k$。若 $k$ 为偶数，则因数有 $1,p,p^2,\cdot\cdot\cdot,p^k$，共奇数个因数。最后先手一定会取到 $1$，答案为 `N`。反之，若 $k$ 为奇数，答案为 `Y`。
2. $n$ 有两种质因数，即 $n=p_1^{k_1}p_2^{k_2}$。不妨设 $k_1 \ge k_2 \ge 1$。若 $k_1=k_2=1$，则与题目样例 1 情况相同，答案为 `Y`。否则，$k_1>1$，对 $p_i(i=1,2)$ ，都存在至少两个因数不为 $p_i$ 的倍数，不满足上文先手胜利的必要条件，答案为 `N`。
3. $n$ 不止两种质因数，则不存在满足先手胜利必要条件的 $p_i$，答案一律为 `N`。

### Code

对 $n$ 进行质因数分解按题解分析判断即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int N = 1e6 + 10;

ll n, pri[N], pri_cnt, flg[N], fac[N], fac_cnt, cnt[N];

void Prime()
{
    for (int i = 2; i <= 1e6; i++) {
        if (!flg[i]) {
            pri[++pri_cnt] = i;
            for (int j = i + i; j <= 1e6; j += i)
                flg[j] = 1;
        }
    }
}

int main()
{
    Prime();
    cin >> n; ll num = n;
    if (n == 1) {
        putchar('N');
        return 0;
    }
    for (int i = 1; i <= pri_cnt; i++) {
        if (n % pri[i] == 0) {
            fac[++fac_cnt] = i;
            while (n % pri[i] == 0) {
                n /= pri[i];
                cnt[i]++;
            }
        }
    }
    if (fac_cnt == 1 && (n > 1 && cnt[fac[1]] == 1 || n == 1 && (cnt[fac[1]] & 1)) || fac_cnt == 2 && n == 1 && cnt[fac[1]] == cnt[fac[2]] && cnt[fac[1]] == 1 || fac_cnt == 0)
        putchar('Y');
    else
        putchar('N');
    return 0;
}
```

