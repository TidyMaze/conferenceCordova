// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'controllers', 'services', 'ngCordova'])

.run(['$ionicPlatform', '$rootScope', 'DatabaseService', '$cordovaInAppBrowser', function($ionicPlatform, $rootScope, databaseService, $cordovaInAppBrowser) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.openurl = function(url){
      $cordovaInAppBrowser.open(url, '_blank');
      return false;
    }

    if(databaseService.isDBPluginAvailable()){
      databaseService.initDB();
    }

    document.addEventListener("pause", function (event) {
        $rootScope.$broadcast('cordovaPauseEvent');
    });

    document.addEventListener("resume", function (event) {
        $rootScope.$broadcast('cordovaResumeEvent');
    });
  });
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.sessions', {
      url: '/sessions',
      views: {
        'menuContent': {
          templateUrl: 'templates/sessions.html',
          controller: 'SessionsCtrl'
        }
      }
    })

    .state('app.session', {
      url: '/sessions/:sessionId',
      views: {
        'menuContent': {
          templateUrl: 'templates/session.html',
          controller: 'SessionCtrl'
        }
      }
    })

    .state('app.notes', {
      url: '/notes/:sessionId',
      views: {
        'menuContent': {
          templateUrl: 'templates/notes.html',
          controller: 'NotesCtrl'
        }
      }
    })

    .state('app.speakers', {
      url: '/speakers',
      views: {
        'menuContent': {
          templateUrl: 'templates/speakers.html',
          controller: 'SpeakersCtrl'
        }
      }
    })

    .state('app.speaker', {
      url: '/speakers/:speakerId',
      views: {
        'menuContent': {
          templateUrl: 'templates/speaker.html',
          controller: 'SpeakerCtrl'
        }
      }
    })

    .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html',
          controller: 'WelcomeCtrl'
        }
      }
    })
    .state('app.aboutPhone', {
      url: '/aboutPhone',
      views: {
        'menuContent': {
          templateUrl: 'templates/aboutPhone.html',
          controller: 'AboutPhoneCtrl'
        }
      }
    })
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});
