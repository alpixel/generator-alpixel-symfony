<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),

            //Doctrine
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle(),
            <% if (bundles['bundlesCustom'].indexOf('friendsofsymfony/elastica-bundle') !== -1) { %>

            //ElasticSearch
            new FOS\ElasticaBundle\FOSElasticaBundle(),
            <% } %><% if (bundles['bundlesCustom'].indexOf('sonata-project') !== -1) { %>

            // Admin
            new Sonata\CoreBundle\SonataCoreBundle(),
            new Sonata\DoctrineORMAdminBundle\SonataDoctrineORMAdminBundle(),
            new Sonata\AdminBundle\SonataAdminBundle(),
            new Sonata\BlockBundle\SonataBlockBundle(),
            new Ivory\CKEditorBundle\IvoryCKEditorBundle(),
            <% } %><% if (isMultilingual) { %>

            //i18n
            new Lunetics\LocaleBundle\LuneticsLocaleBundle(),
            new JMS\I18nRoutingBundle\JMSI18nRoutingBundle(),
            new JMS\TranslationBundle\JMSTranslationBundle(),
            <% } %><% if (bundles['bundlesCustom'].indexOf('alpixel/userbundle') !== -1) { %>

            //Alpixel User
            new Alpixel\Bundle\UserBundle\AlpixelUserBundle(),
            new FOS\UserBundle\FOSUserBundle(),
            <% } %><% if (bundles['bundlesCustom'].indexOf('alpixel/cmsbundle') !== -1) { %>

            //Alpixel CMS bundle
            new Alpixel\Bundle\CMSBundle\CMSBundle(),
            <% } %><% if (bundles['bundlesCustom'].indexOf('alpixel/menu-bundle') !== -1) { %>

            //Alpixel Menu
            new Knp\Bundle\MenuBundle\KnpMenuBundle(),
            new Alpixel\Bundle\MenuBundle\AlpixelMenuBundle(),
            <% } %><% if (bundles['bundlesCustom'].indexOf('alpixel/seobundle') !== -1) { %>

            //Alpixel SEO
            new Sonata\SeoBundle\SonataSeoBundle(),
            new Alpixel\Bundle\SEOBundle\SEOBundle(),
            <% } %><% if (bundles['bundlesCustom'].indexOf('alpixel/mediabundle') !== -1) { %>

            //ALPIXEL Media
            new Alpixel\Bundle\MediaBundle\AlpixelMediaBundle(),
            new Liip\ImagineBundle\LiipImagineBundle(),

            <% } %>
            new AppBundle\AppBundle(),
        );

        if (in_array($this->getEnvironment(), array('dev', 'test'), true)) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
            $bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();
            $bundles[] = new Elao\WebProfilerExtraBundle\WebProfilerExtraBundle();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }

    public function getCacheDir()
    {
        return $this->rootDir.'/../var/'.$this->environment.'/cache';
    }

    public function getLogDir()
    {
        return $this->rootDir.'/../var/'.$this->environment.'/logs';
    }
}
