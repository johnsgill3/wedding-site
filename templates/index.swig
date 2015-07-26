{% extends 'layout.html' %}
{% block title %}Home - {% parent %}{% endblock %}
{% block head %}
  {% parent %}
  <!--link rel="stylesheet" href="css/custom.css"-->
{% endblock %}
{% block content %}
<!--img alt="Engagement Photo" src="/images/DSC_4305-2.jpg"-->
<iframe src="//player.vimeo.com/video/106696611?api=1&player_id=player" width="691" height="460" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen id="player"></iframe>
{% endblock %}
