import requests

def exists(path):
  try:
    r = requests.head(path)
    return r.status_code == requests.codes.ok
  except:
    return False
