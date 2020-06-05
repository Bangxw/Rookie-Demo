import React from 'react'
import { Router, Route, Switch, Redirect, } from 'react-router-dom'
import { createHashHistory as createHistory, } from 'history'
// import { connect, } from 'react-redux'

import * as base from '@pages/base'

const Routers = [
  { path: '/', name: 'app', component: base.Container, },
  { path: '/notfound', name: 'notFound', component: base.NotFound, },
]

const history = createHistory()

const BasicRoute = () => (
  <Router history={history}>
    <Switch>
      {/* <Route component={base.Container} exact path="/" /> */}
      <Route path="/" render={({ history, location, match, }) => (
        <base.Container history={history} location={location} match={location}>
          {
            Routers.map((item, index) => (
              <Route exact key={index} path={item.path} render={props =>
                (<item.component {...props} />)
              } />
            ))
          }
        </base.Container>
      )} />
      <Redirect to="/404" />
    </Switch>
  </Router>
)

export default BasicRoute;
