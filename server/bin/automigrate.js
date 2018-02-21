var app = require('../server');

// this loads the accountDb configuration in ~/server/datasources.json
var dataSource = app.datasources.db;

// this automigrates the model
dataSource.automigrate('Patient', function(err) {
  if (err) throw err;
  dataSource.disconnect();
});

dataSource.automigrate('Call', function(err) {
  if (err) throw err;
  dataSource.disconnect();
});

dataSource.automigrate('Call_Status', function(err) {
  if (err) throw err;
  dataSource.disconnect();
});

dataSource.automigrate('Call_Outcome', function(err) {
  if (err) throw err;
  dataSource.disconnect();
});

dataSource.automigrate('State', function(err) {
  if (err) throw err;
  dataSource.disconnect();
});

dataSource.automigrate('Note', function(err) {
  if (err) throw err;
  dataSource.disconnect();
});


dataSource.isActual(models, function(err, actual) {
  if (!actual) {
    dataSource.autoupdate(models, function(err, result) {
      if (err) throw err;
      dataSource.disconnect();
    });
  }
});
