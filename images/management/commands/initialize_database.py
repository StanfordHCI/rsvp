from django.core.management.base import BaseCommand
from images.models import Image

import json

class Command(BaseCommand):
  def handle(self, *args, **options):
    f = open('data.json')
    data = json.load(f)
    f.close()
    Image.objects.all().delete()
    for url in data:
      Image.objects.create(url=url,
        score=data[url]['score'],
        cls=data[url]['class']
      )
