angular.module('services').factory('NotesService', ['$cordovaSQLite', 'DatabaseService', function($cordovaSQLite, databaseService){

  return {
    getNotes: function(sessionId){
      if(!databaseService.isDBPluginAvailable()){
        return Promise.reject('No db plugin');
      }
      console.log('Retrieving ' + JSON.stringify(sessionId));
      var query = 'SELECT sessionId, text, picture FROM notes WHERE sessionId = ?';
      return $cordovaSQLite.execute(databaseService.getDB(), query, [sessionId]).then(rs => {
        return rs.rows.item(0);
      }, error => console.log(error));
    },

    saveNotes: function(note){
      if(!databaseService.isDBPluginAvailable()){
        return Promise.reject('No db plugin');
      }
      console.log('Storing ' + JSON.stringify(note));
      var query = 'INSERT OR REPLACE INTO notes (sessionId, text, picture) VALUES (?,?,?)';
      return $cordovaSQLite.execute(databaseService.getDB(), query, [note.sessionId, note.text, note.picture]);
    }
  }
}])
