  import { Component, OnInit, NgZone } from '@angular/core';
  import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    Marker,
    HtmlInfoWindow
  } from '@ionic-native/google-maps';
  import { Platform } from '@ionic/angular';

  @Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
  })
  export class Tab2Page implements OnInit{

    map: GoogleMap;

    constructor(private platform: Platform, private _ngZone: NgZone) { }

    async ngOnInit() {
      // Since ngOnInit() is executed before `deviceready` event,
      // you have to wait the event.
      await this.platform.ready();
      await this.loadMap();
    }

    loadMap() {
      this.map = GoogleMaps.create('map_canvas', {
        camera: {
          target: {lat: 12.63200864966776, lng: -87.13459927449283},
          zoom: 5
        },
        'gestures': {
          'scroll': true,
          'tilt': true,
          'rotate': true,
          'zoom': true
        }
      });

      let htmlInfoWindow = new HtmlInfoWindow();

      // flip-flop contents
      // https://davidwalsh.name/css-flip
      let frame: HTMLElement = document.createElement('div');
      frame.innerHTML = `
  <div class="flip-container" id="flip-container">
    <div class="flipper">
      <div class="front">
      <h3>Click this photo!</h3>
      <img src="assets/parroquia-santa-ana.jpg">
    </div>
    <div class="back">
      <!-- back content -->
      Esta es la iglesia central de chinandega donde se celebran las fiestas pratonales de chinandega
      </div>
    </div>
  </div>`;

      frame.addEventListener("click", (evt) => {
        let container = document.getElementById('flip-container');
        if (container.className.indexOf(' hover') > -1) {
          container.className = container.className.replace(" hover", "");
        } else {
          container.className += " hover";
        }
      });
      htmlInfoWindow.setContent(frame, {
        width: "170px"
      });

      this.map.addMarker({
        position: {lat: 12.63200864966776, lng: -87.13459927449283},
        draggable: true,
        disableAutoPan: true
      }).then((marker: Marker) => {

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          htmlInfoWindow.open(marker);
        });
        marker.trigger(GoogleMapsEvent.MARKER_CLICK);

      });
    }

  }
