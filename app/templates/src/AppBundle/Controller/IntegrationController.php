<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Ce controller est utilisé uniquement pour l'intégration des nouvelles pages sur lesquelles les développeurs ne sont
 * pas encore intervenues.
 * @developers : Quand vous dynamisez une intégration, merci de faire le ménage dans le fichier actuel. S'il est vide,
 * merci de supprimer le fichier
 * @integrators : Veillez à respecter les conventions de nommages des fichiers twig svp
 */
class IntegrationController extends Controller
{
    /**
     * @Route("/ma-super-page", name="super_page")
     */
    public function defaultAction()
    {
        return $this->render('page/super_page.html.twig', [

        ]);
    }
    

}

