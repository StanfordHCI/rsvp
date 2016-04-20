import json
import sys
from check_image_exists import exists

classes = ['dogs']
max_per_class = [25, 200]
data_file = open('data.js')
data = json.loads(data_file.read()[11:])
data_file.close()
DEFAULT_SCORE = 0.0
for i, cls in enumerate(classes):
  total = 0
  for url in data:
    if data[url]['class'] is cls:
      total += 1
  filename = cls + '.txt'
  for j, url in enumerate(open(filename)):
    print j, total
    if total >= max_per_class[i]:
      break
    url = url.strip().replace('\n', '')
    if url in data or not exists(url):
      continue
    data[url] = {'class': cls, 'score': DEFAULT_SCORE}
    total += 1
  print "Total %s images found: %d" % (cls, total)
f = open('data.js', 'w')
f.write('var data = ' + json.dumps(data))
f.close()
