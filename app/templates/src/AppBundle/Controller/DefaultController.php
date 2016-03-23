<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    /**
     * @Method("GET")
     * @Route("/", name="homepage", options={"sitemap" = true})
     */
    public function defaultAction()
    {
        $response = new Response();
        $response->setPublic();
        $response->setMaxAge(60);
        $response->setSharedMaxAge(60);
        $response->setContent($this->renderView('page/homepage.html.twig'));
        return $response;
    }
}
