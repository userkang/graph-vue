export default {
  nodes: [
    {
      id: '1',
      label: '1',
      profileDescription: [],
      explainDescription: null,
      violateRules: null,
      emphasis: [],
      parent: null,
      container: true,
      core: true,
      parentId: '',
      type: 'group'
    },
    {
      id: '2',
      label: '2',
      profileDescription: [
        'Active: 32.987ms',
        'NonChild: 0.01%',
        'Address: 10.56.113.26:9060',
        'Instance Id: e57d8e0006a64314-8e41e68327e717de',
        'AverageThreadTokens: 0.00',
        'FragmentCpuTime: 106.179us',
        'MemoryLimit: 2.00 GB',
        'PeakMemoryUsage: 72.00 KB',
        'PeakReservation: 0.00',
        'PeakUsedReservation: 0.00',
        'RowsProduced: 0'
      ],
      explainDescription: null,
      violateRules: null,
      emphasis: ['RowsProduced: 0'],
      parent: '1',
      container: true,
      core: true,
      parentId: '1',
      type: 'group'
    },
    {
      id: '3',
      label: 'DataBufferSender',
      profileDescription: [
        'Dest Instance Id: e57d8e0006a64314-8e41e68327e717de',
        'AppendBatchTime: 0ns',
        'ResultSendTime: 0ns',
        'TupleConvertTime: 0ns',
        'NumSentRows: 0'
      ],
      explainDescription: null,
      violateRules: null,
      emphasis: ['AppendBatchTime: 0ns', 'NumSentRows: 0'],
      parent: '2',
      container: false,
      core: true,
      parentId: '2',
      type: ''
    },
    {
      id: '4',
      label: 'HASH_JOIN_NODE 3',
      profileDescription: [
        'Active: 32.977ms',
        'NonChild: 0.05%',
        'Id: 3',
        'ExecOption: Hash Table Built Asynchronously',
        'BuildBuckets: 1.024K (1024)',
        'BuildRows: 0',
        'BuildTime: 5.803us',
        'HashTableMaxList: 0',
        'HashTableMinList: 0',
        'LoadFactor: 0.00',
        'PeakMemoryUsage: 56.00 KB',
        'ProbeRows: 0',
        'ProbeTime: 0ns',
        'PushDownComputeTime: 167ns',
        'PushDownTime: 1.219us',
        'RowsReturned: 0',
        'RowsReturnedRate: 0'
      ],
      explainDescription: [
        'join op: INNER JOIN (BROADCAST)',
        'hash predicates: ',
        'colocate: false, reason: Tables are not in the same group',
        'equal join conjunct: `partition_date` = <slot 10> `partition_date`',
        'runtime filters: RF000[in] <- <slot 10> `partition_date`',
        'cardinality: 411367',
        'name: HASH_JOIN_NODE 3'
      ],
      violateRules: null,
      emphasis: [
        'BuildRows: 0',
        'BuildTime: 5.803us',
        'ProbeRows: 0',
        'ProbeTime: 0ns'
      ],
      parent: '2',
      container: false,
      core: true,
      parentId: '2',
      type: ''
    },
    {
      id: '5',
      label: 'EXCHANGE_NODE 4',
      profileDescription: [
        'Active: 32.860ms',
        'NonChild: 17.25%',
        'Id: 4',
        'BytesReceived: 0.00',
        'ConvertRowBatchTime: 336ns',
        'DataArrivalWaitTime: 32.857ms',
        'DeserializeRowBatchTimer: 0ns',
        'FirstBatchArrivalWaitTime: 32.857ms',
        'PeakMemoryUsage: 0.00',
        'RowsReturned: 0',
        'RowsReturnedRate: 0',
        'SendersBlockedTotalTimer(*): 0ns'
      ],
      explainDescription: ['extra: EXCHANGE', 'name: EXCHANGE_NODE 4'],
      violateRules: null,
      emphasis: ['BytesReceived: 0.00', 'RowsReturned: 0'],
      parent: '2',
      container: false,
      core: true,
      parentId: '2',
      type: ''
    },
    {
      id: '6',
      label: 'OLAP_SCAN_NODE 0',
      profileDescription: [
        'Active: 30.835us',
        'NonChild: 0.02%',
        'Id: 0',
        'Table Name: test_wmj',
        'BlockLookupCacheTime: 0ns',
        'BlockPutCacheTime: 0ns',
        'BytesRead: 0.00',
        'GetNextTime: 18.911us',
        'MaxWaitScanTime: 0ns',
        'NumDiskAccess: 0',
        'NumScanners: 0',
        'PeakMemoryUsage: 0.00',
        'RowsRead: 0',
        'RowsReturned: 0',
        'RowsReturnedRate: 0',
        'RowsetNum: 0',
        'RowsetReaderInitTime: 0ns',
        'ScannerBatchWaitTime: 0ns',
        'ScannerBlockPutTimer: 0ns',
        'ScannerMaxPendingTimer: 0ns',
        'ScannerWorkerWaitTime: 0ns',
        'SegmentNum: 0',
        'StartScanTime: 18.671us',
        'TabletCount : 1',
        'TotalReadThroughput: 0.0 /sec',
        'WaitScanTime: 0ns'
      ],
      explainDescription: [
        'TABLE: test_wmj',
        'PREAGGREGATION: OFF. Reason: No AggregateInfo',
        "PREDICATES: `partition_date` = '2022-10-11'",
        'runtime filters: RF000[in] -> `partition_date`',
        'partitions: 1/1',
        'rollup: test_wmj',
        'tabletRatio: 1/1',
        'tabletList: 69144655',
        'cardinality: 411367',
        'avgRowSize: 31.65798',
        'numNodes: 3',
        'name: OLAP_SCAN_NODE 0'
      ],
      violateRules: [
        "Rule{rules=[[pattern has \"O\"]('0:Partitions' > 0.9)], desc='查全表'}"
      ],
      emphasis: [
        'BytesRead: 0.00',
        'RowsRead: 0',
        'RowsReturned: 0',
        'ScannerBatchWaitTime: 0ns',
        'ScannerWorkerWaitTime: 0ns'
      ],
      parent: '2',
      container: false,
      core: false,
      parentId: '2',
      type: ''
    },
    {
      id: '7',
      label: 'OlapScanner',
      profileDescription: [
        'Id: 0',
        'Table Name: test_wmj',
        'BlockConvertTime: 0ns',
        'BlockFetchTime: 0ns',
        'ReaderInitTime: 0ns',
        'RowsDelFiltered: 0',
        'RowsPushedCondFiltered: 0',
        'ScanCpuTime: 0ns',
        'ScanTime: 0ns',
        'ShowHintsTime_V1: 0ns'
      ],
      explainDescription: [
        'TABLE: test_wmj',
        'PREAGGREGATION: OFF. Reason: No AggregateInfo',
        "PREDICATES: `partition_date` = '2022-10-11'",
        'runtime filters: RF000[in] -> `partition_date`',
        'partitions: 1/1',
        'rollup: test_wmj',
        'tabletRatio: 1/1',
        'tabletList: 69144655',
        'cardinality: 411367',
        'avgRowSize: 31.65798',
        'numNodes: 3',
        'name: OLAP_SCAN_NODE 0'
      ],
      violateRules: [
        "Rule{rules=[[pattern has \"O\"]('0:Partitions' > 0.9)], desc='查全表'}"
      ],
      emphasis: [
        'ReaderInitTime: 0ns',
        'RowsPushedCondFiltered: 0',
        'ScanTime: 0ns'
      ],
      parent: '2',
      container: false,
      core: false,
      parentId: '2',
      type: ''
    },
    {
      id: '8',
      label: 'SegmentIterator',
      profileDescription: [
        'Id: 0',
        'Table Name: test_wmj',
        'BitmapIndexFilterTimer: 0ns',
        'BlockLoadTime: 0ns',
        'BlockSeekCount: 0',
        'BlockSeekTime: 0ns',
        'BlocksLoad: 0',
        'CachedPagesNum: 0',
        'CompressedBytesRead: 0.00',
        'DecompressorTimer: 0ns',
        'IOTimer: 0ns',
        'IndexLoadTime_V1: 0ns',
        'NumSegmentFiltered: 0',
        'NumSegmentTotal: 0',
        'RawRowsRead: 0',
        'RowsBitmapIndexFiltered: 0',
        'RowsBloomFilterFiltered: 0',
        'RowsConditionsFiltered: 0',
        'RowsKeyRangeFiltered: 0',
        'RowsStatsFiltered: 0',
        'RowsVectorPredFiltered: 0',
        'TotalPagesNum: 0',
        'UncompressedBytesRead: 0.00',
        'VectorPredEvalTime: 0ns'
      ],
      explainDescription: [
        'TABLE: test_wmj',
        'PREAGGREGATION: OFF. Reason: No AggregateInfo',
        "PREDICATES: `partition_date` = '2022-10-11'",
        'runtime filters: RF000[in] -> `partition_date`',
        'partitions: 1/1',
        'rollup: test_wmj',
        'tabletRatio: 1/1',
        'tabletList: 69144655',
        'cardinality: 411367',
        'avgRowSize: 31.65798',
        'numNodes: 3',
        'name: OLAP_SCAN_NODE 0'
      ],
      violateRules: [
        "Rule{rules=[[pattern has \"O\"]('0:Partitions' > 0.9)], desc='查全表'}"
      ],
      emphasis: [
        'BlockLoadTime: 0ns',
        'IOTimer: 0ns',
        'RawRowsRead: 0',
        'UncompressedBytesRead: 0.00'
      ],
      parent: '2',
      container: false,
      core: false,
      parentId: '2',
      type: ''
    },
    {
      id: '9',
      label: 'RuntimeFilter',
      profileDescription: ['AWaitTimeCost: 0ns', 'EffectTimeCost: 33.816ms'],
      explainDescription: null,
      violateRules: null,
      emphasis: [],
      parent: '2',
      container: false,
      core: false,
      parentId: '2',
      type: ''
    },
    {
      id: '10',
      label: '10',
      profileDescription: [],
      explainDescription: null,
      violateRules: null,
      emphasis: [],
      parent: null,
      container: true,
      core: true,
      parentId: '',
      type: 'group'
    },
    {
      id: '11',
      label: '11',
      profileDescription: [
        'Active: 31.477ms',
        'NonChild: 0.69%',
        'Address: 10.224.202.37:9060',
        'Instance Id: e57d8e0006a64314-8e41e68327e717df',
        'AverageThreadTokens: 0.00',
        'FragmentCpuTime: 800.6us',
        'MemoryLimit: 2.00 GB',
        'PeakMemoryUsage: 34.06 MB',
        'PeakReservation: 34.00 MB',
        'PeakUsedReservation: 0.00',
        'RowsProduced: 0'
      ],
      explainDescription: null,
      violateRules: null,
      emphasis: ['RowsProduced: 0'],
      parent: '10',
      container: true,
      core: true,
      parentId: '10',
      type: 'group'
    },
    {
      id: '12',
      label: 'DataStreamSender(dst_id=4)',
      profileDescription: [
        'Active: 17.622us',
        'NonChild: 0.01%',
        'Dest Id: 4',
        'Dest Instance Id: e57d8e0006a64314-8e41e68327e717de',
        'BytesSent: 0.00',
        'IgnoreRows: 0',
        'OverallThroughput: 0.0 /sec',
        'PeakMemoryUsage: 4.00 KB',
        'SerializeBatchTime: 0ns',
        'UncompressedRowBatchSize: 0.00'
      ],
      explainDescription: null,
      violateRules: null,
      emphasis: [],
      parent: '11',
      container: false,
      core: true,
      parentId: '11',
      type: ''
    },
    {
      id: '13',
      label: 'AGGREGATION_NODE 2',
      profileDescription: [
        'Active: 30.139ms',
        'NonChild: 0.41%',
        'Id: 2',
        'Probe Method: HashTable Linear Probing',
        'BuildTime: 7.246us',
        'GetResultsTime: 0ns',
        'HTResize: 0',
        'HTResizeTime: 2.732us',
        'HashBuckets: 0',
        'HashCollisions: 0',
        'HashFailedProbe: 0',
        'HashFilledBuckets: 0',
        'HashProbe: 0',
        'HashTravelLength: 0',
        'LargestPartitionPercent: 0',
        'MaxPartitionLevel: 0',
        'NumRepartitions: 0',
        'PartitionsCreated: 16',
        'PeakMemoryUsage: 34.05 MB',
        'RowsProcessed: 0',
        'RowsRepartitioned: 0',
        'RowsReturned: 0',
        'RowsReturnedRate: 0',
        'SpilledPartitions: 0'
      ],
      explainDescription: [
        'output: count(`city_name`)',
        'group by: `label`, `partition_date`',
        'cardinality: -1',
        'extra: update finalize',
        'name: AGGREGATION_NODE 2'
      ],
      violateRules: null,
      emphasis: ['GetResultsTime: 0ns', 'HashProbe: 0'],
      parent: '11',
      container: false,
      core: true,
      parentId: '11',
      type: ''
    },
    {
      id: '14',
      label: 'OLAP_SCAN_NODE 1',
      profileDescription: [
        'Active: 29.357ms',
        'NonChild: 15.41%',
        'Id: 1',
        'Table Name: test_wmj_2',
        'BlockLookupCacheTime: 0ns',
        'BlockPutCacheTime: 0ns',
        'BytesRead: 0.00',
        'GetNextTime: 29.356ms',
        'MaxWaitScanTime: 116.381us',
        'NumDiskAccess: 1',
        'NumScanners: 1',
        'PeakMemoryUsage: 0.00',
        'RowsRead: 0',
        'RowsReturned: 0',
        'RowsReturnedRate: 0',
        'RowsetNum: 2',
        'RowsetReaderInitTime: 29.12ms',
        'ScannerBatchWaitTime: 29.171ms',
        'ScannerBlockPutTimer: 6.487us',
        'ScannerMaxPendingTimer: 17.197us',
        'ScannerWorkerWaitTime: 18.763us',
        'SegmentNum: 4',
        'StartScanTime: 158.768us',
        'TabletCount : 1',
        'TotalReadThroughput: 0.0 /sec',
        'WaitScanTime: 29.195ms'
      ],
      explainDescription: [
        'TABLE: test_wmj_2',
        "PREAGGREGATION: OFF. Reason: the type of agg on StorageEngine's Key column should only be MAX or MIN.agg expr: count(`city_name`)",
        "PREDICATES: `partition_date` = '2022-10-11'",
        'partitions: 1/1',
        'rollup: test_wmj_2',
        'tabletRatio: 1/1',
        'tabletList: 69878736',
        'cardinality: 528123',
        'avgRowSize: 27.672012',
        'numNodes: 3',
        'name: OLAP_SCAN_NODE 1'
      ],
      violateRules: [
        "Rule{rules=[[pattern has \"O\"]('0:Rollup' equal '0:Table' and '0:IndexSum' > 1)], desc='未命中Rollup'}",
        "Rule{rules=[[pattern has \"O\"]('0:Partitions' > 0.9)], desc='查全表'}"
      ],
      emphasis: [
        'BytesRead: 0.00',
        'RowsRead: 0',
        'RowsReturned: 0',
        'ScannerBatchWaitTime: 29.171ms',
        'ScannerWorkerWaitTime: 18.763us'
      ],
      parent: '11',
      container: false,
      core: true,
      parentId: '11',
      type: ''
    },
    {
      id: '15',
      label: 'OlapScanner',
      profileDescription: [
        'Id: 1',
        'Table Name: test_wmj_2',
        'BlockConvertTime: 0ns',
        'BlockFetchTime: 2.895us',
        'ReaderInitTime: 29.60ms',
        'RowsDelFiltered: 0',
        'RowsPushedCondFiltered: 0',
        'ScanCpuTime: 1.724ms',
        'ScanTime: 357ns',
        'ShowHintsTime_V1: 0ns'
      ],
      explainDescription: [
        'TABLE: test_wmj_2',
        "PREAGGREGATION: OFF. Reason: the type of agg on StorageEngine's Key column should only be MAX or MIN.agg expr: count(`city_name`)",
        "PREDICATES: `partition_date` = '2022-10-11'",
        'partitions: 1/1',
        'rollup: test_wmj_2',
        'tabletRatio: 1/1',
        'tabletList: 69878736',
        'cardinality: 528123',
        'avgRowSize: 27.672012',
        'numNodes: 3',
        'name: OLAP_SCAN_NODE 1'
      ],
      violateRules: [
        "Rule{rules=[[pattern has \"O\"]('0:Rollup' equal '0:Table' and '0:IndexSum' > 1)], desc='未命中Rollup'}",
        "Rule{rules=[[pattern has \"O\"]('0:Partitions' > 0.9)], desc='查全表'}"
      ],
      emphasis: [
        'ReaderInitTime: 29.60ms',
        'RowsPushedCondFiltered: 0',
        'ScanTime: 357ns'
      ],
      parent: '11',
      container: false,
      core: true,
      parentId: '11',
      type: ''
    },
    {
      id: '16',
      label: 'SegmentIterator',
      profileDescription: [
        'Id: 1',
        'Table Name: test_wmj_2',
        'BitmapIndexFilterTimer: 0ns',
        'BlockLoadTime: 0ns',
        'BlockSeekCount: 0',
        'BlockSeekTime: 0ns',
        'BlocksLoad: 0',
        'CachedPagesNum: 0',
        'CompressedBytesRead: 0.00',
        'DecompressorTimer: 0ns',
        'IOTimer: 0ns',
        'IndexLoadTime_V1: 0ns',
        'NumSegmentFiltered: 4',
        'NumSegmentTotal: 4',
        'RawRowsRead: 0',
        'RowsBitmapIndexFiltered: 0',
        'RowsBloomFilterFiltered: 0',
        'RowsConditionsFiltered: 0',
        'RowsKeyRangeFiltered: 0',
        'RowsStatsFiltered: 0',
        'RowsVectorPredFiltered: 0',
        'TotalPagesNum: 0',
        'UncompressedBytesRead: 0.00',
        'VectorPredEvalTime: 0ns'
      ],
      explainDescription: [
        'TABLE: test_wmj_2',
        "PREAGGREGATION: OFF. Reason: the type of agg on StorageEngine's Key column should only be MAX or MIN.agg expr: count(`city_name`)",
        "PREDICATES: `partition_date` = '2022-10-11'",
        'partitions: 1/1',
        'rollup: test_wmj_2',
        'tabletRatio: 1/1',
        'tabletList: 69878736',
        'cardinality: 528123',
        'avgRowSize: 27.672012',
        'numNodes: 3',
        'name: OLAP_SCAN_NODE 1'
      ],
      violateRules: [
        "Rule{rules=[[pattern has \"O\"]('0:Rollup' equal '0:Table' and '0:IndexSum' > 1)], desc='未命中Rollup'}",
        "Rule{rules=[[pattern has \"O\"]('0:Partitions' > 0.9)], desc='查全表'}"
      ],
      emphasis: [
        'BlockLoadTime: 0ns',
        'IOTimer: 0ns',
        'RawRowsRead: 0',
        'UncompressedBytesRead: 0.00'
      ],
      parent: '11',
      container: false,
      core: true,
      parentId: '11',
      type: ''
    }
  ],
  edges: [
    {
      fromNodeId: '12',
      toNodeId: '5'
    },
    {
      fromNodeId: '13',
      toNodeId: '12'
    },
    {
      fromNodeId: '14',
      toNodeId: '13'
    },
    {
      fromNodeId: '4',
      toNodeId: '3'
    },
    {
      fromNodeId: '15',
      toNodeId: '14'
    },
    {
      fromNodeId: '5',
      toNodeId: '4'
    },
    {
      fromNodeId: '16',
      toNodeId: '15'
    },
    {
      fromNodeId: '6',
      toNodeId: '4'
    },
    {
      fromNodeId: '7',
      toNodeId: '6'
    },
    {
      fromNodeId: '8',
      toNodeId: '7'
    },
    {
      fromNodeId: '9',
      toNodeId: '6'
    }
  ]
}
