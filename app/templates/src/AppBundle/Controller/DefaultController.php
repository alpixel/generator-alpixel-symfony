<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\FlattenException;

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


    /**
     * @Route("/erreur", name="error")
     */
    public function showExceptionAction(Request $request, FlattenException $exception)
    {
        $code = $exception->getStatusCode();
        return new Response($this->renderView(
            'page/error.html.twig',
            array(
                'status_code' => $code,
                'exception' => $exception,
            )
        ), $code);
    }
}
