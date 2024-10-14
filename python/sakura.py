# sakura.py

# Cherry blossom bloom date data from the Japan Meteorological Agency
# https://www.data.jma.go.jp/sakura/data/download_ruinenchi.html

import pandas as pd

# CSV is in Japanese. Encode into Japanese using "Shift-JIS"
myCSV = pd.read_csv("./csv_files/rawdata/sakuradata/004.csv", encoding = "Shift-JIS")
df = pd.DataFrame(myCSV)
# Set display option to show all columns without abbreviation
# pd.set_option('display.max_columns', None)

# Reassign column names and remove the first repeating row
df.columns = df.iloc[0]
df = df[1:]

# Remove all columns with 'rm' as it is unneeded for this project
df.drop(['rm'], axis = 1, inplace = True)
# Remove all columns from 2023 to 2032 as there is no information
df.drop(df.iloc[:, df.columns.get_loc(2023):df.columns.get_loc(2032)+1], axis = 1, inplace = True)
# Remove column '番号' as it is unneeded for this project
df.drop(['番号'], axis = 1, inplace = True)
# Rename the columns into English
df = df.rename(columns={'地点名': 'location', '平年値': 'avgDate', '最早値': 'earlyDate', '最早年': 'earlyYear', '最晩値': 'lateDate', '最晩年': 'lateYear' })

# Remove unneeded syntax
df['location'] = df['location'].str.replace(u'\u3000', "")

# Take only the major cities of Japan: Sapporo, Sendai, Tokyo, Nagoya, Osaka, Hiroshima, Fukuoka
df = df.loc[df['location'].isin(['札幌', '仙台', '東京', '名古屋', '大阪', '広島', '福岡'])]
# Rename the Japanese values into English
df['location'] = df['location'].replace(['札幌', '仙台', '東京', '名古屋', '大阪', '広島', '福岡'], ['Sapporo', 'Sendai', 'Tokyo', 'Nagoya', 'Osaka', 'Hiroshima', 'Fukuoka'])
df.set_index('location', drop=True, inplace=True)
df.index.name = None

# Insert new columns 'latitude' and 'longitude' and its respective values for each city to map out with MapBox on p5.js
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

df.to_csv('./csv_files/finalizedcsv/sakuraData.csv', encoding='utf-8')