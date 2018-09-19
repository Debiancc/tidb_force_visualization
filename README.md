# tidb_force_visualization

使用 d3.force 展示你的 TiDB 集群信息
当前全部使用 fake 数据，此 repo 只是提供一种 TiDB 集群可视化的方案。

## Features

- [x] TiDB & PD & TiKV 节点分布关系可视化
- [x] 不同节点流量大小体现
- [x] 集群节点在线/离线
- [x] TiKV Leader Regions 选举过程
- [x] TiKV 动态添加 Region
- [ ] TiKV Region 同步 & 迁移 可视化
- [ ] TiKV Region 同步 & 迁移 可视化

## How To Run

`yarn && yarn dev`
