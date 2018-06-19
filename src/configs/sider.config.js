module.exports = {
  menus: [
    {
      id: '1',
      name: '账户管理',
      icon: 'contacts',
      route: '/user/list/1',
    },
    {
      id: '2',
      name: '学校管理',
      icon: 'idcard',
      route: '/school/list/1',
    },
    // {
    //   id: '3',
    //   icon: 'tool',
    //   name: '角色管理',
    //   route: '/role/list/1'
    // },
    {
      id: '4',
      name: '班级管理',
      icon: 'usergroup-add',
      route: '/class/list/1',
    },
    {
      id: '5',
      name: '职业测评管理',
      icon: 'dot-chart',
      sub: [
        {
          id: '5_1',
          name: '职业管理',
          icon: 'database',
          route: '/career/list/1',
        },
        {
          id: '5_2',
          name: '国内学科管理',
          icon: 'book',
          route: '/inlandSubject/list/1',
        },
        {
          id: '5_3',
          name: '国外学科管理',
          icon: 'book',
          route: '/foreignSubject/list/1',
        },
      ],
    },
    {
      id: '6',
      name: '留言管理',
      icon: 'profile',
      route: '/message/list/1',
    },
    {
      id: '7',
      name: '订单管理',
      icon: 'shopping-cart',
      route: '/organ/list/1',
    },
  ],

  openkeys: {
    user: { key: '1', sub: '1_1', name: '账户' },
    school: { key: '2', name: '学校' },
    role: { key: '3', name: '角色' },
    class: { key: '4', name: '班级' },
    career: { key: '5', name: '职业' },
    // career: { key: '5', name: '职业测评', sub: '5_1' },
    message: { key: '6', name: '留言' },
    student: { key: '7', name: '订单' },
  },
};
