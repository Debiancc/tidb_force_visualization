# tidb_force_visualization

使用 d3.force 展示你的 TiDB 集群信息

利用 d3.force 生成可视化节点（TiDB 可分割的最小单元）和路径（拓扑关系）

不同类型节点（TiDB 组件）使用颜色区分，比如 TIDB_INSTANCE TIDB_CLUSTERS 都为粉红色节点

同类型不同功能节点使用节点的半径大小区分， 比如所有 REGION 半径为 8px，所有 CLUSTER 节点半径为 10

较为简单便于理解的方式展示当前集群的特征状态

当前全部使用 fake 数据，并 mock 一些事件的触发，此 repo 只是提供一种 TiDB 集群可视化的方案。

## Features

- TiDB & PD & TiKV 节点分布关系可视化
- 数据/视图分离 包装 D3 节点数据实现 observable
- 不同节点流量大小体现
- 集群节点在线/离线
- TiKV Leader Regions 选举过程
- TiKV 动态添加 Region
- TiKV Region 同步 & 迁移 可视化

## TODO List

[点击查看](https://github.com/Debiancc/tidb_force_visualization/issues?utf8=%E2%9C%93&q=is%3ATODO+)

## How To Run

`yarn && yarn dev`
