import React from 'react';
import { Device } from 'framework7/framework7-lite.esm.bundle.js';
import { App, Views, View, Toolbar, Link } from 'framework7-react';
import cordovaApp from '../js/cordova-app';
import routes from '../js/routes';

// Probably store it in a better place
const OS_APP_ID = '30753b80-fc81-4dc2-9a73-61eecdcec542';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      // Framework7 Parameters
      f7params: {
        id: 'io.framework7.myapp', // App bundle ID
        name: 'WP App', // App name
        theme: 'auto', // Automatic theme detection

        // App root data
        data: function () {
          return {
            // Demo products for Catalog section
            products: [
              {
                id: '1',
                title: 'Apple iPhone 8',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.',
              },
              {
                id: '2',
                title: 'Apple iPhone 8 Plus',
                description:
                  'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!',
              },
              {
                id: '3',
                title: 'Apple iPhone X',
                description:
                  'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.',
              },
            ],
          };
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
        {/* Views/Tabs container */}
        <Views tabs className="safe-areas">
          {/* Tabbar for switching views-tabs */}
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

          {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
          <View id="view-all" main tab tabActive url="/" />

          {/* Catalog View */}
          <View id="view-news" name="news" tab url="/news/" />

          {/* Settings View */}
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

    window.plugins.OneSignal.startInit(OS_APP_ID)
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
