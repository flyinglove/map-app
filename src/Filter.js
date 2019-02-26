import React, {Component} from 'react'
import emitter from './ev'
let BMap = window.BMap
export default class Filter extends Component {
    state = {
        text: ''
    }
    handleSearch = () => {
        emitter.emit('search', this.state.text)
    }
    render() {
        return (<div>
            <div className="top">
                <input type="text" onChange={(e) => this.setState({
                    text: e.target.value
                })}/>
                <button onClick={this.handleSearch}>Filter</button>
            </div>
            <ul className="list" style={styles.ul}>
                {
                    this.props.nearbyAddr.map((item, index) => {
                        return (
                            <li onClick={() => this.props.setSearchIndex(index)} key={index}>{item.title}</li>
                        )
                    })
                }
            </ul>
        </div>)
    }
}
const styles = {
    ul: {
        listStyle: "none"
    }
}