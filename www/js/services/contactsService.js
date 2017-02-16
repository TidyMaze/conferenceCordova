angular.module('services').factory('ContactsService', ['$cordovaSQLite', 'DatabaseService', '$cordovaContacts', function($cordovaSQLite, databaseService, $cordovaContacts){
  function saveContact(contact){
    console.log('Saving contact : ' + JSON.stringify(contact));
    return $cordovaContacts.save(contact);
  }

  function removeContact(contact){
    console.log('Removing contact : ' + JSON.stringify(contact));
    return contact.remove(console.log, console.error);
  }

  function getAllContacts(){
    return $cordovaContacts.find({});
  }

  function findContact(name){
    console.log('Finding contact : ' + JSON.stringify(name));
    var opts = {
      filter : name,
      desiredFields: ['id', 'displayName'],
      fields: ['displayName']
    };
    return $cordovaContacts.find(opts).then(result => result.length > 0 ? result[0] : Promise.reject(`No contact ${name} found`));
  }

  return {
    saveContact: saveContact,
    removeContact: removeContact,
    getAllContacts: getAllContacts,
    findContact: findContact
  };
}])
