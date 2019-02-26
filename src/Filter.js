import React, {Component} from 'react'

let BMap = window.BMap
export default class Filter extends Component {
    render() {
        return (<div>
            <div className="top">
                <input type="text"/>
                <button>Filter</button>
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