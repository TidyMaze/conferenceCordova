angular.module('services').factory('SessionsService', ['FakeDataService', function(fakeDataService){
  function getSessions(){
    return fakeDataService.getData().then(result => {
      console.log(result);
      result.sessions.forEach(s => {
        var h = result.hours[s.hour];
        Object.assign(s, h);
      })
      return result.sessions;
    });
  }

  return {
    getSessions: getSessions,
    findSessionsBySpeaker: function(speakerId){
      return getSessions().then(sessions =>
        sessions.filter(s => s.speakers && s.speakers.includes(speakerId))
      );
    },
    getSession: function(sessionId){
      return getSessions().then(sessions => {
        var filtered = sessions.find(s => s.id == sessionId);
        if(!filtered) $q.reject('No session found');
        return filtered;
      })
    }
  }
}])
