
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs-extra');
var rmdir = require('rimraf');
var child_process = require('child_process');
var request = require('request');
var _ = require('lodash');
var Download = require('download');
var htmlWiring = require("html-wiring");

var symfonyDistribution = {
  host: 'https://symfony.com/download?v=Symfony_Standard_Vendors_',
  commit: 'latest',
  ext: 'zip'
};

module.exports = yeoman.Base.extend({

  initializing: function () {
    this.pkg = require('../package.json');
    var ALPIXEL = chalk.yellow.bgBlack.white('\n          _      _____ _______   ________ _\n     /\   | |    |  __ \_   _\ \ / /  ____| |\n    /  \  | |    | |__) || |  \ V /| |__  | |\n   / /\ \ | |    |  ___/ | |   > < |  __| | |\n  / ____ \| |____| |    _| |_ / . \| |____| |____\n /_/    \_\______|_|   |_____/_/ \_\______|______|');
    this.log(ALPIXEL);
  },

  // getTagSymfony: function () {
  //   var done = this.async();
  //   var invalidEntries = 0;

  //   function filterByTag(obj) {
  //     if ('installable' === obj || 'non_installable' === obj) {
  //       invalidEntries++;
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  //   request('https://symfony.com/versions.json', function (error, response, body) {
  //     if (!error && response.statusCode === 200) {
  //       this.parsed = JSON.parse(body);
  //       var filtered = Object.keys(this.parsed);
  //       this.versionSf2 = filtered.filter(filterByTag);
  //       done();
  //     } else {
  //       console.log(chalk.red('A problem occurred'), error);
  //     }
  //   }.bind(this));
  // },

  // _unzip: function (archive, destination, opts, cb) {
  //   if (_.isFunction(opts) && !cb) {
  //     cb = opts;
  //     opts = { extract: true, mode: '755' };
  //   }

  //   opts = _.assign({ extract: true, mode: '755' }, opts);

  //   var log = this.log.write()
  //     .info('... Fetching %s ...', archive)
  //     .info(chalk.yellow('This might take a few moments'));

  //   var download = new Download(opts)
  //     .get(archive)
  //     .dest(destination)
  //     .use(function (res) {
  //       res.on('data', function () {});
  //     });

  //   download.run(function (err) {
  //     if (err) {
  //       return cb (err);
  //     }

  //     log.write().ok('Done in ' + destination).write();
  //     cb();
  //   });
  // },

  // symfonyBase: function () {
  //   var done = this.async();
  //   var symfonyCommit = this.parsed[symfonyDistribution.commit];

  //   var appPath = this.destinationRoot();
  //   var repo = symfonyDistribution.host + symfonyCommit  + '.' + symfonyDistribution.ext;

  //   this._unzip(repo, appPath, function (err, remote) {
  //     if (err) {
  //     console.log(' 💩 ' + chalk.red(' ARRRRR '));
  //       console.log(err);
  //       return;
  //     } else {
  //       console.log(' 👍 ' + chalk.green(' Download success ! '));
  //       done();
  //     }
  //   });
  // },

  // moveSymfonyBase: function () {
  //   var done = this.async();
  //   fs.copy('./Symfony/', '.', function (err) {
  //     done();
  //   });
  // },

  // checkBower: function () {
  //   this.globalBower = false;

  //   if (this.bootStrapSass) {
  //     var done = this.async();

  //     child_process.execFile('bower', ['-v'], function (error, stdout, stderr) {
  //       if (error !== null) {
  //         var prompts = [{
  //           type: 'confirm',
  //           name: 'checkBower',
  //           message: chalk.red('WARNING: No global bower installation found. We will install it locally if you decide to continue. Continue ?'),
  //           default: true
  //         }];
  //         this.prompt(prompts, function (answers) {
  //           if (answers.checkBower) {
  //             child_process.exec('npm install -g bower', function (error, stdout, stderr) {
  //               if (error !== null) {
  //                 console.log('exec error: ' + error);
  //               } else {
  //                 console.log(chalk.green('Installing bower locally.'));
  //                 console.log('See ' + chalk.yellow('http://bower.io/') + ' for more details on bower.');
  //                 console.log('');
  //                 this.globalBower = true;
  //                 done();
  //               }
  //             }.bind(this));
  //           } else {
  //             console.log(chalk.red('Bower did not installed locally!'));
  //             done();
  //           }
  //         }.bind(this));
  //       } else {
  //         this.globalBower = true;
  //         done();
  //       }
  //     }.bind(this));
  //   }
  // },

  // downloadChuck: function() {
  //   var done = this.async();
  //   this._unzip('https://github.com/alpixel/ChuckCSS/archive/master.zip', this.destinationRoot(), function (err, remote) {
  //     if (err) {
  //       console.log(' 💩 ' + chalk.red(' ARRRRR '));
  //       console.log(err);
  //       return;
  //     } else {
  //       console.log(' 👍 ' + chalk.green(' Download success ! '));
  //       done();
  //     }
  //   });
  // },

  writing: function() {
    // fs.remove('./Symfony/');
    // fs.remove('./vendor/');
    // fs.remove('./app/Resources/views');
    // fs.remove(this.destinationPath('./src'));
    // fs.remove('./README.md');
    // fs.remove('./LICENSE');

    // fs.copySync(this.templatePath('app'), this.destinationPath('app'));
    // fs.copySync(this.templatePath('web'), this.destinationPath('web'));

    // this.fs.copy(
    //   this.templatePath('_gitignore'),
    //   this.destinationPath('.gitignore')
    // );

    // this.template('_bower.json', 'bower.json');
    // this.template('_package.json', 'package.json');
    // this.template('_editorconfig', '.editorconfig');
    // this.template('_bowerrc', '.bowerrc');
    // this.template('Vagrantfile', 'Vagrantfile');
    // this.template('README.md', 'README.md');
    // this.template('_build.xml', 'build.xml');
    this.template('_Gulpfile.js', 'Gulpfile.js');

    // this.fs.copy(
    //   this.templatePath('app/build/parameters.yml.dist'),
    //   this.destinationPath('app/build/parameters.yml.dist')
    // );
  },

  // moveChuck: function () {
  //   var done = this.async();
  //   fs.copy('./ChuckCSS-master/less/', './app/Resources/themes/default/less', function (err) {
  //       fs.remove('./ChuckCSS-master/');
  //       done();
  //   });
  // },


  // updateConfig: function () {
  //   var config = yaml.safeLoad(fs.readFileSync('app/config/config.yml'));

  //   config['parameters']['theme'] = 'default';
  //   config['parameters']['locale'] = 'fr';

  //   config['stof_doctrine_extensions'] = {
  //     'default_locale': 'fr_FR',
  //     'orm': {
  //       'default': {
  //         'timestampable': true
  //       }
  //     }
  //   };

  //   config['twig']['paths'] = ["%kernel.root_dir%/Resources/themes/default/views/"];

  //   var newConf = yaml.dump(config, {indent: 4});
  //   fs.writeFileSync('app/config/config.yml', newConf);
  // },

  // install: {
  //   installComponents: function () {
  //     fs.copySync(this.templatePath('src'), this.destinationPath('src'));
  //     this.installDependencies({
  //       npm: true,
  //       bower: true,
  //       skipInstall: false
  //     });

  //     // this.spawnCommand('bower', ['install', '--config.interactive=false']);
  //   },
  //   updateAppKernel: function () {
  //     var appKernelPath = './app/AppKernel.php';
  //     var appKernelContents = htmlWiring.readFileAsString('./app/AppKernel.php');
  //     var newAppKernelContents = appKernelContents.replace('new Doctrine\\Bundle\\DoctrineBundle\\DoctrineBundle(),\n            ', '');
  //     newAppKernelContents = newAppKernelContents.replace('new Sensio\\Bundle\\FrameworkExtraBundle\\SensioFrameworkExtraBundle(),', 'new Sensio\\Bundle\\FrameworkExtraBundle\\SensioFrameworkExtraBundle(),\n            //Doctrine\n            new Doctrine\\Bundle\\DoctrineBundle\\DoctrineBundle(),\n            new Stof\\DoctrineExtensionsBundle\\StofDoctrineExtensionsBundle(),');
  //     newAppKernelContents = newAppKernelContents.replace('Sensio\\Bundle\\GeneratorBundle\\SensioGeneratorBundle();', 'Sensio\\Bundle\\GeneratorBundle\\SensioGeneratorBundle();\n            $bundles[] = new Doctrine\\Bundle\\FixturesBundle\\DoctrineFixturesBundle();\n            $bundles[] = new Elao\\WebProfilerExtraBundle\\WebProfilerExtraBundle();');
  //     fs.writeFileSync(appKernelPath, newAppKernelContents);
  //   },
  //   installBundle: function () {
  //     var appKernelPath = './composer.json';
  //     var appKernelContents = htmlWiring.readFileAsString('./composer.json');
  //     var newAppKernelContents = appKernelContents.replace('\"relative\"', '\"symlink\"');
  //     fs.writeFileSync(appKernelPath, newAppKernelContents);

  //     var yo = this;
  //     var sc = this.spawnCommand('composer', ['require', '--no-update', 'stof/doctrine-extensions-bundle']);
  //     sc.on('close', function(code) {
  //         var sc2 = yo.spawnCommand('composer', ['require', '--no-update', '--dev',
  //           'elao/web-profiler-extra-bundle',
  //           'doctrine/doctrine-fixtures-bundle',
  //           'fzaninotto/faker',
  //           'nelmio/alice'
  //         ]);
  //         sc2.on('close', function(code) {
  //           yo.spawnCommand('composer', ['update']);
  //         });
  //     });
  //   },
  // },
  // end: {

  // }

});
