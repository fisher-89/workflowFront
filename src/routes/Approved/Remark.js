
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, TextareaItem, WhiteSpace, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { PersonIcon } from '../../components';
import { getUrlParams } from '../../utils/util';
import style from './index.less';
import styles from '../common.less';

@createForm()
@connect()
export default class Remark extends Component {
  state={
    params: {},
    type: 1, // 1:转交2:审批
  }
  componentWillMount() {
    const urlParams = getUrlParams();
    const params = JSON.parse(urlParams.params);
    const { type } = urlParams;
    this.setState({
      params,
      type: type || 1,
    });
  }

  remove = () => {
    const { history } = this.props;
    history.goBack(-1);
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    const { params, type } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (`${type}` === '1') {
          dispatch({
            type: 'approve/doDeliver',
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
                this.optCback(datas, () => {
                  window.history.go(-2);
                });
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
                this.optCback(datas, () => {
                  window.history.go(-1);
                });
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
                this.optCback(datas, () => {
                  window.history.go(-1);
                });
              },
            },
          });
        }
      }
    });
  }

  optCback = (datas, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/resetStart',
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
    const { getFieldProps } = this.props.form;
    const urlParams = getUrlParams();
    const { type } = urlParams;
    const params = JSON.parse(urlParams.params);
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
                footer={false}
                handleClick={this.remove}
              />
            </Flex>
          </div>
          )}
          <WhiteSpace size="md" />
          <TextareaItem
            placeholder="请输入备注"
            {...getFieldProps('remark')}
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
