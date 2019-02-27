import React, {Component} from 'react'

export default class NavBar extends Component {
    render() {
        return (
            <div style={styles.header}>
                <div onClick={this.props.setSideBar}>
                    <span style={styles.breadcumb}>——</span>
                </div>
                <h1>Map Block</h1>
            </div>
        )
    }
}

const styles = {
    header: {
        height: '50px',
        lineHeight: '50px'
    },
    breadcumb: {
        float: 'left',
        display: 'inline-block',
        width: '34px',
        height: '30px',
        lineHeight: '30px',
        border: '2px solid currentColor',
        borderLeft: 0,
        borderRight: 0
    }
}