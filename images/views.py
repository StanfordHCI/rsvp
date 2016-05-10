from django.shortcuts import render
from django.http import HttpResponse

from images.models import Image

import json
import operator

def Task(request):
  data = Image.objects.all()
  data = {image.url: {'class': image.cls, 'score': 0} for image in data}
  return render(request, 'demo.html', {'data': json.dumps(data)})


def Results(request):
  data = Image.objects.all()
  data = {image.url: {'class': image.cls, 'score': image.score} for image in data}
  return render(request, 'results.html', {'augmented': False, 'data': json.dumps(data)})


def getAugmentedData():
  precision = 0.84
  totalPositives = Image.objects.filter(cls='dogs').count()
  totalGood = int(precision*totalPositives)
  totalBad = int((1-precision)*totalPositives)
  data = {}
  for image in Image.objects.all():
    score = 0
    if image.cls == 'dogs' and totalGood > 0:
      score = 1
      totalGood -= 1
    elif image.cls != 'dogs' and totalBad > 0:
      score = 1
      totalBad -= 1
    data[image.url] = {'class': image.cls, 'score': score}
  return data


def Resutls(request):
  data = getAugmentedData()
  return render(request, 'results.html', {'augmented': True, 'data': json.dumps(data)})


def Data(request):
  if 'augmented' in request.GET and request.GET['augmented']:
    data = getAugmentedData()
  else:
    data = Image.objects.all()
    data = {image.url: {'class': image.cls, 'score': image.score} for image in data}
  return HttpResponse(json.dumps(data))


def Update(request):
  """
  Helper function to make sure we are getting good data
  """
  def improved(data):
    metricAt = 20
    totalPositives = Image.objects.filter(cls='dogs')
    topImages = Image.objects.order_by('-score')[:metricAt]
    goodImages = 0
    score = 0
    for index, image in enumerate(topImages):
      if image.cls == 'dogs':
        goodImages += 1
        score -= index

    base = {image.url: {'url': image.url, 'class': image.cls, 'score': image.score} for image in Image.objects.all()}
    for d in data:
      base[d]['score'] += data[d]
    sortedBase = sorted(base.values(), key=operator.itemgetter("score"))
    topImages = sortedBase[::-1][:metricAt]
    newGoodImages = 0
    newScore = 0
    for index, image in enumerate(topImages):
      if image['class'] == 'dogs':
        newGoodImages += 1
        newScore -= index
    return newGoodImages >= goodImages
    #return newScore >= score

  """
  Actual method
  """
  if request.method != 'POST':
    return
  data = json.loads(request.POST['scores'])
  if not improved(data):
    print "rejected bad data"
    #return HttpResponse({})
  for d in data:
    image = Image.objects.get(url=d)
    image.score += data[d]
    image.save()
  return HttpResponse({})

