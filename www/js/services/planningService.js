angular.module('services').factory('PlanningService', ['$cordovaSQLite', 'DatabaseService', function($cordovaSQLite, databaseService){
  function isSessionPlanned(sessionId){
    if(!databaseService.isDBPluginAvailable()){
      return Promise.reject('No db plugin');
    }
    var query = 'SELECT sessionId FROM planning WHERE sessionId = ?';
    return $cordovaSQLite.execute(databaseService.getDB(), query, [sessionId]).then(rs => {
      console.log('return isSessionPlanned : ', rs.rows.item(0) != undefined);
      return rs.rows.item(0) != undefined;
    }, error => console.log(error));
  }

  function getAllPlannedSessions(){
    if(!databaseService.isDBPluginAvailable()){
      return Promise.reject('No db plugin');
    }
    var query = 'SELECT sessionId FROM planning';
    return $cordovaSQLite.execute(databaseService.getDB(), query, []).then(rs => {
      var res = [];
      for(var i=0;i<rs.rows.length;i++){
        res.push(rs.rows.item(i).sessionId);
      }
      return res;
    }, error => console.log(error));
  }

  function addPlannedSession(sessionId){
    if(!databaseService.isDBPluginAvailable()){
      return Promise.reject('No db plugin');
    }
    var query = 'INSERT OR REPLACE INTO planning (sessionId) VALUES (?)';
    return $cordovaSQLite.execute(databaseService.getDB(), query, [sessionId]);
  }

  function removePlannedSession(sessionId){
    if(!databaseService.isDBPluginAvailable()){
      return Promise.reject('No db plugin');
    }
    var query = 'DELETE FROM planning WHERE sessionId = ?';
    return $cordovaSQLite.execute(databaseService.getDB(), query, [sessionId]);
  }

  return {
    isSessionPlanned: isSessionPlanned,
    getAllPlannedSessions: getAllPlannedSessions,
    addPlannedSession: addPlannedSession,
    removePlannedSession: removePlannedSession
  }
}])
