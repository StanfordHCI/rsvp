from django.shortcuts import render
from django.http import HttpResponse

from images.models import Image

import json

def Task(request):
  data = Image.objects.all()
  data = [d.tojson(mask=True) for d in data]
  return render(request, 'demo.html')


def Results(request):
  data = Image.objects.all()
  data = [d.tojson() for d in data]
  return render(request, 'results.html', {'data': json.dumps(data)})


def Update(request):
  if request.method != 'POST':
    return
  data = request.POST['data']
  for d in data:
    image = Image.objects.get(url=d['url'])
    image.score += d['score']
    image.save()

