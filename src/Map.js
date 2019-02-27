import React, {Component} from 'react'
import emitter from './ev'
import api from './thirdapi'
const BMap = window.BMap
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS

let map
export default class Map extends Component {
    constructor() {
        super();
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.getLocationByPoint = this.getLocationByPoint.bind(this)
        this.getNearByLocation = this.getNearByLocation.bind(this)
    }
    componentDidMount() {
        let pointData = this.props.currentPoint;
        map = new BMap.Map("map");          // 创建地图实例
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());
        map.enableScrollWheelZoom(true);
        let point = new BMap.Point(pointData[0], pointData[1]);  // 创建点坐标
        map.centerAndZoom(point, 15);
        this.getCurrentLocation()
        this.eventemitter = emitter.addListener('search', (msg) => {
            this.getNearByLocation(msg)
        })
    }
    getTip(params) {
        let formatDate = ''
        let date = new Date().toLocaleDateString().split('/')
        date.reduce((prev, item, index) => {
            if (index === 0) {
                formatDate = item
            } else {
                if (('' + item).length === 1) {
                    formatDate += '0' + item
                } else {
                    formatDate += '' + item
                }
            }
            return formatDate
        }, date[0])
        let temp = params.point;
        let point = new BMap.Point(temp.lng, temp.lat);
        console.log('point', point, temp)
        let paramsObj = {
            client_id: api.cliendId,
            client_secret: api.cliendSecret,
            ll: `${params.point.lat},${params.point.lng}`,
            query: params.address,
            v: formatDate,
            limit: 1
        }
        let paramStr = '';
        Object.keys(paramsObj).forEach((key) => {
            paramStr += `&${key}=${paramsObj[key]}`
        })
        paramStr = '?' + paramStr.slice(1)
        console.log(paramStr)
        return fetch(api.url + paramStr).then((res) => {
            return (res.json())
        }).then(data => {
            console.log(data)
            let venue = data.response.groups[0] && data.response.groups[0].items[0].venue.name
            return venue
        })
    }
    componentDidUpdate() {
        let point = this.props.currentPoint;
        let selectIndex = this.props.selectIndex;
        if (selectIndex >= 0) {
            let addr = this.props.nearbyAddr[this.props.selectIndex]
            console.log('point1', point)
            this.getTip(addr).then(venue => {
                const opts = {
                    width : 250,     // 信息窗口宽度
                    height: 120,     // 信息窗口高度
                    title : addr.title  // 信息窗口标题
                }
                // const infoWindow = new BMap.InfoWindow(addr.address, opts);  // 创建信息窗口对象
                const infoWindow = new BMap.InfoWindow(`地址：${addr.address}，<br/> 推荐： ${venue}`, opts);  // 创建信息窗口对象
                map.openInfoWindow(infoWindow, addr.point);

            })
        }
        map.centerAndZoom(new BMap.Point(point[0], point[1]), 15);
    }
    setAddrMark(addrArr) {
        let that = this;
        addrArr.forEach((addr) => {
            let mk = new BMap.Marker(addr.point);
            map.addOverlay(mk);
            map.panTo(addr.point);
            mk.addEventListener("click", (function(addr){
                return function() {
                    console.log(addr)
                    let venue = that.getTip(addr).then((venue) => {
                        const opts = {
                            width : 250,     // 信息窗口宽度
                            height: 120,     // 信息窗口高度
                            title : addr.title  // 信息窗口标题
                        }
                        const infoWindow = new BMap.InfoWindow(`地址：${addr.address}，<br /> 推荐： ${venue}`, opts);  // 创建信息窗口对象
                        map.openInfoWindow(infoWindow, addr.point);
                    })
                }
            }(addr)));
        })
    }
    getCurrentLocation() {
        let that = this
        const geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() === BMAP_STATUS_SUCCESS){
                let mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                let point = r.point;
                map.panTo(point);
                that.props.setCurrentPoint([point.lng, point.lat])
                that.getLocationByPoint()
                // alert('您的位置：'+r.point.lng+','+r.point.lat);
            }
            else {
                alert('failed'+this.getStatus());
            }
        });
    }
    getLocationByPoint() {
        let that = this
        let point = this.props.currentPoint;
        const myGeo = new BMap.Geocoder();
// 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point(point[0], point[1]), function(result){
            if (result){
                // that.setState({
                //     currentSearch: result.address
                // })
                that.setCurrentSearch(result.address)
                that.getNearByLocation(result.address)
            }
        });
    }
    getNearByLocation(address) {
        let that = this;
        let currentPoint = this.props.currentPoint
        map.centerAndZoom(new BMap.Point(currentPoint[0], currentPoint[1]), 15);

        const options = {
            onSearchComplete: function(results){
                if (local.getStatus() === BMAP_STATUS_SUCCESS){
                    // 判断状态是否正确
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i ++){
                        console.log(results.getPoi(i))
                        s.push(results.getPoi(i));
                    }
                    that.props.setNearbyAddr(s)
                    that.setAddrMark(s)
                    // that.setState({
                    //     nearbyAddr: s
                    // })
                }
            }
        };
        let local = new BMap.LocalSearch(map, options);
        local.search(address);
    }
    getLocationByPoint() {
        let that = this
        let point = this.props.currentPoint;
        const myGeo = new BMap.Geocoder();
// 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point(point[0], point[1]), function(result){
            if (result){
                // that.setState({
                //     currentSearch: result.address
                // })
                // this.currentSearch = result.address;
                that.props.setCurrentSearch(result.address);
                that.getNearByLocation(result.address)
            }
        });
    }
    render() {
        return (
            <div>
                <div id="map" style={styles.map}></div>
            </div>
        )
    }
}
const styles = {
    map: {
        width: '100%',
        height: '100vh'
    }
}