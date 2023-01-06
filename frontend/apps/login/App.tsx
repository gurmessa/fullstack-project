import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'store/store'
import { Login } from 'components/login/Login'
import styles from './styles/App.scss'
import 'style/global.scss'
import 'style/antd/customAntd.less'

const App = () => {
  return (
    <div className={styles.loginApp}>
      <Login />
    </div>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
)
