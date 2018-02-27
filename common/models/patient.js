'use strict';

module.exports = function(Patient) {
  //search for existing patients where last name starts with T
  var log_date = new Date().toISOString();
  var test_date = new Date();

  Patient.byLastNameOrPhoneNumber = function(filter,cb) {
    console.log('find by name or phone number '+ filter + ' on '+ log_date);
    console.log(formatDateToString(test_date));

    Patient.find({
      where: {or:[
        {last_name: {like: escapeRegex(filter) + '%'}},
        {home_phone: {like: escapeRegex(filter) + '%'}},
        {work_phone: {like: escapeRegex(filter) + '%'}},
        {mobile_phone: {like: escapeRegex(filter) + '%'}},
        {email: {like: escapeRegex(filter) + '%'}}
      ]}, order: 'last_name ASC ,, first_name ASC',

      }, function(err, patient) {
        cb(null,patient);
    });
  };

  Patient.remoteMethod('byLastNameOrPhoneNumber',
  {
    description: 'Search for patient by last name or phone number',
    http: {path: '/search', verb: 'get'},
    accepts:{arg: 'filter', type: 'string'},
    returns:{arg:'filter', type:'last_name'}
  }
);
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function formatDateToString(date){
   // 01, 02, 03, ... 29, 30, 31
   var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
   // 01, 02, 03, ... 10, 11, 12
   var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
   // 1970, 1971, ... 2015, 2016, ...
   var yyyy = date.getFullYear();

   // create the format you want
   return (MM + "/" + dd + "/" + yyyy);
}
