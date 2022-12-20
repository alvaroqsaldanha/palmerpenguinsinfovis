import pandas as pd
import numpy as np
from pandas import read_csv, DataFrame, concat, Series
from pandas.plotting import register_matplotlib_converters
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE

data_dir = 'data/Unscaled/' 
filename = 'penguins_prep_ml'
data = read_csv(data_dir + filename + '.csv')
numeric_variables = ["bill_length_mm","flipper_length_mm","flipper_length_mm","body_mass_g","year"]
boolean_variables = ["island_Biscoe","island_Dream","island_Torgersen","sex_female","sex_male","sex_other"]
target = "species"

y: np.ndarray = data.pop(target).values
X: np.ndarray = data.values
trnX, tstX, trnY, tstY = train_test_split(X, y, train_size=0.75, stratify=y)
train = concat([DataFrame(trnX, columns=data.columns), DataFrame(trnY,columns=[target])], axis=1)
test = concat([DataFrame(tstX, columns=data.columns), DataFrame(tstY,columns=[target])], axis=1)
train.to_csv(f'{data_dir}{filename}_train.csv', index=False)
test.to_csv(f'{data_dir}{filename}_test.csv', index=False)
data = train

data_adelie = data[data[target] == "Adelie"]
data_gentoo = data[data[target] == "Gentoo"]
data_chinstrap = data[data[target] == "Chinstrap"]

def missing_values():
    pg = pd.read_csv('penguins.csv')
    tosave = pg.drop(['rowid'], axis=1)
    tosave.dropna(subset=['bill_depth_mm'], inplace=True)
    tosave.replace(np.nan, 'other', regex=True, inplace = True)
    tosave.to_csv('penguins_prep.csv',index=False)

def scaling():
    numeric_data = data[numeric_variables]
    boolean_data = data[boolean_variables]
    # Z-SCORE SCALING
    transf = StandardScaler(with_mean=True, with_std=True, copy=True).fit(numeric_data)
    tmp = DataFrame(transf.transform(numeric_data), index=data.index, columns=numeric_variables)
    data_zscore = concat([data[target], tmp, boolean_data], axis=1)
    data_zscore.to_csv(f'{filename}_zscore.csv', index=False)
    # MINMAX SCALING
    transf = MinMaxScaler(feature_range=(0, 1), copy=True).fit(numeric_data)
    tmp = DataFrame(transf.transform(numeric_data), index=data.index, columns=numeric_variables)
    data_minmax = concat([data[target], tmp,  boolean_data], axis=1)
    data_minmax.to_csv(f'{data_dir}{filename}_minmax.csv', index=False)

def balancing():
    # Oversampling
    data_gentoo_sample = DataFrame(data_gentoo.sample(len(data_adelie),replace=True))
    data_cs_sample = DataFrame(data_chinstrap.sample(len(data_adelie),replace=True))
    data_over = concat([data_adelie, data_gentoo_sample, data_cs_sample], axis=0)
    data_over.to_csv(f'{data_dir}Oversampling/{filename}_over.csv', index=False)
    # SMOTE 
    smote = SMOTE(sampling_strategy='not majority', random_state=42)
    y = data.pop(target).values
    X = data.values
    smote_X, smote_y = smote.fit_resample(X, y)
    df_smote = concat([DataFrame(smote_X), DataFrame(smote_y)], axis=1)
    df_smote.columns = list(data.columns) + [target]
    df_smote.to_csv(f'{data_dir}Smote/{filename}_smote.csv', index=False)
    smote_target_count = Series(smote_y).value_counts()

