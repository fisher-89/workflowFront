import Loader from './Loader';

export default function spin(spinning = false, msg = '加载中') {
  const loading = document.getElementById('global_loading');
  const text = document.getElementById('text');
  text.innerText = msg;
  if (loading) {
    if (spinning) {
      loading.className = 'loader fullScreen';
    } else {
      loading.className = 'loader fullScreen hidden';
    }
  }
}
export { Loader };

