import Mock from 'mockjs'
const count = 500
const List = []
function mockData () {
  return Mock.mock({
    children: [
      {
        created_at: '@date',
        name: "@csentence(5)",
        'status|1': ['published', 'draft', 'deleted'],
        obj_name: "p01",
        id: i,
      }
    ],
    created_at: '@date',
    'delay_time|1-100': 100,
    depends: [],
    executor: "@name(true)",
    fsid: "@guid",
    id: "@id",
    name: "@csentence(5)",
    obj_name: "p01",
    operator: "@id",
    parent: null,
    progress: "number|1-10",
    result: {retcode: "", stdout: ""},
    retry: '@integer(1, 3)',
    rollback_parameter: {},
    run_status: "completed",
    run_step: "PeriodUpdate",
    'run_type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    'task_type|1-10': 10,
    uuid: "@guid",
  })
}
for (var i = 0; i < count; i++) {
  List.push(mockData())
}


export default [
  {
    url: '/vue-admin-template/delaytask/list',
    type: 'get',
    response: (config) => {
      const { currentPage, pagesize } = config.query

      const pageList = List.filter((item, index) => index < pagesize * currentPage && index >= pagesize * (currentPage - 1))
      return {
        code: 20000,
        data: {
          pageVo: {
            total: List.length,
            currentPage: Number(currentPage),
            pagesize: Number(pagesize)
          },
          items: pageList
        }
      }
    }
  }
]
