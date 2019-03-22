import React, { Component } from 'react';
import axios from 'axios';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    getItems(token) {
        axios.get('http://localhost:8000/api/items/', {
            headers: {
                Authorization: 'Bearer '.concat(token)
            }
        })
        .then(response => {
            this.setState({ items: response.data });
        })
        .catch(error => {
            console.log(error);
        });
    }

    componentWillReceiveProps(props) {
        this.getItems(props.token);
    }

    render() {
        const listItems = this.state.items.map((item) => <li key={item.id}>{item.text}</li>);
        return (
            <div>
                <ul>
                    { listItems }
                </ul>
            </div>
        )
    }
}

export default Items;