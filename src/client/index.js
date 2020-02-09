import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
  constructor(props) {
	  super(props);
	  this.state = { 
		response: '',
		post: '',
		responseToPost: ''
	  }
  }
  
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.message }))
      .catch(err => console.log(err));
  }
  
  async callApi() {
    const response = await fetch('/api');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  
render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Server response below:
          </p>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);