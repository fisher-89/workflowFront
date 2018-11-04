import { Component } from 'react';

class scrollInfo extends Component {
  excuteScrollTo = (id = 'con_content') => {
    const content = document.getElementById(id);
    const scrollTop = sessionStorage.scrollTop || 0;
    if (content) {
      content.scrollTop = scrollTop;
    }
  }

  saveScrollTop = (content) => {
    console.log('saveScrollTop', content);
    if (content) {
      const { scrollTop } = content;
      sessionStorage.scrollTop = scrollTop;
      console.log('scrollTop', scrollTop);
    }
  }

  clearScrollTop = () => {
    sessionStorage.scrollTop = 0;
  }
}

export default scrollInfo;

