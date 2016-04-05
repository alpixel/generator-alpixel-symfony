#STAGE
set :stages, %w(production preprod)
set :default_stage, "production"
require 'capistrano/ext/multistage'

#Set application to the url of the project
set :application, "www.changeme.com"

#SSH OPTIONS
ssh_options[:username] = 'u_changeme'
ssh_options[:keys] = "/home/deployer/.ssh/id_rsa"
ssh_options[:port] = 2508
set :use_sudo, false
set :runner,   "u_changeme"
set :user, "u_changeme"

#Set repository is the path to the Git repository to deploy from. Capistrano will ssh into the server,
#so the user specified below must be able to ssh into the server
set :repository, "ssh://git@git.alpixel.fr:7999/CM/www.changeme.com.ch.git"
set :deploy_mode, "full"

#Optional Settings
#This allows Capistrano to prompt for passwords
default_run_options[:pty] = false

#The following lines tell Capistrano where to deploy the project
set :deploy_to, "/data/www/#{application}/production" # defaults to "/u/apps/#{application}"
set :current_path, "#{deploy_to}/current"
set :releases_path, "#{deploy_to}/releases"
set :shared_path, "#{deploy_to}/shared"

#This tells Capistrano that I'm using Git for versioning.
set :scm, :git

set :keep_releases, 5
set :deploy_via, :remote_cache


#And here are the tasks required to deploy a simple project
namespace :deploy do
    namespace :web do
        desc <<-DESC
        Present a maintenance page to visitors. Disables your application's web \
        interface by writing a "#{maintenance_basename}.html" file to each web server. The \
        servers must be configured to detect the presence of this file, and if \
        it is present, always display it instead of performing the request.

        Customized task allow us to render erb file. Usage:

        $ cap deploy:web:disable \\
                REASON="hardware upgrade" \\
                UNTIL="12pm Central Time"

        DESC
        task :disable do
            on_rollback { run "rm -f #{shared_path}/system/maintenance.html" }
            maintenance = File.read("./app/Resources/themes/default/views/page/maintenance.html")
            put maintenance, "#{shared_path}/system/maintenance.html", :mode => 0644
        end
	task :restart do
	        run "sudo /etc/init.d/nginx restart"
	        run "sudo /usr/sbin/service php5-fpm restart"
	end
    end
    task:populate do
	run "php #{current_path}/app/console fos:elastica:populate --env='prod'"
    end
    task:start do
    end
    task:stop do
    end
    task:finalize_update do
        run "chmod -R g+w #{release_path}"
    end
    task:restart do
    end
end

before "deploy:update" do
    run "ls -1dt #{releases_path}/* | tail -n +4 | xargs rm -rf"
end

after "deploy:restart" do
    #add any tasks in here that you want to run after the project is deployed
    run "rm -rf #{release_path}/.git #{release_path}/Capfile #{release_path}/config/*.rb #{release_path}/config/deploy"
    run "rm -rf #{current_path}/web/upload #{release_path}/web/app_jenkins.php"
    run "rm -rf #{release_path}/web/Vagrantfile"
    run "rm -rf #{release_path}/web/bower.json"
    run "rm -rf #{release_path}/web/build.xml"
    run "rm -rf #{release_path}/web/*.md"

    if "#{rails_env}" == 'production'
        run "rm #{release_path}/web/app_dev.php"
    end

    run "ln -s #{shared_path}/app/config/parameters.yml.dist #{current_path}/app/config/parameters.yml"
    run "ln -s #{shared_path}/app/logs #{current_path}/app/logs"
    run "ln -s #{shared_path}/system #{current_path}/web/system"
    run "ln -s #{shared_path}/web/upload #{current_path}/web/upload"
    run "ln -s #{shared_path}/sitemap.xml #{current_path}/sitemap.xml"

    #Composer
    run "rm -rf #{current_path}/vendor"
    run "ln -s #{shared_path}/vendor #{current_path}/vendor"
    run "ln -s #{shared_path}/composer.lock #{current_path}/composer.lock"

    run "composer install --optimize-autoloader --prefer-dist --working-dir=#{current_path}"
    
    #Mise a jour des caches
    run "php #{current_path}/app/console cache:clear --env='prod' --no-debug"
    run "php #{current_path}/app/console assetic:dump --env='prod' --no-debug"
    run "php #{current_path}/app/console assets:install --symlink #{current_path}/web"
    run "php #{current_path}/app/console cache:warmup --env='prod' --no-debug"


    #Mise Ãƒ  jour BDD
    run "php #{current_path}/app/console doctrine:schema:update --force --complete --dump-sql"
  # run "php #{current_path}/app/console doctrine:migrations:migrate --no-interaction"

    run "php #{current_path}/app/console cron:scan"
end

before "deploy:update_code", "deploy:web:disable"
after "deploy", "deploy:cleanup"
after "deploy", "deploy:web:enable"
after "deploy", "deploy:web:restart"
