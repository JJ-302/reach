export default [
  {
    name: 'project_1',
    members: [
      { name: 'member_1' },
      { name: 'member_2' },
    ],
    tasks: [
      {
        id: '1',
        title: 'task_1',
        startDate: '2019/11/01',
        endDate: '2019/11/30',
        duration: 30,
        percentComplete: 50,
        member_tasks: [
          { name: 'member_1' },
        ],
      }, {
        id: '2',
        title: 'task_2',
        startDate: '2019/11/01',
        endDate: '2019/11/30',
        duration: 30,
        percentComplete: 50,
        member_tasks: [
          { name: 'member_2' },
        ],
      }, {
        id: '3',
        title: 'task_3',
        startDate: '2019/11/01',
        endDate: '2019/11/30',
        duration: 30,
        percentComplete: 50,
        member_tasks: [
          { name: 'member_1' },
          { name: 'member_2' },
        ],
      },
    ],
  }, {
    name: 'project_2',
    members: [
      { name: 'member_2' },
      { name: 'member_3' },
      { name: 'member_4' },
    ],
    tasks: [
      {
        id: '4',
        title: 'task_4',
        startDate: '2019/11/01',
        endDate: '2019/11/30',
        duration: 30,
        percentComplete: 50,
        member_tasks: [
          { name: 'member_2' },
        ],
      }, {
        id: '5',
        title: 'task_5',
        startDate: '2019/11/01',
        endDate: '2019/11/30',
        duration: 30,
        percentComplete: 50,
        member_tasks: [
          { name: 'member_2' },
          { name: 'member_3' },
        ],
      }, {
        id: '6',
        title: 'task_6',
        startDate: '2019/11/01',
        endDate: '2019/11/30',
        duration: 30,
        percentComplete: 50,
        member_tasks: [
          { name: 'member_2' },
          { name: 'member_3' },
          { name: 'member_4' },
        ],
      },
    ],
  },
]
