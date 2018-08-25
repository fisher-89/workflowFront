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

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);
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
    // models: () => [],
    models: [],
    component: () =>
      import('./routes/login/IndexPage'),
  },
  // 发起表单
  {
    path: '/table_edit/:id',
    // models: () => [
    //   import('./models/start'),
    // ],
    models: ['start'],
    component: () =>
      import('./routes/TableEdit/TableEdit'),
  },
  {
    path: '/start_grid/:type/:index',
    // models: () => [
    //   import('./models/start'),
    // ],
    models: ['start'],

    component: () =>
      import('./routes/TableEdit/StartGridDetail'),
  },
  {
    path: '/addgridlist/:type/:index',
    // models: () => [import('./models/start')],
    models: ['start'],

    component: () =>
      import('./routes/TableEdit/AddGridList'),
  },
  {
    path: '/approvelist',
    // models: () => [
    //   import('./models/approve'),
    //   import('./models/list'),
    // ],
    models: ['approve', 'list'],

    component: () =>
      import('./routes/Approved/ApproveList'),
  },
  {
    path: '/approve/:id',
    // models: () => [
    //   import('./models/approve'),
    //   import('./models/start'),

    // ],
    models: ['approve', 'start'],

    component: () =>
      import('./routes/Approved/ApproveDetail'),
  }, {
    path: '/approve_grid/:type/:index',
    // models: () => [
    //   import('./models/approve'),
    // ],
    models: ['approve'],

    component: () =>
      import('./routes/Approved/ApproveGridDetail'),
  }, {
    path: '/approve_grid_edit/:type/:index',
    // models: () => [
    //   import('./models/approve'),
    // ],
    models: ['approve'],

    component: () =>
      import('./routes/Approved/ApproveEditGrid'),
  },
  {
    path: '/select_step',
    // models: () => [
    //   import('./models/start'),
    // ],
    models: ['start'],

    component: () =>
      import('./routes/TableEdit/SelectStep'),
  }, {
    path: '/select_approver/:id',
    // models: () => [
    //   import('./models/start'),

    // ],
    models: ['start'],

    component: () =>
      import('./routes/TableEdit/SelectApprover'),
  },
  {
    path: '/start_list',
    // models: () => [
    //   import('./models/start'),
    //   import('./models/list'),
    // ],
    models: ['list', 'start'],

    component: () =>
      import('./routes/TableEdit/StartList'),
  },
  {
    path: '/start_detail/:id',
    // models: () => [
    //   import('./models/start'),
    // ],
    models: ['start'],

    component: () =>
      import('./routes/TableEdit/StartDetail'),
  },
  {
    path: '/search_staff/:dep_id',
    // models: () => [
    //   import('./models/start'),
    // ],
    models: ['start'],

    component: () =>
      import('./routes/TableEdit/StartDetail'),
  },
  {
    path: '/sel_person/:key/:type/:modal',
    // models: () => [
    //   import('./models/searchStaff'),
    //   import('./models/approve'),
    //   import('./models/start'),
    // ],
    models: ['approve', 'start', 'searchStaff'],

    component: () =>
      import('./routes/SelectPlugins/SelPerson'),
  },
  {
    path: '/form_sel_person/:key/:type/:fromto',
    // models: () => [
    //   import('./models/formSearchStaff'),
    // ],
    models: ['formSearchStaff'],

    component: () =>
      import('./routes/SelectPlugins/FormSelPerson'),
  },
  {
    path: '/my',
    // models: () => [],
    models: [],

    component: () =>
      import('./routes/My/my'),
  },
  {
    path: '/test',
    // models: () => [],
    models: [],

    component: () =>
      import('./routes/test/testfloat'),
  },
  ];
  const speRoutes = [{
    path: '/extrance',
    // models: () => [],
    models: [],
    component: () =>
      import('./routes/login/Extrance'),
  }, {
    path: '/get_access_token',
    // models: () => [
    //   import('./models/oauth'),
    // ],
    models: ['oauth'],

    component: () =>
      import('./routes/Oauth/GetAccessToken'),
  },
  {
    path: '/refresh_access_token',
    // models: () => [
    //   import('./models/oauth'),
    // ],
    models: ['oauth'],

    component: () =>
      import('./routes/Oauth/RefreshAccessToken'),
  },
  {
    path: '/redirect_to_authorize',
    // models: () => [
    //   import('./models/oauth'),
    // ],
    models: ['oauth'],

    component: () =>
      import('./routes/Oauth/RedirectToAuthorize'),
  }];
  return (
    <ConnectedRouter history={history}>
      <Switch>
        {speRoutes.map(({ path, models, ...dynamics }, key) => {
          const idx = key;
          models.forEach((modal) => {
            if (modelNotExisted(app, modal)) {
              app.model(import(`./models/${modal}`).default);
            }
          });
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
              routes.map(({ path, models, ...dynamics }, key) => {
                const ix = key;
                models.forEach((modal) => {
                  if (modelNotExisted(app, modal)) {
                    app.model(import(`./models/${modal}`).default);
                  }
                });
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
