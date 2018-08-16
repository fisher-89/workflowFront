import {
    format,
    delay
} from 'roadhog-api-doc';

const localIp= 'http://192.168.20.16:8006'
const test= 'http://112.74.177.132:8006'
const host= test;

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const proxy = {
    // 支持值为 Object 和 Array
    'GET /api/list': [{
        "id": 1,
        "name": "报销流程",
        "description": "报销流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 2,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 3,
        "name": "请假流程",
        "description": "请假流程描述"
    }, {
        "id": 4,
        "name": "请假流程",
        "description": "请假流程描述"
    }],
    'GET /api/start/1': {
        "step": {
            "id": 73,
            "name": "步骤1",
            "description": "这是步骤1",
            "flow_id": 4,
            "step_key": 1,
            "hidden_fields": [
                "expense.*.is_audited",
                "description"
            ],
            "editable_fields": [
                "expense.*.is_approverd",
                "expense.*.description",
                "expense.*.date",
                "remark",
                "bill",
                "arrtype",
                "type",
                "date",
                "datetime"
            ],
            "required_fields": [
                "expense.*.is_approverd",
                "remark"
            ],
        },
        "form_data": {
            "id": 35,
            "run_id": 44,
            "description": null,
            "remark": "测",
            "sunMonery": null,
            "created_at": null,
            "updated_at": null,
            "deleted_at": null,
            "bill": [],
            "arrtype": ['1', '2'],
            "type": '飞机',
            "type2": ['1', '2'],
            "type3": '1',
            datetime:null,
            "img": ['https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png', 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png', 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png', 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png', 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'],
            "date": '2017-8-12',
            "expense": [{
                "id": 6,
                "run_id": 44,
                "description": '哈哈',
                "date": null,
                "type": null,
                "send_cost": null,
                "audited_cost": null,
                "is_approverd": 0,
                "is_audited": null,
                "data_id": 35,
                "created_at": null,
                "updated_at": null,
                "deleted_at": null
            }],
            "department": []
        },
        "fields": {
            "form": [{
                "key": "description",
                "name": "描述",
                "description": "报销描述",
                "type": "text",
                "min": "",
                "max": "100",
                "scale": 0,
            }, {
                "key": "img",
                "name": "图片展示",
                "description": "报销描述",
                "type": "file",
                "min": "",
                "max": "100",
                "scale": 0,
            }, {
                "key": "datetime",
                "name": "datetime",
                "description": "报销描述",
                "type": "datetime",
                "min": "",
                "max": "100",
                "scale": 0,
            },  
            {
                "key": "type",
                "name": "分类",
                "description": "分类",
                "type": "int",
                "min": "",
                "max": "100",
                "scale": 0,
                "options": ['火车','飞机']
            }, {
                "key": "type3",
                "name": "单选展示",
                "description": "分类",
                "type": "int",
                "min": "",
                "max": "100",
                "scale": 0,
                "options": [{
                    name: '火车',
                    value: '1'
                }, {
                    name: '飞机',
                    value: '2'
                }, {
                    name: '火箭',
                    value: '3'
                }, {
                    name: '坦克',
                    value: '4'
                }, {
                    name: '坦克',
                    value: '5'
                }, {
                    name: '飞机',
                    value: '6'
                }, {
                    name: '火箭',
                    value: '7'
                }, {
                    name: '坦克',
                    value: '8'
                }, ]
            }, {
                "key": "type2",
                "name": "只读数组",
                "description": "分类",
                "type": "array",
                "min": "",
                "max": "100",
                "scale": 0,
                "options": [{
                    name: '火车',
                    value: '1'
                }, {
                    name: '飞机',
                    value: '2'
                }, {
                    name: '火箭',
                    value: '3'
                }, {
                    name: '坦克',
                    value: '4'
                }, {
                    name: '坦克',
                    value: '5'
                }, {
                    name: '飞机',
                    value: '6'
                }, {
                    name: '火箭',
                    value: '7'
                }, {
                    name: '坦克',
                    value: '8'
                }, ]
            }, {
                "key": "arrtype",
                "name": "数组分类",
                "description": "数组分类",
                "type": "array",
                "min": "",
                "max": "100",
                "scale": 0,
                "options": [{
                    name: '火车哈哈哈哈',
                    value: '1'
                }, {
                    name: '飞机',
                    value: '2'
                }, {
                    name: '火箭',
                    value: '3'
                }, {
                    name: '坦克',
                    value: '4'
                }, {
                    name: '火车',
                    value: '5'
                }, {
                    name: '飞机',
                    value: '6'
                }, {
                    name: '火箭',
                    value: '7'
                }, {
                    name: '坦克',
                    value: '8'
                }, ]
            }, {
                "key": "remark",
                "name": "备注",
                "description": "报销备注",
                "type": "text",
                "min": "",
                "max": "200",
                "scale": 0,
            }, {
                "key": "date",
                "name": "日期",
                "description": "日期",
                "type": "date",
                "min": "",
                "max": "200",
                "scale": 0,
            }, {
                "key": "datetime",
                "name": "日期时间",
                "description": "日期时间",
                "type": "datetime",
                "min": "",
                "max": "200",
                "scale": 0,
            }, {
                "key": "time",
                "name": "时间",
                "description": "时间",
                "type": "time",
                "min": "",
                "max": "200",
                "scale": 0,
            }, {
                "key": "bill",
                "name": "发票",
                "description": "发票",
                "type": "file",
                "min": "",
                "max": "200",
                "scale": 0,
            }, ],
            "grid": [{
                "key": "expense",
                "name": "消费明细",
                "fields": [{
                    "id": 398,
                    "key": "description",
                    "name": "明细描述",
                    "description": "明细描述",
                    "type": "text",
                    "min": "",
                    "max": "100",
                    "scale": 0,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 0,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-06 10:18:19",
                    "deleted_at": null,
                    "validator_id": [
                        1
                    ],
                    "validator": [{
                        "id": 1,
                        "name": "手机",
                        "description": "验证手机",
                        "type": "regex",
                        "params": "/^1[3456789]\\d{9}$/",
                        "is_locked": 0,
                        "created_at": "2018-04-19 17:20:40",
                        "updated_at": "2018-04-19 17:22:43",
                        "deleted_at": null,
                        "pivot": {
                            "field_id": 398,
                            "validator_id": 1
                        }
                    }]
                }, {
                    "id": 399,
                    "key": "date",
                    "name": "明细日期",
                    "description": "明细日期",
                    "type": "date",
                    "min": "",
                    "max": "",
                    "scale": 0,
                    "default_value": "{{year}}-{{month}}-{{day}}",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 2,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 400,
                    "key": "type",
                    "name": "明细分类",
                    "description": "明细分类",
                    "type": "int",
                    "min": "",
                    "max": "2",
                    "scale": 0,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 3,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": [],
                    "options": [{
                        name: '火车',
                        value: '1'
                    }, {
                        name: '飞机',
                        value: '2'
                    }]
                }, {
                    "id": 401,
                    "key": "send_cost",
                    "name": "提交金额",
                    "description": "申请提交金额",
                    "type": "int",
                    "min": "",
                    "max": "10",
                    "scale": 2,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 4,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 402,
                    "key": "audited_cost",
                    "name": "审核金额",
                    "description": "审核金额",
                    "type": "int",
                    "min": "",
                    "max": "10",
                    "scale": 2,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 5,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 403,
                    "key": "is_approverd",
                    "name": "是否审批",
                    "description": "是否审批",
                    "type": "int",
                    "min": "",
                    "max": "2",
                    "scale": 0,
                    "default_value": "0",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 6,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 404,
                    "key": "is_audited",
                    "name": "是否审核",
                    "description": "是否审核",
                    "type": "int",
                    "min": "",
                    "max": "2",
                    "scale": 0,
                    "default_value": "0",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 7,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }]
            }, {
                "key": "department",
                "name": "部门",
                "fields": [{
                    "id": 398,
                    "key": "description",
                    "name": "明细描述",
                    "description": "明细描述",
                    "type": "text",
                    "min": "",
                    "max": "100",
                    "scale": 0,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 0,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-06 10:18:19",
                    "deleted_at": null,
                    "validator_id": [
                        1
                    ],
                    "validator": [{
                        "id": 1,
                        "name": "手机",
                        "description": "验证手机",
                        "type": "regex",
                        "params": "/^1[3456789]\\d{9}$/",
                        "is_locked": 0,
                        "created_at": "2018-04-19 17:20:40",
                        "updated_at": "2018-04-19 17:22:43",
                        "deleted_at": null,
                        "pivot": {
                            "field_id": 398,
                            "validator_id": 1
                        }
                    }]
                }, {
                    "id": 399,
                    "key": "date",
                    "name": "明细日期",
                    "description": "明细日期",
                    "type": "date",
                    "min": "",
                    "max": "",
                    "scale": 0,
                    "default_value": "{{year}}-{{month}}-{{day}}",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 2,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 400,
                    "key": "type",
                    "name": "明细分类",
                    "description": "明细分类",
                    "type": "int",
                    "min": "",
                    "max": "2",
                    "scale": 0,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 3,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 401,
                    "key": "send_cost",
                    "name": "提交金额",
                    "description": "申请提交金额",
                    "type": "int",
                    "min": "",
                    "max": "10",
                    "scale": 2,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 4,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 402,
                    "key": "audited_cost",
                    "name": "审核金额",
                    "description": "审核金额",
                    "type": "int",
                    "min": "",
                    "max": "10",
                    "scale": 2,
                    "default_value": "",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 5,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 403,
                    "key": "is_approverd",
                    "name": "是否审批",
                    "description": "是否审批",
                    "type": "int",
                    "min": "",
                    "max": "2",
                    "scale": 0,
                    "default_value": "0",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 6,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }, {
                    "id": 404,
                    "key": "is_audited",
                    "name": "是否审核",
                    "description": "是否审核",
                    "type": "int",
                    "min": "",
                    "max": "2",
                    "scale": 0,
                    "default_value": "0",
                    "is_editable": 0,
                    "form_id": 41,
                    "form_grid_id": 76,
                    "sort": 7,
                    "created_at": "2018-04-21 17:25:22",
                    "updated_at": "2018-05-04 10:10:17",
                    "deleted_at": null,
                    "validator_id": [],
                    "validator": []
                }]
            }, ]
        }
    },
    'POST /api/approval/list': {
        "current_page": 1,
        "data": [{
                "id": 1,
                acted_at: '2018.9.12',
                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 2,
                acted_at: '2018.9.12',

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 3,
                acted_at: '2018.9.12',

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 4,
                acted_at: '2018.19.12',

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 5,
                acted_at: '2018.1.12',

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",
                }
            }, {
                "id": 6,
                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",
                }
            }, {
                "id": 7,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 8,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 9,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 10,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 11,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 12,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            }, {
                "id": 13,

                "flow_run": {
                    "id": 2,
                    "flow_id": 5,
                    "form_id": 4,
                    "name": "王五",

                }
            },

        ],
        "first_page_url": "http://192.168.20.144:8002/api/approval/list?page=1",
        "from": 1,
        "last_page": 2,
        "last_page_url": "http://192.168.20.144:8002/api/approval/list?page=1",
        "next_page_url": null,
        "path": "http://192.168.20.144:8002/api/approval/list",
        "per_page": 15,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
export default !noProxy ? {
    // 'POST /api/approval/(.*)': 'http://192.168.20.144:8002/api/approval',
    'GET /api/oa/(.*)': `http://112.74.177.132:8002/api/`,
    'GET /api/(.*)': `${host}/api/`,
    'POST /api/(.*)': `${host}/api/`,
    'PATCH /api/(.*)': `${host}/api/`,
    'PUT /api/(.*)': `${host}/api/`,
    'DELETE /api/(.*)': `${host}/api/`,
    // 'POST /oauth/(.*)': 'http://localhost.oaupdate.org/oauth/',
    'POST /oauth/(.*)': 'http://112.74.177.132:8002/oauth/',

} : delay(proxy, 1000)
