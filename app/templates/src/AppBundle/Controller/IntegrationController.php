<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class IntegrationController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function defaultAction()
    {
        return $this->render('page/homepage.html.twig', array(

        ));
    }

}

