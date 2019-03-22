import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Items from './items/Items';
import Login from './accounts/Login';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: ''
        };
        this.setToken = this.setToken.bind(this);
    }

    setToken(token) {
        this.setState({
            token
        });
    }

    render() {
        return (
            <div>
                <Login setToken={this.setToken} />
                <Items token={this.state.token} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))