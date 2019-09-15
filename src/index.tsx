import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as firebase from 'firebase';

interface AppProps { compiler: string; framework: string; }

const App: React.FC<AppProps> = ({ compiler, framework }) => {
  React.useEffect(() => {
    const app = firebase.app();
    console.log(app);
  }, []);

  return <h1>Hello {compiler} and {framework}!</h1>;
};

ReactDOM.render(
  <App compiler="TypeScript" framework="React" />,
  document.getElementById('app')
);
