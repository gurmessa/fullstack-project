import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store, { useReduxDispatch } from 'store/store'
import 'style/global.scss'
import 'style/antd/customAntd.less'
import { Layout } from 'antd'
import { EssayList } from 'components/feedback/EssayList'
import { Route, Router, Switch } from 'react-router-dom'
import { createHashHistory } from 'history'
import { logoutUser } from 'store/user/userThunks'
import styles from './styles/App.scss'

const history = createHashHistory()

const App = () => {
  const dispatch = useReduxDispatch()

  const logOut = async () => {
    try {
      await dispatch(logoutUser)
      window.location.href = '/'
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Sorry, you could not be logged out.')
    }
  }
  return (
    <Layout className={styles.platformApp}>
      <Layout.Header>
        <div className="logo">
          <img className="logo-img" src="https://d1fdyvfn4rbloo.cloudfront.net/logo/prompt_2019_64px.png" alt="logo" />
        </div>
        <div className="logout">
          <a
            href="#"
            onClick={e => {
              e.preventDefault()
              logOut()
            }}
          >
            Log Out
          </a>
        </div>
      </Layout.Header>
      <Layout.Content className="content">
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={EssayList} />
          </Switch>
        </Router>
      </Layout.Content>
    </Layout>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
)
