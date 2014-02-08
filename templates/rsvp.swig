{% extends 'layout.html' %}
{% block title %}{% parent %}{% endblock %}
{% block head %}
  {% parent %}
{% endblock %}
{% block content %}
    <div class="span12">
      <iframe src="https://docs.google.com/forms/d/1A09FnbYvyE2KnwAICdbwVytyU2VS5j_H9U856ZpXwAo/viewform?embedded=true&amp;f=Helvetica&amp;tc=666666" style="width:700px;height:700px;border:none;margin:none;">Loading...</iframe>
      <br><br>
      <!--[if !IE]> -->
      <iframe style="width:100%;height:500px;overflow:hidden;border:none;margin:none;display:none;" id="mapframe" src="//maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Five%2BCrowns%2B3801%2BEast%2BCoast%2BHwy%2C%2BCorona%2Bdel%2BMar%2C%2BCA%2B92625&amp;ie=UTF8&amp;z=12&amp;t=m&amp;iwloc=addr&amp;output=embed"></iframe>
      <!-- <![endif]-->
      <!--[if IE]>
      <iframe style="width:100%;height:500px;border:none;margin:none;display:none;" id="mapframe" scrolling="no" src="//maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Five%2BCrowns%2B3801%2BEast%2BCoast%2BHwy%2C%2BCorona%2Bdel%2BMar%2C%2BCA%2B92625&amp;ie=UTF8&amp;z=12&amp;t=m&amp;iwloc=addr&amp;output=embed"></iframe>
      <![endif]-->
      <noscript>
        <a href="//maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Five%2BCrowns%2B3801%2BEast%2BCoast%2BHwy%2C%2BCorona%2Bdel%2BMar%2C%2BCA%2B92625&amp;ie=UTF8&amp;z=12&amp;t=m&amp;iwloc=addr" target="_blank"><img src="/images/map.png" alt="Map"></a>
      </noscript><br>
      <small style="display:none;" id="smalltext"><a href="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Five%2BCrowns%2B3801%2BEast%2BCoast%2BHwy%2C%2BCorona%2Bdel%2BMar%2C%2BCA%2B92625&amp;ie=UTF8&amp;z=12&amp;t=m&amp;iwloc=addr" target="_blank">View Larger Map</a></small>
    </div>

    <div class="alert alert-success {{thanksdiv}}">{{thanks}}</div>
    <div class="alert alert-error {{errordiv}}">{{error}}</div>


{% endblock %}
