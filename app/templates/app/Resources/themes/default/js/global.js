(function($) {

        /* @ global vars */
    smartWidthMin = 0;
    smartWidthMax = 767;

    tablWidthMin = 768;
    tablWidthMax = 1200;

    windowWidthMin = 1201;
    currentWindowWidth = window.innerWidth || document.documentElement.clientWidth|| document.body.clientWidth;
    currentWindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    /*
        @name : setCookie, getCookie, checkCookie
        @function : check, get et set a cookie
    */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname +"=" + cvalue + "; " + expires + ";path=/";
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";
    }
    function checkCookie(cname) {
        var user = getCookie(cname);
        return (user != "") ? true : false;
    }

    /*
        OUTDATEDBROWSER : inspired by http://outdatedbrowser.com/fr
        @function : check id browser support css3 transitions. If yes, return true, if not, return false (so display #outdated div)
        @return : true or false
    */
    // check if transition is in the browsert CSSStyleDeclaration
    $.support.transition = (function(){
        var thisBody = document.body || document.documentElement;
        var thisStyle = thisBody.style;
        var support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
        return support;
    })();


    $(function () {

        /*
            -- @ OUTDATEDBROWSER @ --
        */
        if(!$.support.transition) {
            var htmlOutDated = '<h6>Ce navigateur internet est dépassé !</h6><p>Mettez à jour votre navigateur internet pour bénéficier de toutes les fonctionnalités du site.<a class="btnUpdateBrowser" href="http://outdatedbrowser.com/">Mettre à jour maintenant</a></p>';
            $('#outdated').html(htmlOutDated).addClass('shown');
        } else {
            $('#outdated').hide();
        }

        /*
            -- @ FASTCLICK @ --
            * Init FastClick on phone devices
        */
        if(currentWindowWidth <= smartWidthMax) {
            window.addEventListener('load', function() {
                new FastClick(document.body);
            }, false);
        }

        /*
            -- @ COOKIES @ --
            * Show cookies block if ck cookie does not exist
        */
        var user = checkCookie('_ck');
        if(!user)
            $('#cookies').show();

         $('#cookies a').on('click',function(e){
            var isCookify = checkCookie('_ck');
            if(!isCookify)
                setCookie('_ck', 'b326b5062b2f0e69046810717534cb09', '365');

            if($(this).hasClass('close')){
                e.preventDefault();
                $(this).parent().slideUp('fast');
            }
        });

        /*
            -- @ LINKS @ --
        */
        $('a[href$=".pdf"],a.external-link').on('click',function(e){
            e.preventDefault();
            window.open($(this).attr("href"));
        });
        $('a.backToTop').on('click',function(e){
            e.preventDefault();
            $('body,html').animate({scrollTop:0},250,'swing');
        });
        $('a.noLink, a[href="GOTOLINK"]').on('click',function(e){
            e.preventDefault();
        });

                /*
            -- @ FLEXSLIDER @ --
        */
        // if($('.flexslider').length) {

        //     $('.flexslider').each(function(i,el){
        //         var
        //             animation = 'fade',
        //             showArrows = false,
        //             pauseOnAction = false;

        //         // Specific for last news slider
        //         if($(this).hasClass('flex-news')) {
        //             var
        //                 animation = 'slide',
        //                 pauseOnAction = true;
        //         }

        //         // Specific for news detail page
        //         if($(this).hasClass('flex-news-detail')) {
        //             var
        //                 pauseOnAction = true;
        //         }

        //         $(this).flexslider({
        //             animation: animation,
        //             animationLoop: true,
        //             directionNav: showArrows,
        //             controlNav:true,
        //             slideshow:true,
        //             slideShowSpeed : 5000,
        //             pauseOnAction : pauseOnAction,
        //             start : function(slider) {
        //                 slider.find('.flexLoader').fadeOut('fast',function(){
        //                     $(this).remove();
        //                 });
        //             }
        //         });
        //     });
        // }

        /*
            -- @ BACKSTRETCH @ --
            * Attach responsive background-images to elements
        */
        // if($('.backstretch').length) {
        //     $('.backstretch').each(function(i,el){
        //         var imgName = $(this).attr('data-img');

        //         if(imgName != '' || imgName !== 'undefined')
        //             $(this).backstretch(imgName);
        //     });
        // }


    });
})(jQuery);
