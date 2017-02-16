angular.module('services').factory('DatabaseService', ['$cordovaSQLite', '$window', function($cordovaSQLite, $window){
  var db = null;

  var isDBPluginAvailable = function(){
    return !!$window.sqlitePlugin;
  }

  var getDB = function(){
    if(!db){
      db = $cordovaSQLite.openDB({ name: "conference.db" , location: 'default'});
    }
    return db;
  }

  var initDB = function(){
    $cordovaSQLite.execute(getDB(),'DROP TABLE IF EXISTS notes');
    $cordovaSQLite.execute(getDB(),'CREATE TABLE IF NOT EXISTS notes (sessionId varchar2(50) primary key, text text, picture text)');
  }

  return {
    isDBPluginAvailable: isDBPluginAvailable,
    getDB: getDB,
    initDB: initDB
  }
}])
