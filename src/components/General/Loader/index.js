import Loader from './Loader';

export default function spin(spinning = false) {
  const loading = document.getElementById('global_loading');
  if (loading) {
    if (spinning) {
      loading.className = 'loader fullScreen';
    } else {
      loading.className = 'loader fullScreen hidden';
    }
  }
}
export { Loader };

