import React, {
  Component,
} from 'react';
import Animate from 'rc-animate';
import style from './index.less';
// import styles from '../../routes/common.less';

class ListFilter extends Component {
  state = {
    enter: true,
    destroyed: false,
    visible: false,
    exclusive: false,

  }

  selFilter = (feild) => { // 筛选
    this.setState({
      [feild]: !this.state[feild],
    });
  }
  render() {
    const {
      children,
      onCancel,
      onResetForm,
      visible,
      filterKey,
      contentStyle,
    } = this.props;
    const conStyle = { display: visible ? 'block' : 'none', ...contentStyle };
    return (
      <Animate
        component=""
        exclusive={this.state.exclusive}
        showProp="visible"
        transitionAppear
        transitionName="fade"
      >
        <div
          style={conStyle}
          onClick={(e) => { onCancel(e, filterKey); }}
        >
          <div className={style.filter_con}>
            <div
              className={style.con_content}
              onClick={(e) => { e.stopPropagation(); return false; }}
            >
              {children}
            </div>
            <div
              className={style.footer}
              style={{ background: '#f8f6f6' }}
            >
              <div className={style.footer_opt}>
                <a
                  onClick={(e) => { e.stopPropagation(); onResetForm(); return false; }}
                  style={{ color: 'rgb(24,116,208)' }}
                >
                  重置
                </a>
                <a
                  style={{ color: '#fff' }}
                  // onClick={() =>
                  //   onOk(filterKey)
                  // }
                >确定
                </a>
              </div>
            </div>
          </div>
        </div>
      </Animate>
    );
  }
}

export default ListFilter;

