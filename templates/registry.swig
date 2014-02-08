<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}StephanieAndGreg.us{% endblock %}</title>
    {% block head %}
    {% endblock %}
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/bootstrap-responsive.min.css">
    <link rel="stylesheet" href="/css/main.css">
    <script type="text/javascript">
      function showLoader(){
      var loadiv = document.getElementById('loading');
      loadiv.style.opacity = '0.95';
      loadiv.style.display = 'block';
    }
    </script>
  </head>
  <body>
    <div id="loading" style="z-index:9999;opacity:0.95;width:100%;height:100%;position:absolute;top:0;left:0;background-color:#6FC7B9;display:none;"></div>
    <script type="text/javascript">
      //showLoader();
    </script>
    <div class="container">
      <div class="masthead">
      </div>
      <div class="hero-unit jumbotron text-center font-hidden"><a href="/"><h1>we're getting married</h1></a>
        <h2>Stephanie &amp; Greg</h2><img alt="dots" src="/images/dots.png"><br>
        <h3>How many spoons do two people need, anyways?</h3>
        <h4 class="muted">all we really need is each other...</h4>
        <span class="muted{% if !thanksdiv or !errordiv %} hidden{% endif %}">in lieu of traditional wedding gifts, we ask that you help us celebrate in these ways:</span>
        <div class="row-fluid text-center">
          <div class="span12">
            <div class="row-fluid">
              <div class="span6 offset3">
                <div class="alert alert-success {{thanksdiv}}">{{thanks|raw}}</div>
                <div class="alert alert-error {{errordiv}}">{{error|raw}}</div>
              </div>
            </div>
            <div class="row-fluid">
              <div class="span6 offset3">
                {#
                <span class="muted">make a gift in any amount to the happy couple:</span>
                <br>
                <div class="row-fluid">
                  <div class="span12">
                    <div class="input-prepend">
                      <span class="add-on muted">$</span>
                      <input class="span8" type="text" placeholder="100"/>
                    </div>
                  </div>
                </div>
                <div class="row-fluid">
                  <div class="span12">
                    <span class="muted">Pay with Paypal/Credit Card</span>
                  </div>
                </div>
                #}
                <div class="row-fluid">
                  <div class="span12">
                    {# TEST BUTTON DO NOT USE FOR PRODUCTION
                    <form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_s-xclick">
                      <input type="hidden" name="hosted_button_id" value="NRXCNME8EMDSQ">
                      <input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                      <img alt="" border="0" src="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
                    </form>
                    #}

                    <div class="row-fluid">
                      <div class="span12">
                        <address>
                          Make a gift in the form of a check. Please mail to:<br>
                          Stephanie and Greg Cochard<br>
                          319 Avenida Cabrillo Apt C<br>
                          San Clemente, CA 92672
                        </address>
                      </div>
                    </div>
                    <hr>
                    <div class="row-fluid">
                      <div class="span12">
                        Bring a Card with a gift enclosed
                      </div>
                    </div>
                    <hr>
                    <div class="row-fluid">
                      <div class="span12">
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                          <input type="hidden" name="cmd" value="_s-xclick">
                          <input type="hidden" name="hosted_button_id" value="BV6NM6ZATLRS6">
                          <button class="btn muted" type="submit" name="submit" value="">Make a gift in any amount<br>to the happy couple:<br>$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nospaces">_____</span></button>
                          <!-- input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" -->
                          <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="row-fluid">
              <div class="span6 offset3">
                B.Y.O.T.<br>
                (bring your own toy)<br>
                <p class="muted">
                  If you would like to bring a gift we ask that you bring a new, 
                  unwrapped toy to donate to the <a href="http://www.choc.org/">Children&apos;s Hospital of Orange County</a>.
                  CHOC relies on toy donations to lift the spirits of children with life-threatening illnesses.
                </p>
                <!--h3>Click for toy wish list.</h3-->
                <span class="muted">Thank you for your generosity!</span>
              </div>
            </div>
            <hr>
            <div class="row-fluid">
              <div class="span12">If you have any questions, please feel free to <a href="/contact">Drop us a note</a></div>
            </div>
            <div class="row-fluid">
              <div class="span8 offset2"><img alt="footer" src="/images/footer-image.png"></div>
              <div class="span2"></div>
            </div>
            <br><br>
            <div class="muted text-center">A Future Mr. &amp; Mrs. Cochard Creation &copy; 2013 all rights reserved</div>
          </div>
        </div>
      </div>
    <div class="coinbase-button" data-code="132021c44bfebd77e2c12592ea9632e5" data-button-style="none" data-custom="donate_btn_1"></div>
    <script data-main="/js/app.js" src="/components/requirejs/require.js"></script>
  </div>
  </body>
</html>
