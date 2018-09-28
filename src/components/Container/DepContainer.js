import React, { Component } from 'react';
import { Button, SearchBar, Switch, Toast } from 'antd-mobile';
import ReactDOM from 'react-dom';
// import { PersonIcon } from '../../components/index.js';
import { Bread } from '../../components/General/index';
import style from './index.less';

export default class DepContainer extends Component {
  constructor(props) {
    super(props);
    const { switchState } = props;
    this.state = {
      value: '',
      switchState,
      height: document.documentElement.clientHeight,
    };
  }

  componentDidMount() {
    const htmlDom = ReactDOM.findDOMNode(this.ptr);
    const offetTop = htmlDom.getBoundingClientRect().top;
    const hei = this.state.height - offetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
  }

  componentWillReceiveProps(props) {
    const oldSwitchState = this.props.switchState;
    const { switchState } = props;
    if (switchState !== oldSwitchState) {
      this.setState({
        switchState,
      });
    }
  }

  onChange = (value) => {
    const { searchOncancel, handleSearch } = this.props;
    this.setState({ value });
    if (value === '') {
      searchOncancel();
    } else {
      handleSearch(value);
    }
  };

  onSubmit = () => {
    const { handleSearch } = this.props;
    handleSearch(this.state.value);
  }

  onCancel = () => {
    const { searchOncancel } = this.props;
    this.setState({
      value: '',
    }, () => {
      searchOncancel();
    });
  }

  handleSwitchChange = (check) => {
    const { onSwitchChange } = this.props;
    this.setState({
      switchState: check,
    });
    onSwitchChange(check);
  }

  handleOk = () => {
    const { selected, selectOk } = this.props;
    if (selected.num < selected.min) {
      Toast.info(`请至少选择${selected.min}个`, 1.5);
    } else {
      selectOk();
    }
  }

  render() {
    const {
      bread = [], children, multiple, name, selected, checkedAll, checkAble,
      handleBread,
    } = this.props;
    const { switchState } = this.state;
    return (
      <div className={style.con}>
        <div className={style.header}>
          <SearchBar
            value={this.state.value}
            placeholder="请输入部门名称"
            showCancelButton={this.state.value}
            onChange={this.onChange}
            onCancel={
              this.state.value ? this.onCancel :
                () => { }
            }
            onSubmit={this.onSubmit}
          />
          {(this.state.value || !bread.length) ? null : (
            <Bread
              bread={bread}
              handleBread={handleBread}
            />
          )}
          {multiple && !this.state.value ? (
            <div className={style.seldep_item}>
              <div
                className={checkAble ? style.checked : style.unchecked}
                onClick={() => checkedAll(!checkAble)}
              >
                <span>全选</span>
              </div>
              <div className={style.right}>
                <span style={{ marginRight: '15px' }}>包含下级</span>
                <Switch
                  checked={switchState}
                  color="rgb(0,122,255)"
                  onClick={this.handleSwitchChange}
                />
              </div>
            </div>

          ) : null}
        </div>
        <div
          className={style.con_content}
          ref={(e) => { this.ptr = e; }}
          style={{ overflow: 'auto', height: this.state.height }}
        >
          {children}
        </div>
        {
          multiple ? (
            <div className={style.footer}>
              <div className={style.sel_result}>
                <div className={style.person_list}>
                  {selected.data.map((item, i) => {
                    const idx = i;
                    return (
                      <span style={{ flexShrink: 0 }} key={idx}>{item[name]}、</span>
                    );
                  })}
                </div>
                <div className={style.opt}>
                  <Button
                    size="small"
                    type={selected.num > selected.total ? 'dashed' : 'primary'}
                    disabled={selected.num > selected.total}
                    onClick={this.handleOk}
                  >
                    {selected.num}/{selected.total}确认
                  </Button>
                </div>
              </div>
            </div>
          ) : null
        }

      </div>
    );
  }
}

DepContainer.defaultProps = {
  multiple: false,
  name: 'name',
  checkAble: false,
};
