import React, { Component } from 'react';
import { Button, List, SearchBar, Toast } from 'antd-mobile';
import ReactDOM from 'react-dom';
import { PersonIcon } from '../../components/index.js';
import { Bread } from '../../components/General/index';
import style from './index.less';

export default class PersonContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: document.documentElement.clientHeight,
      value: props.search || '',
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
    const { search } = props;
    const oldsearch = this.props;
    if (search !== undefined && search !== oldsearch) {
      this.setState({
        value: search,
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

 handleOk = () => {
   const { selected, selectOk } = this.props;
   console.log('min', selected.min);
   if (selected.num < selected.min) {
     Toast.info(`请至少选择${selected.min}个`, 1.5);
   } else {
     selectOk();
   }
 }
 render() {
   const {
     bread = [],
     children, fetchDataSource, multiple, all = true,
     name, selected, checkedAll, checkAble, handleBread, isFinal = false,
   } = this.props;
   return (
     <div className={style.con}>
       <div className={style.header}>
         <SearchBar
           value={this.state.value}
           placeholder="请输入名称"
           showCancelButton={this.state.value}
           onChange={this.onChange}
           onCancel={
                this.state.value ? this.onCancel :
                  () => { }
              }
           onSubmit={this.onSubmit}
         />
         {this.state.value || isFinal || !bread.length ? null : (
           <Bread
             bread={bread}
             handleBread={handleBread}
           />
          )}
         {this.state.value || isFinal || !all ? null : (
           <div style={{ borderBottom: '1px solid rgb(245, 245, 245)' }}>
             <List >
               <List.Item
                 arrow="horizontal"
                 onClick={fetchDataSource}
               >全部
               </List.Item>
             </List>
           </div>
          )}
         {multiple && !this.state.value ? (
           <div className={style.action}>
             <div className={style.action_item}>
               <div
                 className={[style.item, checkAble ? style.checked : null].join(' ')}
                 onClick={checkedAll}
               >
                 <span>全选</span>
               </div>
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
                      <PersonIcon
                        key={idx}
                        value={item}
                        nameKey={name}
                        showNum={2}
                        itemStyle={{ marginBottom: 0 }}
                        footer={false}
                      />
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

PersonContainer.defaultProps = {
  multiple: false,
  name: 'name',
  checkAble: false,
};
