
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, TextareaItem, WhiteSpace, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PersonIcon } from '../../components';
import spin from '../../components/General/Loader';

import { getUrlParams } from '../../utils/util';
import style from './index.less';
import styles from '../common.less';

@createForm()
@connect(({
  loading,
}) => ({
  loading: loading.effects['approve/doDeliver'] || loading.effects['approve/getThrough'] || loading.effects['approve/doReject'],
}))
export default class Remark extends Component {
  state = {
    params: {},
    type: 1, // 1:转交2:审批
  }
  componentWillMount() {
    const urlParams = getUrlParams();
    const params = JSON.parse(urlParams.params);
    const { type, source } = urlParams;
    this.setState({
      params,
      type: type || 1,
      source: source || '',
    });
  }

  remove = () => {
    const { history } = this.props;
    history.goBack(-1);
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    const { params, type, source } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (`${type}` === '1') {
          dispatch({
            type: 'approve/doDeliver',
            payload: {
              params: {
                ...params,
                host: `${window.location.origin}/approve?source=dingtalk`,
                ...values,
              },
              cb: (datas) => {
                // dispatch({
                //   type: 'approve/resetStart',
                // });
                // dispatch({
                //   type: 'list/updateLists',
                //   payload: {
                //     data: datas,
                //     start: '/approvelist_processing',
                //     end: '/approvelist_approved',
                //   },
                // });
                if (source === 'dingtalk') {
                  this.dingtalkCback(-2);
                } else {
                  this.optCback(datas, () => {
                    window.history.go(-3);
                  });
                }
              },
            },
          });
        }
        if (`${type}` === '2') {
          dispatch({
            type: 'approve/getThrough',
            payload: {
              data: {
                ...params,
                ...values,
                host: `${window.location.origin}/approve?source=dingtalk`,
              },
              id: params.flow_id,
              cb: (datas) => {
                // dispatch({
                //   type: 'approve/resetStart',
                // });
                // dispatch({
                //   type: 'list/updateLists',
                //   payload: {
                //     data: datas,
                //     start: '/approvelist_processing',
                //     end: '/approvelist_approved',
                //   },
                // });
                // window.history.go(-1);
                if (source === 'dingtalk') {
                  this.dingtalkCback(-1);
                } else {
                  this.optCback(datas, () => {
                    window.history.go(-2);
                  });
                }
              },
            },
          });
        }
        if (`${type}` === '3') {
          dispatch({
            type: 'approve/doReject',
            payload: {
              params: {
                ...params,
                ...values,
              },
              cb: (datas) => {
                // dispatch({
                //   type: 'approve/resetStart',
                // });
                // dispatch({
                //   type: 'list/updateLists',
                //   payload: {
                //     data: datas,
                //     start: '/approvelist_processing',
                //     end: '/approvelist_approved',
                //   },
                // });
                // window.history.go(-1);
                if (source === 'dingtalk') {
                  this.dingtalkCback(-1);
                } else {
                  this.optCback(datas, () => {
                    window.history.go(-2);
                  });
                }
              },
            },
          });
        }
      }
    });
  }

  dingtalkCback = (index) => {
    const { dispatch, history } = this.props;
    dispatch({
      type: 'approve/resetStart',
    });
    dispatch({
      type: 'start/resetStart',
    });
    history.go(index);
    setTimeout(() => {
      history.push('/approvelist?type=processing&page=1');
    }, 1);
  }

  optCback = (datas, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/resetStart',
    });
    dispatch({
      type: 'start/resetStart',
    });
    dispatch({
      type: 'list/updateLists',
      payload: {
        data: datas,
        start: '/approvelist_processing',
        end: '/approvelist_approved',
      },
    });
    if (cb) {
      cb();
    }
  }

  render() {
    const { loading, form: { getFieldProps } } = this.props;
    const urlParams = getUrlParams();
    const { type } = urlParams;
    const params = JSON.parse(urlParams.params);
    spin(loading);
    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          {`${type}` === '1' && (
            <div className={style.players}>
              <Flex className={style.title} id="participants">
                <Flex.Item>转交给：</Flex.Item>
              </Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <PersonIcon
                  value={params}
                  type="1"
                  nameKey="approver_name"
                  showNum={2}
                  handleClick={this.remove}
                />
              </Flex>
            </div>
          )}
          <WhiteSpace size="md" />
          <TextareaItem
            placeholder="请输入备注"
            {...getFieldProps('remark',
              { initialValue: '' }
            )}
            rows={5}
            count={100}
          />
        </div>
        <div style={{ padding: '10px' }}>
          <Button
            type="primary"
            onClick={this.handleSubmit}
          >确定
          </Button>
        </div>
      </div>
    );
  }
}
