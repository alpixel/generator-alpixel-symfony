<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage", options={"sitemap" = true})
     */
    public function defaultAction()
    {
        $entityManager = $this->get('doctrine.orm.entity_manager');

        return $this->render('page/homepage.html.twig', array(
        ));
    }
}
