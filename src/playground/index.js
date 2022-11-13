import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };
    }

    handleInput = (event) => {
        const val = event.target.value;
        this.setState({
            text: val
        });
    }

    render() {
        return (
            <div>
                <h1>Hello, {this.props.name} </h1>
                <input
                    type="text"
                    placeholder="Type here"
                    value={this.state.text}
                    onChange={this.handleInput}
                />
                <p>
                    <strong> Your entry is: </strong>
                    {this.state.text}
                </p>
            </div>
        );
    }
}

ReactDOM.render(
    <App name="Bobby Bushay" />,
    document.getElementById('root')
);