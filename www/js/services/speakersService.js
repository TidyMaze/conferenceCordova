angular.module('services').factory('SpeakersService', ['FakeDataService', function(fakeDataService){
  return {
    getSpeakers: function(){
      return fakeDataService.getData().then(result => result.speakers);
    },
    fetchSomeSpeakers: function(speakerIds){
      return fakeDataService.getData().then(result =>
        speakerIds.map(sp => result.speakers.find(s =>
          s.id == sp
        ))
      );
    },
    getSpeaker: function(speakerId){
      return fakeDataService.getData().then(result => {
        var filtered = result.speakers.filter(s => s.id == speakerId);
        if(filtered){
          return filtered[0];
        }
        $q.reject('No speaker found');
      })
    }
  }
}])
