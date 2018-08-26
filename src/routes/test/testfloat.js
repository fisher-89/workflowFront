import React from 'react';
import { Button } from 'antd-mobile';
import { connect } from 'dva';
import './index.less';

@connect(({ formSearchStaff, loading }) => ({ formSearchStaff, loading }))
class Test extends React.Component {
  selComponentCb = (data) => {
    // const { dispatch } = this.props;
    console.log('data', data);
  }

  fetchDataSource = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'formSearchStaff/fetchSelfDepStaff',
      payload,
    });
  }

  selperson = () => {
    const { dispatch, history } = this.props;
    dispatch({
      type: 'formSearchStaff/saveCback',
      payload: {
        key: 'flowstaff',
        cb: this.selComponentCb,
      },
    });
    dispatch({
      type: 'formSearchStaff/saveFetch',
      payload: {
        key: 'flowstaff',
        fetch: this.fetchDataSource,
      },
    });
    history.push('/form_sel_person/flowstaff/2');
  }

  renderSelectPerson = () => {
    const { formSearchStaff: { flowstaff } } = this.props;
    const { data } = flowstaff || {};
    return (data || []).map(item => item.staff_name || item.realname);
  }

  render() {
    return (
      <div>
        <Button onClick={this.selperson}>选人</Button>
        <div>已选择人员：{this.renderSelectPerson()}</div>
      </div>
    );
  }
}

export default Test;
