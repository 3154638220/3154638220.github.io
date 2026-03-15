---
title: Set 和 muitiset
date: 2024-05-28 23:09:12
tags: [STL, set, multiset]
categories: 笔记
---

## 简介

set 和 multiset 作为 C++ STL 的一部分，由红黑树实现，能保持容器内元素始终有序。其插入、查找、删除的时间复杂度均为 $\Theta(\log n)$。两者区别在于 set 不允许有重复元素，multiset 允许有重复元素。

这里顺便提起 unordered_set 和 unordered_multiset，底层实现是哈希表，容器内元素无序。插入、查找、删除的时间复杂度最好为 $\Theta(1)$，最坏为 $\Theta(n)$。空间换时间。

<!--more-->

## 命令及使用

multiset：

```cpp
multiset<int> s; // 定义一个 multiset 容器
s.begin() // 返回指向第一个元素的指针
(*s).begin() // 第一个元素
s.end() // 返回容器末尾的指针，不指向任何元素
    
auto it = s.end();
it--; // 此时 it 为指向末尾元素的指针

s.erase(k) // 删除 s 中所有等于 k 的元素
s.erase(it) // 删除指针 it 指向的元素
    
// 若只想删除一个值为 k 的元素
if (it = s.find(k) != s.end())
    s.erase(it);

s.count(k) // 返回 k 的个数
```

