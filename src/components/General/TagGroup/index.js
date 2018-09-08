import React from 'react';
import Tag from './tag.js';
import { isJSON } from '../../../utils/util';
import style from './index.less';

export default class TagGroup extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    let newValue = [];
    if (typeof value === 'object' && value) {
      newValue = value;
    } else {
      newValue = isJSON(value) || [];
    }
    this.state = {
      onEditing: false,
      inputValue: '',
      tags: newValue,
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      inputValue: value,
    });
  }

  handleInputBlur = () => {
    const { inputValue, tags } = this.state;
    let newTags = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    this.setState({
      onEditing: false,
      tags: newTags,
      inputValue: '',
    });
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => `${tag}` !== `${removedTag}`);
    this.setState({ tags });
  }

  editTagValue = (value, index) => {
    const { tags } = this.state;
    tags.splice(index, 1, value);
    this.setState({
      tags,
    });
  }

  showInput = () => {
    this.setState({
      onEditing: true,
    }, () => this.textInput.focus());
  }

  makeTagProps = (value, index) => {
    const { readonly } = this.props;
    const props = {
      value,
      key: index,
      index,
      readonly,
      handleClose: this.handleClose,
      onChange: this.editTagValue,
    };
    return props;
  }

  renderTag = () => {
    const { tags } = this.state;
    return tags.map((item, i) => {
      const props = this.makeTagProps(item, i);
      return (
        <Tag
          {...props}
        />
      );
    });
  }
  render() {
    const { onEditing, inputValue } = this.state;
    const { readonly } = this.props;
    return (
      <div className={style.contain}>
        {this.renderTag()}
        {!readonly && (
        <div className={style.item} style={{ border: '1px dashed #c7c7c7' }}>
          {onEditing && (
          <input
            value={inputValue}
            ref={(e) => { this.textInput = e; }}
            onChange={this.handleInputChange}
            onBlur={this.handleInputBlur}
          />
        )}
          {!onEditing && <p onClick={this.showInput}>+添加</p>}
        </div>
        )}
      </div>
    );
  }
}

TagGroup.defaultProps = {
  readonly: true,
};
