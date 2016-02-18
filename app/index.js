
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
            value: 'alpixel/userbundle:dev-feature/v2',
            checked: true
          },
          {
            name: 'AlpixelCMSBundle',
            value: 'alpixel/cmsbundle:@dev',
            checked: true
          },
          {
            name: 'AlpixelMenuBundle',
            value: 'alpixel/menu-bundle:@dev',
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
            checked: false
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

  downloadChuck: function() {
    var done = this.async();
    this._unzip('https://github.com/alpixel/ChuckCSS/archive/master.zip', this.destinationRoot(), function (err, remote) {
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

  writing: function() {
    fs.remove('./Symfony/');
    fs.remove('./vendor/');
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

    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
    this.template('_editorconfig', '.editorconfig');
    this.template('_bowerrc', '.bowerrc');
    this.template('Vagrantfile', 'Vagrantfile');
    this.template('README.md', 'README.md');
    this.template('_build.xml', 'build.xml');
    this.template('_Gulpfile.js', 'Gulpfile.js');
  },

  changeParameters: function() {
    var config = yaml.safeLoad(fs.readFileSync('app/config/parameters.yml.dist'));

    config['parameters']['admin_path'] = '/admin';
    config['parameters']['theme'] = 'front';
    config['parameters']['lib_dir'] = 'lib';

    if (this.bundles['bundlesCustom'].indexOf('sonata-admin') !== -1) {
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

  moveChuck: function () {
    var done = this.async();
    fs.copy('./ChuckCSS-master/less/', './app/Resources/themes/default/less', function (err) {
        fs.remove('./ChuckCSS-master/');
        done();
    });
  },


  updateConfig: function () {
    var config = yaml.safeLoad(fs.readFileSync('app/config/config.yml'));

    config['stof_doctrine_extensions'] = {
      'default_locale': 'fr_FR',
      'orm': {
        'default': {
          'timestampable': true
        }
      }
    };

    config['framework']['session'] = {
      'name': "ALPIXEL_SESSID",
      'handler_id': null,
    };


    if (this.isMultilingual) {
      config['framework']['translator'] = {
        'fallback': ["%default_locale%"],
      };

      config['jms_translation'] = {
        'locales': '%enabled_locales%',
        'source-language': '%default_locale%',
        'configs': {
          'app': {
            'dirs': ['%kernel.root_dir%', '%kernel.root_dir%/../src'],
            'output_dir': '%kernel.root_dir%/Resources/translations',
            'ignored_domains': ['SonataAdminBundle'],
            'excluded_names': ["*TestCase.php", "*Test.php", "*Admin.php"],
            'excluded_dirs': ["cache", "data", "logs"],
            'extractors': ['jms_i18n_routing']
          }
        }
      }

      config['jms_i18n_routing'] = {
        'default_locale': '%default_locale%',
        'locales': '%enabled_locales%',
        'strategy': 'prefix',
      };

      config['lunetics_locale'] = {
        'allowed_locales': '%enabled_locales%',
        'guessing_order': ['query', 'router', 'session', 'browser'],
      };
    }


    if (this.bundles['bundlesCustom'].indexOf('alpixel/cmsbundle:@dev') !== -1) {
      fs.writeFileSync('app/config/cms.yml', yaml.dump({
        'cms': {
          'content_types': {}
        }
      }, {indent: 4}));
      config['imports'].push({'resource': 'cms.yml'});
    }

    if (this.bundles['bundlesCustom'].indexOf('alpixel/userbundle:dev-feature/v2') !== -1) {
      config['fos_user'] = {
        'db_driver': 'orm',
        'firewall_name': 'main',
        'user_class': 'AppBundle\\Entity\\User'
      };

      fs.writeFileSync('app/config/security.yml', yaml.dump({
        'imports': [{
          'resource': '@AlpixelUserBundle/Resources/config/security.yml'
        }]
      }, {indent: 4}));
    }

    config['twig']['paths'] = ["%kernel.root_dir%/Resources/themes/default/views/"];

    var newConf = yaml.dump(config, {indent: 4});
    fs.writeFileSync('app/config/config.yml', newConf);
  },

  updateAppKernel: function () {
    var appKernelPath = './app/AppKernel.php';
    var appKernelContents = htmlWiring.readFileAsString('./app/AppKernel.php');
    var newAppKernelContents = appKernelContents.replace('new Doctrine\\Bundle\\DoctrineBundle\\DoctrineBundle(),\n            ', '');
    newAppKernelContents = newAppKernelContents.replace('new Sensio\\Bundle\\FrameworkExtraBundle\\SensioFrameworkExtraBundle(),', 'new Sensio\\Bundle\\FrameworkExtraBundle\\SensioFrameworkExtraBundle(),\n            //Doctrine\n            new Doctrine\\Bundle\\DoctrineBundle\\DoctrineBundle(),\n            new Stof\\DoctrineExtensionsBundle\\StofDoctrineExtensionsBundle(),');
    newAppKernelContents = newAppKernelContents.replace('Sensio\\Bundle\\GeneratorBundle\\SensioGeneratorBundle();', 'Sensio\\Bundle\\GeneratorBundle\\SensioGeneratorBundle();\n            $bundles[] = new Doctrine\\Bundle\\FixturesBundle\\DoctrineFixturesBundle();\n            $bundles[] = new Elao\\WebProfilerExtraBundle\\WebProfilerExtraBundle();');

    var customBundles = "";
    customBundles += "\n";

    if (this.bundles['bundlesCustom'].indexOf('sonata-admin') !== -1) {
      customBundles += "            // Admin" + "\n";
      customBundles += "            new Sonata\\CoreBundle\\SonataCoreBundle()," + "\n";
      customBundles += "            new Sonata\\DoctrineORMAdminBundle\\SonataDoctrineORMAdminBundle()," + "\n";
      customBundles += "            new Sonata\\AdminBundle\\SonataAdminBundle()," + "\n";
      customBundles += "            new Sonata\\BlockBundle\\SonataBlockBundle()," + "\n";
      customBundles += "            new Ivory\\CKEditorBundle\\IvoryCKEditorBundle()," + "\n";
      customBundles += "\n";
    }

    if (this.isMultilingual) {
      customBundles += "            //i18n" + "\n";
      customBundles += "            new Lunetics\\LocaleBundle\\LuneticsLocaleBundle()," + "\n";
      customBundles += "            new JMS\\I18nRoutingBundle\\JMSI18nRoutingBundle()," + "\n";
      customBundles += "            new JMS\\TranslationBundle\\JMSTranslationBundle()," + "\n";
      customBundles += "\n";
    }

    customBundles += "            //Alpixel" + "\n";
    if (this.bundles['bundlesCustom'].indexOf('alpixel/userbundle:dev-feature/v2') !== -1) {
      customBundles += "            new Alpixel\\Bundle\\UserBundle\\AlpixelUserBundle()," + "\n";
    }

    if (this.bundles['bundlesCustom'].indexOf('alpixel/cmsbundle:@dev') !== -1) {
      customBundles += "            new FOS\\UserBundle\\FOSUserBundle()," + "\n";
      customBundles += "            new Alpixel\\Bundle\\CMSBundle\\CMSBundle()," + "\n";
    }

    if (this.bundles['bundlesCustom'].indexOf('alpixel/cronbundle') !== -1) {
      customBundles += "            new Alpixel\\Bundle\\CronBundle\\CronBundle()," + "\n";
    }

    if (this.bundles['bundlesCustom'].indexOf('alpixel/menu-bundle:@dev') !== -1) {
      customBundles += "            new Knp\\Bundle\\MenuBundle\\KnpMenuBundle()," + "\n";
      customBundles += "            new Alpixel\\Bundle\\MenuBundle\\AlpixelMenuBundle()," + "\n";
    }

    if (this.bundles['bundlesCustom'].indexOf('alpixel/seobundle') !== -1) {
      customBundles += "            new Sonata\\SeoBundle\\SonataSeoBundle()," + "\n";
      customBundles += "            new Alpixel\\Bundle\\SEOBundle\\SEOBundle()," + "\n";
    }

    customBundles += "\n";
    customBundles += "            new AppBundle\\AppBundle(),";
    newAppKernelContents = newAppKernelContents.replace('new AppBundle\\AppBundle(),', customBundles);

    fs.writeFileSync(appKernelPath, newAppKernelContents);
  },

  requireBundles: function() {
    var done = this.async();

    var bundles = ['stof/doctrine-extensions-bundle'];

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
      'elao/web-profiler-extra-bundle',
      'doctrine/doctrine-fixtures-bundle',
      'fzaninotto/faker',
      'nelmio/alice'
    ]);
    sc.on('close', function(code) {
      done();
    });
  },

  install: {
    installComponents: function () {
      fs.copySync(this.templatePath('src'), this.destinationPath('src'));
    //   this.installDependencies({
    //     npm: true,
    //     bower: true,
    //     skipInstall: false
    //   });
    //   // this.spawnCommand('bower', ['install', '--config.interactive=false']);
    },
    installBundle: function() {
      var appKernelPath = './composer.json';
      var appKernelContents = htmlWiring.readFileAsString('./composer.json');
      var newAppKernelContents = appKernelContents.replace('\"relative\"', '\"symlink\"');
      var newAppKernelContents = appKernelContents.replace('\"5\.3\.9\"', '\"5.5\"');
      fs.writeFileSync(appKernelPath, newAppKernelContents);
      this.spawnCommand('composer', ['update', '--ignore-platform-reqs']);
    }
  },
  end: {
    // console.log(' 👍 Installation terminée ! Ne pas oublier d\'optimiser le app.php en décommentant les lignes appropriées');
  }
});
