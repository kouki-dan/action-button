import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface AppProps { compiler: string; framework: string; }

class App extends React.Component<AppProps, {}> {
  render() {
      return <h1>Hello {this.props.compiler} and {this.props.framework}!</h1>;
  }
}

ReactDOM.render(
  <App compiler="TypeScript" framework="React" />,
  document.getElementById('app')
);
