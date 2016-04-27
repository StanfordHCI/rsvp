from django.db import models

class Image(models.Model):
  url = models.URLField(unique=True)
  cls = models.CharField(max_length=50)
  score = models.IntegerField()

  def tojson(self, mask=False):
    if mask:
      return {'url': self.url, 'class': self.cls, 'score': 0}
    return {'url': self.url, 'class': self.cls, 'score': self.score}
