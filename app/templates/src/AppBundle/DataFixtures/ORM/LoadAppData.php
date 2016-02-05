<?php

namespace AppBundle\DataFixtures\ORM;

use Nelmio\Alice\Fixtures;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class LoadAppData extends AbstractFixture implements FixtureInterface, OrderedFixtureInterface
{
    function load(ObjectManager $objectManager)
    {
        $objects = Fixtures::load(__DIR__.'/../../../../app/Resources/fixtures/app.yml', $objectManager);
    }

    public function getOrder()
    {
        return 0;
    }
}
