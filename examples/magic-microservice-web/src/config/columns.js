export const UNKNOW_COLUMN = {
  title: '未知标题',
  width: 100,
  dataIndex: 'unkow_column',
  key: 'unkow_column',
}

// 国际化翻译需要，请勿将该方法改成普通变量
// 如需FIELDS配置请保持同样的写法

export const COLUMNS = () => ({
  action: {
    title: '操作',
    width: 80,
  },
  file: {
    title: '附件',
    width: 80,
  },
  receipt_serial_id: {
    title: '收款流水号',
    width: 110,
    dataIndex: 'serial',
  },
  receipt_beneficiary: {
    title: '收款方',
    dataIndex: 'beneficiary',
    width: 140,
    render: 'text',
  },
  receipt_name: {
    title: '付款方',
    dataIndex: 'name',
    width: 120,
    render: 'text',
  },
  platform_name: {
    title: '平台',
    width: 200,
  },
  receipt_amount: {
    title: '收款金额',
    dataIndex: 'amount',
    width: 110,
    render: 'amount',
  },
  receipt_charge: {
    title: '已充值金额',
    dataIndex: 'charge_amount',
    width: 200,
  },
  ea_trade_no_re: {
    title: '认款平台单号',
    width: 200,
    dataIndex: 'ea_trade_no',
  },
  use_amount: {
    title: '使用金额',
    width: 110,
    render: 'amount',
  },
  receipt_remain: {
    title: '可用金额',
    dataIndex: 'remain_amount',
    width: 110,
    render: 'amount',
  },
  receive_date: {
    title: '收款日期',
    width: 140,
  },
  flow_id: {
    title: '交易订单号',
    width: 150,
    render: 'text',
  },
  account_no: {
    title: '收款账号',
    width: 140,
  },
  opp_account_no: {
    title: '他方资金账号',
    width: 200,
  },
  merchant_no: {
    title: '商户号',
    width: 200,
  },
  lock_status: {
    title: '锁定状态',
    width: 200,
  },
  remark: {
    title: '备注',
    width: 200,
  },
})
