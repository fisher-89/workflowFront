
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import { List, PullToRefresh } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import nothing from '../../assets/nothing.png';
import SmallLoader from '../General/Loader/SmallLoader';
import spin from '../General/Loader';
import { parseParamsToUrl, getUrlParams } from '../../utils/util';
import { Nothing } from '../index';

let startX;
let startY;

/**
属性      说明
page:      用来判断是否有分页功能
onRefresh  刷新的执行事件，也用来判断是否有刷新效果
onChange   选中回调函数
multiple   false 是否多选
name       require
 */
@connect(({ loading }) => ({ loading }))
export default function ListView(ListItem) {
  class NewItem extends PureComponent {
    state = {
      muti: [],
      height: document.documentElement.clientHeight,
    }

    componentDidMount() {
      if (this.ptr) {
        const htmlDom = ReactDOM.findDOMNode(this.ptr);
        const offetTop = htmlDom.getBoundingClientRect().top;
        const hei = this.state.height - offetTop;
        setTimeout(() => this.setState({
          height: hei,
        }), 0);
      }
    }

    componentWillReceiveProps(nextProps) {
      const { selected } = nextProps;
      if (selected && JSON.stringify(selected) !== JSON.stringify(this.state.muti)) {
        this.setState({
          muti: [...nextProps.selected],
        });
      }
    }

    onRefresh = () => {
      const { history, location: { pathname }, type, onRefresh } = this.props;
      if (type) {
        const url = `${pathname}?type=${type}&page=1&pagesize=10`;
        history.replace(url);
      }
      onRefresh();
    }
    // 返回角度
    GetSlideAngle = (dx, dy) => {
      // Math.atan2返回弧度值
      return (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection = (sX, sY, endX, endY) => {
      const dy = sY - endY;
      const dx = endX - sX;
      let result = 0;
      // 如果滑动距离太短
      // if (Math.abs(dx) < 2 && Math.abs(dy) < 16) {
      //   return result;
      // }
      // 距离小于16，
      if (((dx * dx) + (dy * dy)) < 256) {
        return result;
      }
      // 判断方向
      const angle = this.GetSlideAngle(dx, dy);
      if (angle >= -45 && angle < 45) {
        result = 4;
      } else if (angle >= 45 && angle < 135) {
        result = 1;
      } else if (angle >= -135 && angle < -45) {
        result = 2;
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
      }

      return result;
    }

    doLoadMore = (str) => {
      const { history, totalpage, page, onPageChange } = this.props;
      if (!(page < totalpage)) {
        return false;
      }
      if (str === 'up') {
        if (onPageChange) {
          onPageChange();
        } else {
          const urlParams = getUrlParams();
          const newUrlParams = {
            ...urlParams,
            page: (page - 0) + 1,
          };
          const { location: { pathname } } = this.props;
          const url = parseParamsToUrl(newUrlParams);
          history.replace(`${pathname}?${url}`);
        }
      }
    }

    handleStart = (ev) => {
      startX = ev.touches[0].pageX;
      startY = ev.touches[0].pageY;
    }

    handleEnd = (ev) => {
      const self = this;
      const endX = ev.changedTouches[0].pageX;
      const endY = ev.changedTouches[0].pageY;
      const direction = this.GetSlideDirection(startX, startY, endX, endY);
      switch (direction) {
        case 0:
          self.doLoadMore('no');
          break;
        case 1:
          self.doLoadMore('up');
          break;
        case 2:
          self.doLoadMore('down');
          break;
        case 3:
          self.doLoadMore('left');
          break;
        case 4:
          self.doLoadMore('right');
          break;
        default:
      }
    }

    handlesMultiple = (item) => { // 多选
      const { muti } = this.state;
      const { onChange, name } = this.props;

      let newMuti = [...muti];

      const id = item[name];
      const dataId = muti.map(m => m[name]);
      const idIndex = dataId.indexOf(id);
      if (idIndex !== -1) {
        newMuti = muti.filter((its, index) => index !== idIndex);
      } else {
        newMuti.push(item);
      }
      this.setState({
        muti: [...newMuti],
      }, () => {
        onChange(this.state.muti, item);
      });
    }

    makeListItemProps = (item) => {
      const { muti } = this.state;
      const { multiple, onChange, name, singleSelected } = this.props;
      const response = {
        ...this.props,
        value: item,
      };

      if (!this.props.fetchDataSource && onChange) {
        response.onClick = multiple ? this.handlesMultiple : onChange;
        const dataId = muti.map(m => m[name]);
        response.checked = multiple ?
          dataId.indexOf(item[name]) !== -1 : singleSelected[name] === item[name];
      }
      return response;
    }

    pullDownToRefresh = () => {
      const { offsetBottom } = this.props;
      const height = this.state.height - (offsetBottom || 0);
      return (
        <PullToRefresh
          onRefresh={this.onRefresh}
          style={{ overflow: 'auto', height }}
        >
          {this.renderList()}
        </PullToRefresh>
      );
    }

    renderList = () => {
      const { dataSource, offsetBottom, heightNone,
        loading, onRefresh, totalpage, page = 1 } = this.props;
      const height = this.state.height - (offsetBottom || 0);
      const style = !heightNone ? { style: { minHeight: height } } : null;
      const nothingAble = !heightNone &&
        (!loading.global && ((dataSource && !dataSource.length) || !dataSource));
      const loader = (((!dataSource) || (dataSource && !dataSource.length)
       || (`${page}` === '1'))
       && loading.global);
      spin(loader);
      console.log('nothingAble', nothingAble);
      return (
        <div
          {...(page && { onTouchStart: this.handleStart })}
          {...(page && { onTouchEnd: this.handleEnd })}
          ref={(el) => { this.ptr = el; }}
        >
          {
            nothingAble ? (
              <div {...style}>
                <Nothing src={nothing} />
              </div>
            ) :
              (
                <QueueAnim>
                  <List key="list" {...style}>
                    {dataSource.map((item, i) => {
                      const idx = i;
                      return (
                        <ListItem
                          key={idx}
                          {...this.makeListItemProps(item)}
                        />
                      );
                    })}
                  </List>
                  {!loading.global && onRefresh && page < totalpage &&
                    <div style={{ textAlign: 'center' }}>加载更多</div>
                  }
                  {loading.global && onRefresh && <SmallLoader />}
                </QueueAnim>
              )
          }
        </div>
      );
    }

    render() {
      const { onRefresh } = this.props;
      return (
        <React.Fragment>
          {onRefresh ? this.pullDownToRefresh() : this.renderList()}
        </React.Fragment>
      );
    }
}
NewItem.defaultProps = {
  onRefresh: () => {},
};
return NewItem;
}

