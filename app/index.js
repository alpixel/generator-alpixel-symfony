
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs-extra');
var merge = require('merge');
var rmdir = require('rimraf');
var child_process = require('child_process');
var request = require('request');
var _ = require('lodash');
var Download = require('download');
var htmlWiring = require("html-wiring");

var symfonyDistribution = {
  host: 'https://symfony.com/download?v=Symfony_Standard_Vendors_',
  commit: 'lts',
  ext: 'zip'
};

module.exports = yeoman.Base.extend({

  initializing: function () {
    this.pkg = require('../package.json');
    var ALPIXEL = chalk.yellow.bgBlack.white('\n          _      _____ _______   ________ _\n     /\   | |    |  __ \_   _\ \ / /  ____| |\n    /  \  | |    | |__) || |  \ V /| |__  | |\n   / /\ \ | |    |  ___/ | |   > < |  __| | |\n  / ____ \| |____| |    _| |_ / . \| |____| |____\n /_/    \_\______|_|   |_____/_/ \_\______|______|');
    this.log(ALPIXEL);
  },

  getTagSymfony: function () {
    var done = this.async();
    var invalidEntries = 0;

    function filterByTag(obj) {
      if ('installable' === obj || 'non_installable' === obj) {
        invalidEntries++;
        return false;
      } else {
        return true;
      }
    }

    request('https://symfony.com/versions.json', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        this.parsed = JSON.parse(body);
        var filtered = Object.keys(this.parsed);
        this.versionSf2 = filtered.filter(filterByTag);
        done();
      } else {
        console.log(chalk.red('A problem occurred'), error);
      }
    }.bind(this));
  },

  _unzip: function (archive, destination, opts, cb) {
    if (_.isFunction(opts) && !cb) {
      cb = opts;
      opts = { extract: true, mode: '755' };
    }

    opts = _.assign({ extract: true, mode: '755' }, opts);

    var log = this.log.write()
      .info('... Fetching %s ...', archive)
      .info(chalk.yellow('This might take a few moments'));

    var download = new Download(opts)
      .get(archive)
      .dest(destination)
      .use(function (res) {
        res.on('data', function () {});
      });

    download.run(function (err) {
      if (err) {
        return cb (err);
      }

      log.write().ok('Done in ' + destination).write();
      cb();
    });
  },

  askMultilingual: function() {
    var done = this.async();

    var prompts = [{
      type: 'confirm',
      name: 'isMultilingual',
      message: 'Est-ce que le site est multilingue ?',
      default: false,
    }];

    this.prompt(prompts, function (answers) {
      this.isMultilingual = answers.isMultilingual;
      done();
    }.bind(this));
  },

  askBundles: function() {
    var done = this.async();
    var prompts = [{
        type: 'checkbox',
        name: 'bundlesCustom',
        message: 'Est-ce que je dois installer des bundles/fonctionnalités ?',
        choices: [
          {
            name: 'Sonata',
            value: 'sonata-project',
            checked: true
          },
          {
            name: 'AlpixelUserBundle',
            value: 'alpixel/userbundle',
            checked: true
          },
          {
            name: 'AlpixelMediaBundle',
            value: 'alpixel/mediabundle',
            checked: true
          },
          {
            name: 'AlpixelCMSBundle',
            value: 'alpixel/cmsbundle',
            checked: true
          },
          {
            name: 'AlpixelMenuBundle',
            value: 'alpixel/menu-bundle',
            checked: true
          },
          {
            name: 'AlpixelSEOBundle',
            value: 'alpixel/seobundle',
            checked: true
          },
          {
            name: 'AlpixelCronBundle',
            value: 'alpixel/cronbundle',
            checked: true
          },
          {
            name: 'FOSElasticaBundle',
            value: 'friendsofsymfony/elastica-bundle',
            checked: false,
          }
        ]
    }];

    this.prompt(prompts, function (answers) {
      this.bundles = answers;
      done();
    }.bind(this));
  },

  symfonyBase: function () {
    var done = this.async();
    var symfonyCommit = this.parsed[symfonyDistribution.commit];

    var appPath = this.destinationRoot();
    var repo = symfonyDistribution.host + symfonyCommit  + '.' + symfonyDistribution.ext;

    this._unzip(repo, appPath, function (err, remote) {
      if (err) {
      console.log(' 💩 ' + chalk.red(' ARRRRR '));
        console.log(err);
        return;
      } else {
        console.log(' 👍 ' + chalk.green(' Download success ! '));
        done();
      }
    });
  },

  moveSymfonyBase: function () {
    var done = this.async();
    fs.copy('./Symfony/', '.', function (err) {
      done();
    });
  },

  checkBower: function () {
    this.globalBower = false;

    if (this.bootStrapSass) {
      var done = this.async();

      child_process.execFile('bower', ['-v'], function (error, stdout, stderr) {
        if (error !== null) {
          var prompts = [{
            type: 'confirm',
            name: 'checkBower',
            message: chalk.red('WARNING: No global bower installation found. We will install it locally if you decide to continue. Continue ?'),
            default: true
          }];
          this.prompt(prompts, function (answers) {
            if (answers.checkBower) {
              child_process.exec('npm install -g bower', function (error, stdout, stderr) {
                if (error !== null) {
                  console.log('exec error: ' + error);
                } else {
                  console.log(chalk.green('Installing bower locally.'));
                  console.log('See ' + chalk.yellow('http://bower.io/') + ' for more details on bower.');
                  console.log('');
                  this.globalBower = true;
                  done();
                }
              }.bind(this));
            } else {
              console.log(chalk.red('Bower did not installed locally!'));
              done();
            }
          }.bind(this));
        } else {
          this.globalBower = true;
          done();
        }
      }.bind(this));
    }
  },

  writing: {
    copyFiles: function() {
      fs.remove('./Symfony/');
      fs.remove('./vendor/');
      fs.remove('./UPGRADE*');
      fs.remove('./app/Resources/views');
      fs.remove(this.destinationPath('./src'));
      fs.remove('./README.md');
      fs.remove('./LICENSE');

      fs.copySync(this.templatePath('app'), this.destinationPath('app'));
      fs.copySync(this.templatePath('web'), this.destinationPath('web'));

      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );

      if (this.bundles['bundlesCustom'].indexOf('sonata-project') !== -1) {
        this.template('app/config/admin.yml', 'app/config/admin.yml');
      } else {
        fs.remove('./app/config/admin.yml')
      }

      if (this.bundles['bundlesCustom'].indexOf('friendsofsymfony/elastica-bundle') !== -1) {
        this.template('app/config/elastica.yml', 'app/config/elastica.yml');
      } else {
        fs.remove('./app/config/elastica.yml')
      }

      //Symfony 3 structure for Symfony 2.*
      this.fs.move('./app/console', './bin/console');
      fs.mkdir('./var');
      this.fs.move('./app/cache', './var/');
      this.fs.move('./app/logs', './var/');
      fs.remove('./app/boostrap.php.cache');

      this.template('app/config/routing.yml', 'app/config/routing.yml');
      this.template('new_config.yml', 'new_config.yml');
      this.template('new_config_dev.yml', 'new_config_dev.yml');
      this.template('app/Resources/themes/default/views/layout/base.html.twig', 'app/Resources/themes/default/views/layout/base.html.twig');
      this.template('_bower.json', 'bower.json');
      this.template('_package.json', 'package.json');
      this.template('_editorconfig', '.editorconfig');
      this.template('_bowerrc', '.bowerrc');
      this.template('Vagrantfile', 'Vagrantfile');
      this.template('README.md', 'README.md');
      this.template('_build.xml', 'build.xml');
      this.template('_Gulpfile.js', 'Gulpfile.js');
    },
  },

  changeParameters: function() {
    fs.remove('./app/config/parameters.yml');
    var config = yaml.safeLoad(fs.readFileSync('app/config/parameters.yml.dist'));

    config['parameters']['database_name'] = 'symfony';
    config['parameters']['database_user'] = 'root';
    config['parameters']['database_password'] = 'root';
    config['parameters']['admin_path'] = '/admin';
    config['parameters']['theme'] = 'default';
    config['parameters']['lib_dir'] = 'lib';
    config['parameters']['mailer_port'] = null;
    config['parameters']['url_production'] = "http://"+this.appname;

    if (this.bundles['bundlesCustom'].indexOf('friendsofsymfony/elastica-bundle') !== -1) {
      config['parameters']['elastic_index'] = null;
      config['parameters']['elastic_host'] = null;
      config['parameters']['elastic_port'] = null;
    }

    config['parameters']['default_locale'] = 'fr';
    if (this.isMultilingual) {
      config['parameters']['enabled_locales'] = ['fr'];
    }

    var newConf = yaml.dump(config, {indent: 4});
    fs.writeFileSync('app/config/parameters.yml.dist', newConf);
  },

  updateAppKernel: function () {
      this.template('app/AppKernel.php', 'app/AppKernel.php');
  },

  requireBundles: function() {
    var done = this.async();

    var bundles = ['stof/doctrine-extensions-bundle', 'alpixel/deployer-recipes'];

    for (var i = 0; i < this.bundles['bundlesCustom'].length; i++) {
      if (this.bundles['bundlesCustom'][i] == 'sonata-project') {
        bundles = bundles.concat([
          'sonata-project/block-bundle:@dev', 'sonata-project/admin-bundle:@dev',
          'sonata-project/doctrine-orm-admin-bundle:@dev', 'sonata-project/core-bundle:@dev'
        ]);
      } else if (this.bundles['bundlesCustom'][i] == 'alpixel/seobundle') {
        bundles = bundles.concat([
          'alpixel/seobundle', 'sonata-project/seo-bundle'
        ]);
      } else {
        bundles = bundles.concat([this.bundles['bundlesCustom'][i]]);
      }
    }

    if (this.isMultilingual) {
      bundles = bundles.concat([
        'lunetics/locale-bundle', 'jms/i18n-routing-bundle',
        'jms/translation-bundle'
      ]);
    }

    var sc = this.spawnCommand('composer', ['require', '--no-update'].concat(bundles));
    sc.on('close', function(code) {
      done();
    });
  },

  requireBundleDev: function() {
    var done = this.async();
    var sc = this.spawnCommand('composer', ['require', '--no-update', '--dev',
      'doctrine/doctrine-fixtures-bundle',
      'fzaninotto/faker',
      'nelmio/alice'
    ]);
    sc.on('close', function(code) {
      done();
    });
  },

  install: {
    updateConfig: function () {

      if (this.bundles['bundlesCustom'].indexOf('alpixel/cmsbundle') !== -1) {
        fs.writeFileSync('app/config/cms.yml', yaml.dump({
          'cms': {
            'content_types': {}
          }
        }, {indent: 4}));
      }

      fs.writeFileSync('app/config/security.yml', yaml.dump({
        'imports': [{
          'resource': '@AlpixelUserBundle/Resources/config/security.yml'
        }]
      }, {indent: 4}));

      var config = yaml.safeLoad(fs.readFileSync('app/config/config.yml'));
      config['doctrine']['dbal'] = {};

      var yoConfig = yaml.safeLoad(fs.readFileSync('new_config.yml'));
      var newConfig = merge.recursive(config, yoConfig);

      var newConf = yaml.dump(newConfig, {indent: 4});
      fs.remove('new_config.yml');
      fs.writeFile('app/config/config.yml', newConf);

      //Same for dev
      var config = htmlWiring.readFileAsString('./app/config/config_dev.yml');
      var yoConfig = htmlWiring.readFileAsString('new_config_dev.yml');

      var newConfig = config.replace('framework:', yoConfig+'\n\nframework:');
      fs.writeFile('app/config/config_dev.yml', newConfig);
      fs.remove('new_config_dev.yml');
    },
    installComponents: function () {
      fs.copySync(this.templatePath('src'), this.destinationPath('src'));
      this.installDependencies({
        npm: true,
        bower: true,
        skipInstall: false
      });
    },
    installBundle: function() {
      var appKernelPath = './composer.json';
      var appKernelContents = htmlWiring.readFileAsString('./composer.json');
      var newAppKernelContents = appKernelContents.replace('\"relative\"', '\"symlink\"');
      newAppKernelContents = appKernelContents.replace('\"5\.3\.9\"', '\"5.5\"');
      newAppKernelContents = newAppKernelContents.replace('\"symfony-web-dir\": \"web\",', '        \"symfony-web-dir\": \"web\",\n\"symfony-bin-dir\": \"bin\",\n        \"symfony-var-dir\": \"var\",');

      fs.writeFileSync(appKernelPath, newAppKernelContents);
      this.spawnCommand('composer', ['update', '--ignore-platform-reqs']);
    }
  },
  end: function() {
    console.log(' 👍 Installation terminée !');
    console.log(' Pour finaliser l\'installation sur un vagrant :  !');
    console.log(' php app/console doctrine:database:create');
    console.log(' php app/console doctrine:schema:update --force');
    console.log(' php app/console doctrine:fixtures:load');
  }
});
