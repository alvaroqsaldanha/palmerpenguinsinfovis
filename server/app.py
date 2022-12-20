from flask import Flask, request, jsonify
from pandas import DataFrame, read_csv, unique, concat
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB
from sklearn.preprocessing import StandardScaler
import numpy as np
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, support_credentials=True)
models = {}

filename = 'data/penguins_prep_ml.csv'
data = read_csv(filename, na_values='?')
target = 'species'

pg_fields = list(data.columns)
pg_fields.remove(target)

trnY: np.ndarray = data.pop(target).values
trnX: np.ndarray = data.values
#trnX, tstX, trnY, tstY = train_test_split(X, y, train_size=0.7, stratify=y)
labels: np.ndarray = unique(trnY)
labels.sort()

def setupModels():
  clf = GaussianNB()
  clf.fit(trnX, trnY)
  models["GNB"] = clf
  clf = MultinomialNB()
  clf.fit(trnX, trnY)
  models["MNB"] = clf
  clf = BernoulliNB()
  clf.fit(trnX, trnY)
  models["BNB"] = clf 

def validate_json(data):
  new_feature = []
  for field in pg_fields:
    if field not in data and field != 'model':
      raise ValueError('No ' + field + " in request.")
    new_feature.append(data[field]) 
  return new_feature

@app.route('/penguingen', methods=['POST'])
def penguingen():
  try:
    data = request.get_json()
    model = data["model"]
    if model not in models:
      raise ValueError("Invalid Model.")
    new_penguin = validate_json(data)
  except Exception as e:
    return "Bad Request with exception: " + repr(e), 400
  prd_tst = models[model].predict([new_penguin])
  return jsonify({"acc":prd_tst[0]})

@app.route('/rndpenguingen', methods=['POST'])
def rndpenguingen():
  try:
    data = request.get_json()
    amount = data["amount"]
    model = data["model"]
    if model not in models:
      raise ValueError("Invalid Model.")
    if not isinstance(amount, int) or amount > 10:
      raise ValueError("Invalid Amount.")
  except Exception as e:
    return "Bad Request with exception: " + repr(e), 400
  features, table_entries = random_penguins(amount)
  prd_tst = models[model].predict(features)
  for i in range(len(prd_tst)):
    table_entries[i]["species"] = prd_tst[i].capitalize()
  return jsonify({"pengs":table_entries})  

pg_numfield_stats = {"bill_length_mm":[0.0,100.0],"bill_depth_mm":[0.0,50.0],"flipper_length_mm":[0.0,300.0],"body_mass_g":[0.0,10000.0],"year":[2007,2009]}
pg_symbfield_stats = {"island": ["Biscoe","Dream","Torgersen"], "sex": ["male","female","other"]}

def random_penguins(amount):
  features = []
  table_entries = []
  for i in range(amount):
    table_entry = {}
    feature = []
    for field in pg_numfield_stats:
      value = round(random.uniform(pg_numfield_stats[field][0],pg_numfield_stats[field][1]),1)
      if field == "year":
        value = random.randint(2007, 2009)
      table_entry[field] = value
      feature.append(value)
    for field in pg_symbfield_stats:
      value = random.choice(pg_symbfield_stats[field])
      for sub_field in pg_symbfield_stats[field]:
        if sub_field == value:
          table_entry[field] = value.lower()
          feature.append(True)
        else:
          feature.append(False)
    features.append(feature)
    table_entries.append(table_entry)
  return features,table_entries

if __name__ == '__main__':
   setupModels()
   app.run()

