import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { App, Views, View, Toolbar, Link } from 'framework7-react';
import cordovaApp from '../js/cordova-app';
import routes from '../js/routes';
// Probably moving to environment files is a better option
import { ONE_SIGNAL_API_KEY } from '../js/constants';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      // Framework7 Parameters
      f7params: {
        id: 'mobi.monaca.wpsample', // App bundle ID
        name: 'WP App', // App name
        theme: 'auto', // Automatic theme detection

        // App root data
        data: function () {
          return {};
        },

        // App routes
        routes: routes,

        // Register service worker
        serviceWorker: Device.cordova
          ? {}
          : {
              path: '/service-worker.js',
            },
        // Input settings
        input: {
          scrollIntoViewOnFocus: Device.cordova && !Device.electron,
          scrollIntoViewCentered: Device.cordova && !Device.electron,
        },
        // Cordova Statusbar settings
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: false,
        },
      },
    };
  }
  render() {
    return (
      <App params={this.state.f7params}>
        <Views tabs className="safe-areas">
          <Toolbar tabbar labels bottom>
            <Link
              tabLink="#view-all"
              tabLinkActive
              iconIos="f7:tray_2_fill"
              iconAurora="f7:tray_2_fill"
              iconMd="material:inbox"
              text="All"
            />
            <Link
              tabLink="#view-news"
              iconIos="f7:compass_fill"
              iconAurora="f7:compass_fill"
              iconMd="material:explore"
              text="News"
            />
            <Link
              tabLink="#view-reviews"
              iconIos="f7:bookmark_fill"
              iconAurora="f7:bookmark_fill"
              iconMd="material:bookmark"
              text="Reviews"
            />
          </Toolbar>

          <View id="view-all" main tab tabActive url="/" />
          <View id="view-news" name="news" tab url="/news/" />
          <View id="view-reviews" name="reviews" tab url="/reviews/" />
        </Views>
      </App>
    );
  }
  componentDidMount() {
    this.$f7ready((f7) => {
      // Init cordova APIs (see cordova-app.js)
      if (Device.cordova) {
        cordovaApp.init(f7);
      }
      // Push notifications
      document.addEventListener('deviceready', this.initialiseOneSignal);
      // Call F7 APIs here
    });
  }

  initialiseOneSignal() {
    //Remove this method to stop OneSignal Debugging
    window.plugins.OneSignal.setLogLevel({
      logLevel: 6,
      visualLevel: 0,
    });

    var notificationOpenedCallback = function (jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    // Set your iOS Settings
    var iosSettings = {};
    iosSettings['kOSSettingsKeyAutoPrompt'] = false;
    iosSettings['kOSSettingsKeyInAppLaunchURL'] = false;

    window.plugins.OneSignal.startInit(ONE_SIGNAL_API_KEY)
      .handleNotificationOpened(notificationOpenedCallback)
      .iOSSettings(iosSettings)
      .inFocusDisplaying(
        window.plugins.OneSignal.OSInFocusDisplayOption.Notification
      )
      .endInit();

    // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
    window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(
      function (accepted) {
        console.log('User accepted notifications: ' + accepted);
      }
    );
  }
}
