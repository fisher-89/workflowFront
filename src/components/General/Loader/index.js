import Loader from './Loader';

export default function spin(spinning = false, msg = '加载中') {
  const loading = document.getElementById('global_loading');
  const text = document.getElementById('text');
  text.innerText = msg;
  const classNames = ['loader', 'fullScreen'].join(' ');
  // if (!loading) return;
  loading.className = spinning ? classNames : `${classNames} hidden`;
}
export { Loader };

