{% extends 'layout.html' %}
{% block title %}{% parent %}{% endblock %}
{% block head %}
  {% parent %}
{% endblock %}
{% block content %}
{# <div class="carousel slide" id="myCarousel" data-interval="8000">
    <div class="hover-container">
      <div class="carousel-inner">{% for img in photos %}
        <div class="item{% if loop.first %} active{% endif %}"><img alt="Engagement Photo" src="{{ img.medsrc }}"></div>{% endfor %}
      </div>
      <a class="carousel-control left" href="#myCarousel" data-slide="prev"><i class="icon-chevron-left icon-2"></i></a>
      <a class="carousel-control right" href="#myCarousel" data-slide="next"><i class="icon-chevron-right icon-2"></i></a>
    </div>
    <div style="display:inline-block"><i class="icon-chevron-left icon-1"></i></div>
    <div class="carousel-indicators" style="display:inline-block; height:67px;overflow:hidden;">{% for img in photos %}
      <div data-target="#myCarousel" data-slide-to="{{ loop.index0 }}" {% if loop.first %}class="active" {% endif %}style="display:inline-block;"><img alt="Engagement Photo Thumbnail" src="{{ img.thmbsrc }}" style="height:67px;"></div>{% endfor %}
    </div>
    <div style="display:inline-block"><i class="icon-chevron-right icon-1"></i></div>
    <!-- div class="carousel-caption"><h4>{{ img.title }}</h4>{{ img.subtitle }}</div -->
  </div> #}
  More coming soon...<br>
  <div id="links">
    {% for img in photos %}<a href="{{ img.lrgsrc }}" data-gallery="#blueimp-gallery"><img alt="Engagement Photo Thumbnail" src="{{ img.thmbsrc }}"></a>
    {% endfor %}
  </div>
{% endblock %}
{% block footer %}
  <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls" 
  data-continuous="true" 
  data-toggle-controls-on-return="true" 
  data-toggle-slideshow-on-space="true" 
  data-enable-keyboard-navigation="true" 
  data-close-on-escape="true" 
  data-close-on-slide-click="true">
    <div class="slides"></div>
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
  </div>
{% endblock %}
