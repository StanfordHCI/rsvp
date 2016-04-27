from django.shortcuts import render
from django.http import HttpResponse

from images.models import Image

import json

def Task(request):
  data = Image.objects.all()
  data = {image.url: {'class': image.cls, 'score': 0} for image in data}
  return render(request, 'demo.html', {'data': json.dumps(data)})


def Results(request):
  data = Image.objects.all()
  data = {image.url: {'class': image.cls, 'score': image.score} for image in data}
  return render(request, 'results.html', {'data': json.dumps(data)})

def Data(request):
  data = Image.objects.all()
  data = {image.url: {'class': image.cls, 'score': image.score} for image in data}
  return HttpResponse(json.dumps(data))


def Update(request):
  if request.method != 'POST':
    return
  data = request.POST['data']
  print data
  for d in data:
    image = Image.objects.get(url=d)
    image.score += data[d]
    #image.save()

