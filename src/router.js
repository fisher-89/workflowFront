import React from 'react';
import {
  routerRedux,
  Redirect,
  Route,
  Switch,
} from 'dva/router';
import dynamic from 'dva/dynamic';
import App from './routes/app.js';

const {
  ConnectedRouter,
} = routerRedux;

function RouterConfig({
  history,
  app,
}) {
  const error = dynamic({
    app,
    component: () =>
      import('./routes/error'),
  });
  const routes = [{
    path: '/home',
    models: () => [],
    component: () =>
      import('./routes/login/IndexPage'),
  },
    // 发起表单
  {
    path: '/table_edit/:id',
    models: () => [
      import('./models/start'),
    ],
    component: () =>
      import('./routes/TableEdit/TableEdit'),
  },
  {
    path: '/start_grid/:type/:index',
    models: () => [
      import('./models/start'),
    ],
    component: () =>
      import('./routes/TableEdit/StartGridDetail'),
  },
  {
    path: '/addgridlist/:type/:index',
    models: () => [import('./models/start')],
    component: () =>
      import('./routes/TableEdit/AddGridList'),
  }, {
    path: '/approvelist',
    models: () => [
      import('./models/approve'),
    ],
    component: () =>
      import('./routes/Approved/ApproveList'),
  }, {
    path: '/approve/:id',
    models: () => [
      import('./models/approve'),
      import('./models/start'),

    ],
    component: () =>
      import('./routes/Approved/ApproveDetail'),
  }, {
    path: '/approve_grid/:type/:index',
    models: () => [
      import('./models/approve'),
    ],
    component: () =>
      import('./routes/Approved/ApproveGridDetail'),
  }, {
    path: '/approve_grid_edit/:type/:index',
    models: () => [
      import('./models/approve'),
    ],
    component: () =>
      import('./routes/Approved/ApproveEditGrid'),
  },
  {
    path: '/select_step',
    models: () => [
      import('./models/start'),
    ],
    component: () =>
      import('./routes/TableEdit/SelectStep'),
  }, {
    path: '/select_approver/:id',
    models: () => [],
    component: () =>
      import('./routes/TableEdit/SelectApprover'),
  },
  {
    path: '/start_list',
    models: () => [
      import('./models/start'),
    ],
    component: () =>
      import('./routes/TableEdit/StartList'),
  },
  {
    path: '/start_list2',
    models: () => [
      import('./models/start'),
      import('./models/list'),
    ],
    component: () =>
      import('./routes/TableEdit/StartList2'),
  },
  {
    path: '/testlist',
    models: () => [
      import('./models/start'),
      import('./models/list'),
    ],
    component: () =>
      import('./routes/TableEdit/testList'),
  },
  {
    path: '/start_detail/:id',
    models: () => [
      import('./models/start'),
    ],
    component: () =>
      import('./routes/TableEdit/StartDetail'),
  },
  {
    path: '/search_staff/:dep_id',
    models: () => [
      import('./models/start'),
    ],
    component: () =>
      import('./routes/TableEdit/StartDetail'),
  },
  {
    path: '/my',
    models: () => [],
    component: () =>
      import('./routes/My/my'),
  },
  ];
  const speRoutes = [{
    path: '/extrance',
    models: () => [],
    component: () =>
      import('./routes/login/Extrance'),
  }, {
    path: '/get_access_token',
    models: () => [
      import('./models/oauth'),
    ],
    component: () =>
      import('./routes/Oauth/GetAccessToken'),
  }, {
    path: '/refresh_access_token',
    models: () => [
      import('./models/oauth'),
    ],
    component: () =>
      import('./routes/Oauth/RefreshAccessToken'),
  }, {
    path: '/redirect_to_authorize',
    models: () => [
      import('./models/oauth'),
    ],
    component: () =>
      import('./routes/Oauth/RedirectToAuthorize'),
  }];
  return (
    <ConnectedRouter history={history}>
      <Switch>
        {speRoutes.map(({ path, ...dynamics }, key) => {
          const idx = key;
return (
  <Route
    key={idx}
    exact
    path={path}
    component={dynamic({
              app,
              ...dynamics,
            })}
  />
        );
        })}
        <Route
          exact
          path="/"
          render={() => (<Redirect to="/extrance" />)}
        />
        <App>
          <Switch>
            {
              routes.map(({ path, ...dynamics }, key) => {
                const ix = key;
                return (
                  <Route
                    key={ix}
                    exact
                    path={path}
                    component={dynamic({
                    app,
                    ...dynamics,
                  })}
                  />
              );
              })
            }
            <Route component={error} />
          </Switch>
        </App>
      </Switch>

    </ConnectedRouter>
  );
}

export default RouterConfig;
