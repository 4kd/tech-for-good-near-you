import { sendScrollDistanceToElm } from './interop.js'

const google = window.google
let _map
let infoWindow
let mapDiv
let userLocation
let visibleMarkers = []

function initMap ({ marker, mapId }) {
  var mapOptions = {
    zoom: 10,
    center: {
      lat: marker.lat,
      lng: marker.lng
    },
    gestureHandling: 'greedy',
    mapTypeControl: false,
    streetViewControl: false
  }

  mapDiv = document.getElementById(mapId)
  _map = new google.maps.Map(mapDiv, mapOptions)
  infoWindow = new google.maps.InfoWindow()
}


function makeMarker (options) {
  var _options = {
    map: _map,
    animation: google.maps.Animation.DROP,
    position: {
      lat: options.lat,
      lng: options.lng
    }
  }

  return {
    url: options.url,
    title: options.title,
    instance: new google.maps.Marker(_options)
  }
}

function clearVisibleMarkers () {
  visibleMarkers.map(m => m.instance.setMap(null))
  visibleMarkers = []
}

function makeDescription (_marker) {
  return `
    <div>
      <a class="no-underline green" href="${_marker.url}" target="_blank">
        <p>${_marker.title}</p>
      </a>
    </div>
  `
}

function fitBounds () {
  if (visibleMarkers.length) {
    resizeMap()
    _fitBounds(visibleMarkers)
  }
}

function _fitBounds (_markers) {
  var bounds = new google.maps.LatLngBounds()
  _markers.forEach(m => bounds.extend(m.instance.getPosition()))
  _userLocationBounds(bounds)
  _map.fitBounds(bounds)
}

function _userLocationBounds (bounds) {
  if (userLocation) {
    bounds.extend(userLocation.getPosition())
  }
}

function addMarkerListener (elmApp, _marker) {
  google.maps.event.addListener(_marker.instance, 'click', function () {
    sendScrollDistanceToElm(elmApp, _marker)
    infoWindow.setContent(makeDescription(_marker))
    infoWindow.open(_map, this)
  })
}

function normalizeZoom (n) {
  if (_map.getZoom() > n) {
    _map.setZoom(n)
  }
}

function updateMarkers (elmApp) {
  return function (newMarkers) {
    clearVisibleMarkers()
    newMarkers.forEach(m => visibleMarkers.push(makeMarker(m)))
    visibleMarkers.forEach(m => addMarkerListener(elmApp, m))

    if (visibleMarkers.length > 0) {
      _fitBounds(visibleMarkers)
      resizeMap()
      normalizeZoom(13)
    }
  }
}

function updateUserLocation (coords) {
  var _options = {
    map: _map,
    icon: 'https://cloud.githubusercontent.com/assets/14013616/23849995/8989fe0a-07d5-11e7-9e81-c3786679d312.png',
    position: {
      lat: coords.lat,
      lng: coords.lng
    }
  }
  clearUserLocation()
  userLocation = new google.maps.Marker(_options)
}

function clearUserLocation () {
  if (userLocation) {
    userLocation.setMap(null)
  }
}

function centerMapOnUser () {
  if (userLocation) {
    _map.setCenter(userLocation.getPosition())
    _map.setZoom(13)
  }
}

function centerEvent (event) {
  var selectedMarkerArr = visibleMarkers.filter(function (marker) {
    return marker.title === event.title
  })

  var selectedMarker = selectedMarkerArr.length
    ? selectedMarkerArr[0].instance
    : {}

  _map.setCenter(event)
  _map.setZoom(16)
  infoWindow.setContent(makeDescription(event))
  infoWindow.open(_map, selectedMarker)
}

function resizeMap () {
  google.maps.event.trigger(_map, 'resize')
}

module.exports = {
  initMap,
  updateMarkers,
  updateUserLocation,
  clearUserLocation,
  centerMapOnUser,
  centerEvent,
  resizeMap,
  fitBounds
}
