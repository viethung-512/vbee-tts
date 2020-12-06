import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import App from './app/layout/App';
import store from './app/redux/store';
import theme from './app/utils/theme';
import './app/languages';

const rootEl = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <App />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>,
    rootEl
  );
};

// if (module.hot) {
//   module.hot.accept('./ApolloProvider', () => {
//     setTimeout(render);
//   });
// }

render();
