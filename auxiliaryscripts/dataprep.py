import pandas as pd
import numpy as np

pg = pd.read_csv('penguins.csv')
tosave = pg.drop(['rowid'], axis=1)
tosave.dropna(subset=['bill_depth_mm'], inplace=True)
tosave.replace(np.nan, 'other', regex=True, inplace = True)
tosave.to_csv('penguins_prep.csv',index=False)
