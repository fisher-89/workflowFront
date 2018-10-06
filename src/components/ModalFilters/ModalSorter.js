import React from 'react';
import ReactDOM from 'react-dom';
import { ListSort } from '../../components/index';
import style from './index.less';

class ModalSorter extends React.PureComponent {
  state = {
    height: document.documentElement.clientHeight,
  }

  componentDidMount() {
    const htmlDom = ReactDOM.findDOMNode(this.ptr);
    const offetTop = htmlDom.getBoundingClientRect().top;
    const hei = this.state.height - offetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
  }

  render() {
    const { onChange, data, visible, onCancel, filterKey, top } = this.props;
    return (
      <div className={style.filter_con} ref={(_) => { this.ptr = _; }}>
        <ListSort
          visible={visible}
          onCancel={onCancel}
          top={top}
          filterKey="sortModal"
        >
          {data.map((item, i) => {
            const idx = i;
            return (
              <div
                className={style.sort_item}
                key={idx}
                onClick={(e) => {
                  onCancel(e, filterKey);
                  onChange(item.value);
                }}
              >{item.name}
              </div>
            );
          })}
        </ListSort>
      </div>
    );
  }
}
ModalSorter.defaultProps = {
  data: [],
  visible: false,
  onChange: () => { },
};
export default ModalSorter;
