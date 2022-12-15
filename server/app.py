#!/usr/bin/python3

from wsgiref.handlers import CGIHandler
from flask import Flask, request, jsonify, render_template
from pandas import DataFrame, read_csv, unique
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, support_credentials=True)

filename = 'data/penguins_prep_ml.csv'
data = read_csv(filename, na_values='?')
target = 'species'
pg_fields = list(data.columns)
pg_fields.remove(target)

y: np.ndarray = data.pop(target).values
X: np.ndarray = data.values
trnX, tstX, trnY, tstY = train_test_split(X, y, train_size=0.7, stratify=y)
labels: np.ndarray = unique(y)
labels.sort()

clf = GaussianNB()
clf.fit(trnX, trnY)

def validate_json(data):
  new_feature = []
  for field in pg_fields:
    if field not in data:
      raise ValueError('No ' + field + " in request.")
    new_feature.append(data[field]) 
  return new_feature

@app.route('/penguingen', methods=['POST', 'GET'])
def penguingen():
  try:
    data = request.get_json()
    new_penguin = validate_json(data)
  except Exception as e:
    return "Bad Request with exception: " + repr(e), 400
  prd_tst = clf.predict([new_penguin])
  return jsonify({"acc":prd_tst[0]})

if __name__ == '__main__':
   app.run()
