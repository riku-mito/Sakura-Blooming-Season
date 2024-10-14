# temperature.py

# Historical Weather Data from the Japan Meteorological Agency
# https://www.data.jma.go.jp/gmd/risk/obsdl/

import pandas as pd
import glob

# Get CSV files list from a folder
path = './csv_files/rawdata/tempdata'
csv_files = glob.glob(path + "/*.csv")

sortedpath = './csv_files/sortedcsv'
sortedcsv_files = glob.glob(sortedpath + "/*.csv")

# Read each CSV file into DataFrame
for file in sorted(csv_files):
    tempdf = (pd.read_csv(file, encoding = "Shift-JIS").reset_index())
    
    # Reassign column names
    tempdf.columns = tempdf.iloc[0]
    tempdf = tempdf[1:] # Remove the first repeating row
    tempdf = tempdf.drop([1, 2]).reset_index(drop=True)
    tempdf.rename(columns = {'札幌': 'Sapporo', '仙台': 'Sendai', '東京': 'Tokyo', '名古屋': 'Nagoya', '大阪': 'Osaka', '広島': 'Hiroshima', '福岡': 'Fukuoka'}, inplace = True)
    tempdf.columns.values[0] = 'date'
    tempdf = tempdf.loc[:, ~tempdf.columns.duplicated()]
    tempdf.set_index('date', drop=True, inplace=True)

    # Save as a new file in a different folder
    filename = file.split("/")[-1].split(".")[0]
    tempdf.to_csv(sortedpath + '/' + filename + '.csv', encoding='utf-8')

# Read each CSV file into DataFrame
# This creates a list of dataframes
df_list = (pd.read_csv(newfile) for newfile in sorted(sortedcsv_files)) # Must be sorted() to be read in order

# Concatenate all DataFrames
df = pd.concat(df_list).reset_index(drop=True)

df = df.transpose() # Flip rows and columns
df.columns = df.iloc[0] # Reassign column names again
df = df[1:] # Remove the first repeating row

maxValues = df.max(axis=1)
minValues = df.min(axis=1)
print("Highest temperature:")
print(maxValues, "\n")
print("Lowest temperature:")
print(minValues, "\n")

latitude = {'Sapporo': 43.066666, 'Sendai': 38.268223,
            'Tokyo': 35.652832, 'Nagoya': 35.183334, 'Osaka': 34.672314,
            'Hiroshima': 34.383331, 'Fukuoka': 33.583332}
longitude = {'Sapporo': 141.350006, 'Sendai': 140.869415,
            'Tokyo': 139.839478, 'Nagoya': 136.899994, 'Osaka': 135.484802,
            'Hiroshima': 132.449997, 'Fukuoka': 130.399994}

df.insert(loc = 0,
          column = 'latitude',
          value = latitude)
df.insert(loc = 1,
          column = 'longitude',
          value = longitude)

df.sort_values('latitude', ascending=[False], inplace=True)
print(df)

# Save the data in a new csv file
df.to_csv('./csv_files/finalizedcsv/tempData.csv', encoding='utf-8')
