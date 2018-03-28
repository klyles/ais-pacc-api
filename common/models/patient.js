'use strict';

module.exports = function(Patient) {
  //search for existing patients where last name starts with T
  var log_date = new Date().toISOString();
  var test_date = new Date();

  clearRequireCache();

  Patient.byLastNameOrPhoneNumber = function(filter,cb) {
    console.log('find by name or phone number '+ filter + ' on '+ log_date);
    console.log(formatDateToString(test_date));


    if(/^[a-zA-Z]+(['.][a-zA-Z]+)?[a-zA-Z]\s[a-zA-Z]+(['.][a-zA-Z]+)?[a-zA-Z]/.test(filter))
    {
      console.log("First Name Last Name Check");
      var vFirstname = filter.split(" ")[0];
      var vLastname = filter.split(" ")[1];
    }
    if(/^[a-zA-Z]+(['.][a-zA-Z]+)?[a-zA-Z]\s(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/.test(filter))
    {
      console.log("Last Name DOB Check");
      var vLastname = filter.split(" ")[0];
      var vDob = filter.split(" ")[1];
    }
    if(/^[a-zA-Z]+(['.][a-zA-Z]+)?[a-zA-Z]\s[a-zA-Z]+(['.][a-zA-Z]+)?[a-zA-Z]\s(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/.test(filter))
    {
      console.log("First Name Last Name DOB Check");
      var vFirstname = filter.split(" ")[0];
      var vLastname = filter.split(" ")[1];
      var vDob = filter.split(" ")[2];
    }

    if(/^\d\d\d\d/.test(filter))
    {
      var vPhone = filter.trim();
      console.log("Phone Number");
    }

    Patient.find({
    where: {
      or:[
        { and:[{home_phone: {like: vPhone + '%'}}]},
        { and:[{mobile_phone: {like: vPhone + '%'}}]},
        { and:[{work_phone: {like: vPhone + '%'}}]},
        { and:[{first_name: {like: vFirstname + '%'}}, {last_name: {like: vLastname + '%'}}]},
        { and:[{last_name: {like: vLastname + '%'}}, {dob: {like: vDob + '%'}}]},
        { and:[{first_name: {like: vFirstname + '%'}}, {last_name: {like: '%' + vLastname + '%'}}, {dob: {like: vDob + '%'}}]}
      ] //End OR
    },  order: 'last_name ,, first_name ,, DOB',

        }, function(err, patient) {
          cb(null,patient);
      });
  };

  Patient.remoteMethod('byLastNameOrPhoneNumber',
  {
    description: 'Search for patient by last name or phone number',
    http: {path: '/search', verb: 'get'},
    accepts:{arg: 'filter', type: 'string'},
    returns:{arg:'filter', type:'string'}
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
function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}
