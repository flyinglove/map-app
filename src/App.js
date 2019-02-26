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
    this.getLocationByPoint = this.getLocationByPoint.bind(this)
    this.getNearByLocation = this.getNearByLocation.bind(this)
  }
  state = {
    selectIndex: -1,
    nearbyAddr: [],
    currentSearch: '',
    currentPoint: [116.404, 39.915],
    map: {}
  }
  componentDidMount() {
    this.getLocationByPoint(this.state.currentPoint)
  }
  getNearByLocation(address) {
      let that = this;
      const map = new BMap.Map("map");
      const options = {
          onSearchComplete: function(results){
              if (local.getStatus() === BMAP_STATUS_SUCCESS){
                  // 判断状态是否正确
                  var s = [];
                  for (var i = 0; i < results.getCurrentNumPois(); i ++){
                      console.log(results.getPoi(i))
                      s.push(results.getPoi(i));
                  }
                  that.setState({
                      nearbyAddr: s
                  })
              }
          }
      };
      let local = new BMap.LocalSearch(map, options);
      local.search(address);
  }
  getLocationByPoint() {
      let that = this
      let point = this.state.currentPoint;
      const myGeo = new BMap.Geocoder();
// 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(point[0], point[1]), function(result){
          if (result){
              that.setState({
                  currentSearch: result.address
              })
              that.getNearByLocation(result.address)
          }
      });
  }
  setCurrentPoint(point) {
    this.setState({
        currentPoint: point
    })
  }
  getNearByAddr() {

  }
  render() {
    return (
      <div className="App">
        <Filter selectIndex={this.state.selectIndex} nearbyAddr={this.state.nearbyAddr}/>
        <div className="wrapper">
          <NavBar/>
          <Map currentPoint={this.state.currentPoint} setCurrentPoint={this.setCurrentPoint}/>
        </div>
      </div>
    );
  }
}

export default App;
