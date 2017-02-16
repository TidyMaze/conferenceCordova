angular.module('controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('SessionsCtrl', ['$scope', 'SessionsService', function($scope, sessionsService) {
  sessionsService.getSessions().then(sessions => {
    $scope.sessions = sessions;
  });
}])

.controller('SessionCtrl', ['$scope', '$stateParams', 'SessionsService', 'SpeakersService', '$cordovaSocialSharing', function($scope, $stateParams, sessionsService, speakersService, $cordovaSocialSharing) {
  sessionsService.getSession($stateParams.sessionId).then(session => {
    $scope.session = session;
    $scope.share = function(){
      console.log("sharing");

      var url = session.video.replace(/^\/\//, '');
      console.log(url);

      var options = {
        message: `Check this session at IMT : ${session.title}`,
        subject: `Check this session at IMT : ${session.title}`,
        files: [url],
        url: `https://imt.fr/fakePathtoSessionDetails${session.id}`,
        chooserTitle: 'Pick an app'
      }

      var onSuccess = function(result) {
        console.log("Share completed? " + result.completed);
        console.log("Shared to app: " + result.app);
      }

      var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
      }

      $cordovaSocialSharing.shareWithOptions(options, onSuccess, onError);
    }

    speakersService.fetchSomeSpeakers(session.speakers).then(speakers => {
      $scope.speakers = speakers;
    });
  });
}])

.controller('NotesCtrl', ['$scope', '$stateParams', 'SessionsService', '$cordovaSQLite', 'NotesService', '$cordovaCamera', '$cordovaCapture', function($scope, $stateParams, sessionsService, $cordovaSQLite, notesService, $cordovaCamera, $cordovaCapture) {
  var genPictureData = (imageData) => "data:image/jpeg;base64," + imageData;

  sessionsService.getSession($stateParams.sessionId).then(session => {
    $scope.session = session;
    notesService.getNotes(session.id).then(note => {
      $scope.note = note||{sessionId: session.id, text: '', picture: ''};
    });
  });
  $scope.save = function(){
    return notesService.saveNotes($scope.note).then(rs => console.log('ok'), error => console.log(error));
  }

  var getPicture = function(options){
    $cordovaCamera.getPicture(options)
      .then((imageData) => { $scope.note.picture = genPictureData(imageData); }, console.error);
  }

  $scope.takeCamera = function(){
    getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA
    });
  }

  $scope.openCamera = function(){
    getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    });
  }

  $scope.takeAudio = function(){
    var options = { limit: 1, duration: 5 };

    $cordovaCapture.captureAudio(options).then(function(audioData) {
      // Success! Audio data is here
      console.log('Audio done');
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log('Audio error :' + err);
    });
  }

  $scope.takeVideo = function(){
    var options = { limit: 1, duration: 5 };

    $cordovaCapture.captureVideo(options).then(function(videoData) {
      // Success! Video data is here
      console.log('Video done :' + JSON.stringify(videoData));
      $scope.note.videos = videoData.map(vd => ({
        type: vd.type,
        url: vd.fullPath
      }));
      console.log($scope.note.videos)
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log('Video error :' + err);
    });
  }
}])

.controller('SpeakersCtrl', ['$scope', 'SpeakersService', function($scope, speakersService) {
  speakersService.getSpeakers().then(speakers => {
    $scope.speakers = speakers;
  });
}])

.controller('SpeakerCtrl', ['$scope', '$stateParams', 'SpeakersService', 'SessionsService', 'ContactsService', function($scope, $stateParams, speakersService, sessionsService, contactsService) {

  var ioniconsClassMap = {
    "google-plus" : "ion-social-googleplus",
    "twitter" : "ion-social-twitter",
    "github" : "ion-social-github",
    "link" : "ion-link",
    "linkedin" : "ion-social-linkedin",
    "facebook" : "ion-social-facebook"
  };

  function fetchContact(){
    console.log('fetching contact');
    return contactsService.findContact($scope.speaker.firstname +  ' ' + $scope.speaker.lastname).then(result => {
      $scope.contact = result;
      console.log('foundContact : ' + JSON.stringify(result));
      return result;
    });
  }

  speakersService.getSpeaker($stateParams.speakerId).then(speaker => {
    speaker.socials.forEach(s => s.ioniconsClass = ioniconsClassMap[s.class]);
    $scope.speaker = speaker;
    sessionsService.findSessionsBySpeaker(speaker.id).then(sessions => {
      $scope.sessions = sessions;
    });
    fetchContact().then(contact => {
      console.log('Found contact : ' + JSON.stringify(contact))
      $scope.speaker.added = true;
    }, error => {
      console.error(error);
      $scope.speaker.added = false;
    })
  });

  $scope.changeContact = function(){
    console.log('Changed ! state : ' + $scope.speaker.added);

    if($scope.speaker.added){
      var contact = {
        displayName: $scope.speaker.firstname + ' ' + $scope.speaker.lastname
      }
      contactsService.saveContact(contact).then(fetchContact, console.err);
    } else {
      console.log($scope.contact);
      contactsService.removeContact($scope.contact);
      $scope.contact = null;
      $scope.speaker.added = false;
    }
  }
}])

.controller('WelcomeCtrl', function($scope, $stateParams) {
  var today = moment();
  $scope.begin = today;
  $scope.end = today.clone().add(7,'days');
})

.controller('AboutPhoneCtrl', function($scope, $stateParams, $ionicPlatform, $cordovaDevice) {
  $ionicPlatform.ready(function() {
    var info = $cordovaDevice.getDevice();
    $scope.info = info;
  });
})

.controller('AboutCtrl', function($scope, $cordovaAppVersion) {

  document.addEventListener("deviceready", function () {
    $cordovaAppVersion.getVersionNumber().then(function (version) {
      $scope.version = version;
    });
  }, false);

  $scope.goToGithub = function(){
    openurl('https://github.com/TidyMaze');
  }
})

.controller('CalendarCtrl', function($scope) {
  $scope.calendarClick = function(){
    console.log('click !');
  }
  $scope.uiConfig = {
    calendar: {
      editable: false,
      height: 900,
      defaultView: 'agendaDay',
      minTime: '7:30:00',
      maxTime: '22:00:00',
      eventClick: $scope.calendarClick,
    }
  };
  $scope.eventSources = [
        {
            events: [
                {
                    title  : 'event1',
                    start  : '2017-02-16'
                },
                {
                    title  : 'event2',
                    start  : '2017-02-16',
                    end    : '2017-02-17'
                },
                {
                    title  : 'event3',
                    start  : '2017-02-16T12:30:00',
                    end    : '2017-02-16T15:30:00'
                }
            ]
        }
  ];
})
;
