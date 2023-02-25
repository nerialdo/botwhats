import '../styles/globals.css';
import '../utils/antDesignStyles.less';
import {AuthProvider} from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
