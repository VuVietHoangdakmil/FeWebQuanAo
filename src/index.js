import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobaStyle from './components/GlobalStyle';
import Provider from './Provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GlobaStyle>
      <Provider>
        <App />
      </Provider>
     </GlobaStyle>
);



