<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class IntegrationController extends Controller
{
    /**
     * @Route("/ma-super-page", name="super_page")
     */
    public function defaultAction()
    {
        return $this->render('page/super_page.html.twig', array(

        ));
    }
    

}

