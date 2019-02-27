import React, { Component } from 'react';
import './App.css';
import Filter from './Filter';
import NavBar from './NavBar';
import Map from './Map';
const BMap = window.BMap;
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS
class App extends Component {
  constructor() {
    super()
    this.setCurrentPoint = this.setCurrentPoint.bind(this)
    this.setCurrentSearch = this.setCurrentSearch.bind(this)
    this.setNearbyAddr = this.setNearbyAddr.bind(this)
    this.setSearchIndex = this.setSearchIndex.bind(this)
    this.setSideBar = this.setSideBar.bind(this)
  }
  state = {
    selectIndex: -1,
    nearbyAddr: [],
    currentSearch: '',
    currentPoint: [116.404, 39.915],
    sideBar: false
  }
  setCurrentPoint(point) {
    this.setState({
        currentPoint: point
    })
  }
  setCurrentSearch(address) {
    this.setState({
        currentSearch: address
    })
  }
  setNearbyAddr(addr) {
    this.setState({
        nearbyAddr: addr
    })
  }
  setSearchIndex(index) {
    let addr = this.state.nearbyAddr[index]
    let point = addr.point
      console.log(point)
    this.setState({
        selectIndex: index,
        currentPoint: [point.lng, point.lat]
    })
  }
  setSideBar() {
    this.setState({
      sideBar: !this.state.sideBar
    })
  }
  render() {
    return (
      <div className="App" style={styles.container}>
        {
          this.state.sideBar && (
              <div className="filter" style={styles.filter}>
               <Filter selectIndex={this.state.selectIndex} setSearchIndex={this.setSearchIndex} nearbyAddr={this.state.nearbyAddr}/>
              </div>
          )
        }
        <div className="wrapper" style={styles.wrapper}>
          <NavBar setSideBar={this.setSideBar}/>
          <Map nearbyAddr={this.state.nearbyAddr} selectIndex={this.state.selectIndex} currentPoint={this.state.currentPoint} setNearbyAddr={this.setNearbyAddr} setCurrentSearch={this.setCurrentSearch} setCurrentPoint={this.setCurrentPoint}/>
        </div>
      </div>
    );
  }
}

export default App;
const styles = {
  container: {
    display: "flex"
  }, filter: {
    width: '300px'
  },
    wrapper: {
      flex: 1
    }
}
