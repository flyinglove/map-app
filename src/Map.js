import React, {Component} from 'react'
const BMap = window.BMap
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS

let map
export default class Map extends Component {
    constructor() {
        super();
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
    }
    componentDidMount() {
        let pointData = this.props.currentPoint;
        map = new BMap.Map("map");          // 创建地图实例
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());
        let point = new BMap.Point(pointData[0], pointData[1]);  // 创建点坐标
        map.centerAndZoom(point, 15);
        this.getCurrentLocation()
    }
    componentDidUpdate() {
        let point = this.props.currentPoint;
        map.centerAndZoom(point, 15);
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
                that.props.setCurrentPoint([point.lat, point.lng])
                // alert('您的位置：'+r.point.lng+','+r.point.lat);
            }
            else {
                alert('failed'+this.getStatus());
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