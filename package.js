Package.describe({
  name: 'rymd:humblebundle',
  version: '0.1.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('humblebundle.js', 'server');
  api.export('humbleApi', 'server');
  Npm.depends({
    request: '2.55.0',
    querystring: '0.2.0'
  });
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('humblebundle');
  api.addFiles('humblebundle-tests.js');
});
