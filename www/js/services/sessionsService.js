angular.module('services').factory('SessionsService', ['FakeDataService', function(fakeDataService){
  return {
    getSessions: function(){
      return fakeDataService.getData().then(result => result.sessions);
    },
    findSessionsBySpeaker: function(speakerId){
      return fakeDataService.getData().then(result =>
        result.sessions.filter(s => s.speakers && s.speakers.includes(speakerId))
      );
    },
    getSession: function(sessionId){
      return fakeDataService.getData().then(result => {
        var filtered = result.sessions.filter(s => s.id == sessionId);
        if(filtered){
          return filtered[0];
        }
        $q.reject('No session found');
      })
    }
  }
}])
