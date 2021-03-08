import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";
import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps/ngx'
import {
  ToastController,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  map: GoogleMap;
  loading: any;

  constructor(private platform: Platform,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,) {}

  async ngOnInit() {
    await this.platform.ready();

    await this.loadMap();
  }

  async onButtonClick() {
    this.map.clear();

    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      console.log(JSON.stringify(location, null ,2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });

      // add a marker
      let marker = this.map.addMarkerSync({
        title: location.latLng.lat + ', ' +location.latLng.lng,
        snippet: 'Esta es tu ubicación actual',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });
    })
      .catch(err => {
        this.loading.dismiss();
        this.showToast(err.error_message);
      });
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas');
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }

}
