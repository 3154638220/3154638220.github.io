---
title: bnuzh 2025 周赛-5
date: 2025-11-27 18:57:21
tags:
---

[BNUZH-ACM 周赛 Round 5 - 洛谷 | 计算机科学教育新生态](https://www.luogu.com.cn/contest/292476)

<!--more-->

## A 表达式求值

### Solution

考虑如何处理先乘除后加减的规则。

将字符转化为数字后：

1. 上一个运算符是 `*`，和取出栈顶元素相乘，压入栈中。
2. 上一个运算符是 `+`，不进行额外操作，压入栈中

处理完字符串后，将栈中所有元素相加即为答案。

### Code

```cpp
#include <cstdio>
#include <iostream>
#define rei register int
#define N 100010
#define mod 10000
using namespace std;
string s;
long long stack[N], tot, len, num, b, ans;
int main()
{
	cin >> s;
	len = s.length();
	for (rei i = 0; i < len; i++)
	{
		if (s[i] >= '0' && s[i] <= '9')
			num = num * 10 + s[i] - '0';
		else if (s[i] == '+')
		{
			if (!b)
				stack[++tot] = num % mod;
			else
				stack[tot] = stack[tot] * num % mod;
			num = 0;
			b = 0;
		}
		else if (s[i] == '*')
		{
			if (!b)
				stack[++tot] = num % mod;
			else
				stack[tot] = stack[tot] * num % mod;
			num = 0;
			b = 1;
		}
		if (i + 1 == len) 
		{
			if (!b) 
				stack[++tot] = num % mod;
			else
				stack[tot] = stack[tot] * num % mod;
		}
	}
	for (rei i = 1; i <= tot; i++)
		ans += stack[i];
	printf("%lld\n", ans % mod);
	return 0;
}
```

## B 公交换乘

### Solution

注意到优先选用最早获得的没到期的优惠券

搭乘完地铁后，将优惠券加入队尾。保证队列中的优惠券一定是按获得时间排序的。

乘坐公交时，在队头取出优惠券。如果过期，则继续取，直到取出一张有效的或者队列为空为止。

每张优惠券只会入队和出队一次。总时间复杂度 $O(n)$。

### Code

```cpp
#include <cstdio>
#define rei register long long
#define N 100010
using namespace std;
struct tran {int price, time; bool used;} under[N], bus[N];
long long n, lenu, lenb, front, ans;
int main()
{
	//freopen("transfer.in", "r", stdin);
	//freopen("transfer.out", "w", stdout);
	scanf("%lld", &n);
	for (rei i = 1, kind; i <= n; i++)
	{
		scanf("%lld", &kind);
		if (kind == 0)
		{
			++lenu;
			scanf("%lld%lld", &under[lenu].price, &under[lenu].time);
			ans += under[lenu].price;
		}
		else
		{
			bool ok = false;
			++lenb;
			scanf("%lld%lld", &bus[lenb].price, &bus[lenb].time);
			for (rei j = front; j <= lenu; j++)
			{
				if (bus[lenb].time - under[j].time <= 45 && !under[j].used && under[j].price >= bus[lenb].price)
				{
					ok = true;
					under[j].used = true;
					break;
				}
				else if (bus[lenb].time - under[j].time > 45) front = j;
			}
			if (!ok) ans += bus[lenb].price;
		}
	}
	printf("%lld\n", ans);
	return 0;
}
```

## C 倒排索引

### Solution

预处理出所有 $n$ 个单词的长度为 $[\min \max]$ 的合法子串。开 $n$ 个 `map<string, int>` 记录单词出现过哪些合法子串。

同样地遍历询问串的所有合法子串，看 `map` 是否对该子串有记录。

注意每个单词最多对答案贡献 $1$。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1005;

int n, L, R, flg, ans;
string s;
unordered_map<string, int> mp[N];

int main()
{
    cin >> n >> L >> R;
    for (int i = 1; i <= n; i++) {
        cin >> s;
        if (s.size() < L) {
            mp[i][s] = 1;
            continue;
        }
        for (int j = 0; j < s.size(); j++) {
            for (int k = L; k <= R; k++) {
                if (j + k - 1 >= s.size())
                    break;
                mp[i][s.substr(j, k)] = 1;
            }
        }
    }
    cin >> s;
    for (int i = 1; i <= n; i++) {
        flg = 0;
        if (s.size() < L) {
            ans += mp[i][s];
            continue;
        }
        for (int j = 0; j < s.size(); j++) {
            if (flg) 
                break;
            for (int k = L; k <= R; k++) {
                if (j + k - 1 >= s.size())
                    break;
                if (mp[i][s.substr(j, k)]) {
                    flg = 1;
                    break;
                }
            }
        }
        ans += flg;
    }
    cout << ans << endl;
    return 0;
}
```

## D 修改数组

## Solution

考虑朴素算法。用 $mp_x$ 标记数字 $x$ 是否出现过。对 $a_i$，若 $mp_{a_i}=1$，则 $a_i=a_i+1$，直到 $mp_{a_i}=0$ 为止，并更新 $mp_{a_i}=1$。

最坏情况下是所有 $a_i$ 均为 $1$，计算次数约 $\frac{N^2}{2}=5\times 10^{11}$，超时。

考虑优化。当一段连续的数轴区间内 $[l,r]$ 所有正整数数都出现过，显然应该直接跳转到 $r+1$，而不是在 $[l,r]$ 中一个一个枚举。

因此我们对数轴上的正整数进行并查集操作。连续的用过的数并到同一个集合内，维护这个集合的最大值。这样每次更新 $mp_{a_i}$ 只用将 $a_i=r+1$ 即可。总时间复杂度 $O(n)$。

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e6 + 10;

int n, a[N], fa[N], maxn[N];
unordered_map<int, int> mp;

int find(int x) {return x == fa[x] ? x : (fa[x] = find(fa[x]));}

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= 1e6; i++)
        fa[i] = maxn[i] = i;
    for (int i = 1; i <= n; i++)
        scanf("%d", &a[i]);
    for (int i = 1; i <= n; i++) {
        if (mp[a[i]])
            a[i] = maxn[find(a[i])] + 1;
        if (!mp[a[i]]) {
            if (mp[a[i] - 1]) {
                int x = find(a[i] - 1), y = find(a[i]);
                if (x != y) {
                    fa[x] = y;
                    maxn[y] = max(maxn[x], maxn[y]);
                }
            } 
            if (mp[a[i] + 1]) {
                int x = find(a[i] + 1), y = find(a[i]);
                if (x != y) {
                    fa[x] = y;
                    maxn[y] = max(maxn[x], maxn[y]);
                }
            }
            mp[a[i]] = 1;
        }
    }
    for (int i = 1; i <= n; i++)
        printf("%d ", a[i]);
    return 0;
}
```

## E 拼数

### Solution

将所有的数看作字符串。考虑对这些字符串以某种规则进行排序，使得它们连接起来的字典序最大。

字典序并不适合直接作为排序的关键字。比如 `110` 的字典序大于 `11`，但我们更希望看到 `11+110` 而不是 `110+11`。

这启发我们，对于两个字符串 $a$，$b$，当 $a+b>b+a$ 的时候，$a$ 应该在 $b$ 的前面。这才是排序应该遵循的规则。

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 105;

int n;
string a[N];

bool cmp(const string &a, const string &b) {return a + b > b + a;}

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    sort(a + 1, a + 1 + n, cmp);
    for (int i = 1; i <= n; i++)
        cout << a[i];
    return 0;
}
```

## F 原料采购

### Solution

反悔贪心。

注意到有路费的存在，不好建立 dp 方程，故考虑枚举采购点。

建立一个大根堆，维护目前决定要购买的物品。

从近到远枚举采购点：

- 若堆中的物品总量小于 $m$，则继续往堆中添加该站点的物品。
- 若堆中的物品总量大于 $m$，则当前站点的物品和堆顶的物品比较，留下更便宜的物品。

每到一个站点后，用 $\min$ 更新一下最优答案。时间复杂度 $O(n\log m)$

### Code

```python
import sys
import heapq
from collections import defaultdict

input = sys.stdin.readline

if __name__ == '__main__':
    n, m, o = map(int, input().split())
    tot, ans, res = 0, 10 ** 19, 0
    q = []

    for i in range(n):
        a, b, c = map(int, input().split())
        if tot < m:
            x = min(m - tot, b)
            heapq.heappush(q, (-a, x))
            tot += x
            res += x * a
            b -= x
        if tot >= m:
            while b:
                if not q:
                    heapq.heappush(q, (-a, min(m, b)))
                    res += a * min(m, b)
                (x, y) = heapq.heappop(q)
                x = -x
                res -= x * y
                if x <= a:
                    heapq.heappush(q, (-x, y))
                    res += x * y
                    break
                else:
                    if y <= b:
                        heapq.heappush(q, (-a, y))
                        res += a * y
                        b -= y
                    else:
                        heapq.heappush(q, (-x, y - b))
                        res += x * (y - b)
                        heapq.heappush(q, (-a, b))
                        res += a * b
                        break
            ans = min(ans, res + c * o)
    print(ans if ans != 10 ** 19 else -1)
            
```

## G 廊桥分配

### Solution

先单独对国内区进行讨论。建立一个小根堆维护正在被使用的廊桥，关键字是廊桥所属的飞机离开的时间。

注意到廊桥依照先到先得进行分配。

按时间枚举飞机。若当前飞机到达时，堆顶的廊桥依然被占用，且当前共有 $n$ 架廊桥，则该飞机的离开时间标记为第 $n+1$ 号廊桥的解放时间，将廊桥加入堆中。当前飞机用的是 $i$ 号廊桥，则 $cnt1_i=cnt1_i+1$。对 $cnt1$ 进行前缀和处理，即可 $O(1)$ 查询给国内分配 $k$ 架廊桥时，有多少飞机能用上廊桥。

同理，对国际区飞机和廊桥进行处理，计算出 $cnt2$。

答案即为 $\max\{cnt1_i+cnt2_j\}$，其中 $i+j=n$ 。

### Code

```cpp
#include <bits/stdc++.h>
#define rei register int
#define N 1000010
using namespace std;

template <typename T> inline void read(T &x)
{
	x = 0; T f = 1; char ch = getchar();
	while (!isdigit(ch)) {if (ch == '-') f = -f; ch = getchar();}
	while (isdigit(ch)) {x = x * 10 + ch - 48; ch = getchar();}
	x *= f;
}

int n, ma, mb, ansa[N], ansb[N], ans;
struct Node {int x, y;} a[N], b[N];
priority_queue<int> Qa, Qb;
priority_queue<pair<int, int> > qa, qb;

inline bool cmp(const Node &a, const Node &b) {return a.x < b.x;}

int main()
{
	//freopen("airport.in", "r", stdin);
	//freopen("airport.out", "w", stdout);
	read(n); read(ma); read(mb);
	for (rei i = 1; i <= ma; i++) read(a[i].x), read(a[i].y);
	for (rei i = 1; i <= mb; i++) read(b[i].x), read(b[i].y);
	sort(a + 1, a + 1 + ma, cmp); sort(b + 1, b + 1 + mb, cmp);
	for (rei i = 1; i <= n; i++) Qa.push(-i), Qb.push(-i);
	for (rei i = 1; i <= ma; i++)
	{
		while (!qa.empty()) 
		{
			if (-qa.top().first <= a[i].x) Qa.push(qa.top().second), qa.pop();
			else break;
		}
		if (Qa.empty()) continue;
		int x = Qa.top(); Qa.pop();
		qa.push(make_pair(-a[i].y, x));
		++ansa[-x];
	}
	for (rei i = 1; i <= mb; i++)
	{
		while (!qb.empty()) 
		{
			if (-qb.top().first <= b[i].x) Qb.push(qb.top().second), qb.pop();
			else break;
		}
		if (Qb.empty()) continue;
		int x = Qb.top(); Qb.pop();
		qb.push(make_pair(-b[i].y, x));
		++ansb[-x];
	}
	for (rei i = 1; i <= n; i++) ansa[i] += ansa[i - 1], ansb[i] += ansb[i - 1];
	for (rei i = 0; i <= n; i++) ans = max(ans, ansa[i] + ansb[n - i]);
	printf("%d", ans);
	return 0;
}
```

