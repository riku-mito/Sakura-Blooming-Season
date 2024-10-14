# Sakura Blooming Season

Sakura Blooming Season is a p5.js interactive data visualisation of the impact of climate change on cherry blossom blooming season across Japan.

p5.js sketch link: [https://editor.p5js.org/21017659/full/lkrsi-Npr]((https://editor.p5js.org/rikumito/full/lkrsi-Npr))

![datavis](https://git.arts.ac.uk/storage/user/381/files/62363abd-3dee-47cd-980c-669998565f6d)

## Abstract

The word 桜 (sakura) or 'cherry blossom' in Japanese holds profound significance in Japanese culture and society that extends beyond the aesthetic beauty. The sakura symbolizes the impermanence of life, new beginnings, and even the nation itself. 

However, the announcement of cherry blossoms blooming has been increasingly earlier each year, and average temperatures are rising across the country. In 2023, cherry blossoms bloomed much earlier than normal nationwide, and in many places they were the earliest ever recorded.

In order to analyze the relationship between the accelerating bloom dates and rising average temperatures, I used the Python library "Pandas" to process historical cherry blossom bloom dates and weather data, then used p5.js to create a data visualization.

## Files

```
# Folder Structure
.
└── Visualisation-and-Sensing/
    ├── csv_files/
    │   ├── finalizedcsv/
    │   │   ├── sakuraData.csv
    │   │   └── tempData.csv
    │   ├── rawdata/
    │   │   ├── sakuradata/
    │   │   │   └── 004.csv
    │   │   └── tempdata/
    │   │       ├── temp19531970.csv
    │   │       ├── temp19711988.csv
    │   │       ├── temp19892006.csv
    │   │       └── temp20072022.csv
    │   └── sortedcsv/
    │       ├── temp19531970.csv
    │       ├── temp19711988.csv
    │       ├── temp19892006.csv
    │       └── temp20072022.csv
    ├── p5js/
    │   ├── cherryblossom.png
    │   ├── index.html
    │   ├── p5.js
    │   ├── p5.sound.min.js
    │   ├── sakuraData.csv
    │   ├── sketch.js
    │   ├── style.css
    │   └── tempData.csv
    ├── python/
    │   ├── sakura.py
    │   └── temperature.py
    └── images/
        ├── datavis.gif
        ├── Sakura Blooming Season_ Impact of Climate Change on Cherry Blossoms in Japan.pdf
        ├── idea.png
        └── plan1.png
```

This GitHub repository has three main folders: `csv_files/`, `p5js/`, and `python/`.

`csv_files/` folder includes all of the csv files that were used to process the historical cherry blossom bloom date and average temperature data.
`finalizedcsv/` folder includes fully processed and analyzed data saved as new csv files: `sakuraData.csv` and `tempData.csv` which are later used for p5.js. `rawdata/` folder includes unanalyzed data as csv files that were directly downloaded from the Japanese Meteorological Agency. `sortedcsv/` folder includes slightly modified temperature data from the `rawdata/` folder for easier analysis later on. 

`p5js/` folder includes all of the necessary files needed for the p5.js sketch, including the fully analyzed data from `finalizedcsv/`. 

`python/` folder includes the two Python files that were used to process the unanalyzed csv files using Pandas. 

`images/` folder includes images and gifs used in the README.md document and write-ups. 

## Python Code

Both `sakura.py` and `temperature.py` use the Python library, Pandas to help analyze large amounts of data.

```
import pandas as pd
```
The csv files are downloaded from the Japanese Meteorological Agency and are written in Japanese. The files must be read and encoded in Shift-JIS. 

### Cherry Blossom Data

The Japanese Meteorological Agency states that the cherry blossoms that were analyzed are the 'Somei-yoshino' or Yoshino cherry trees, unless the csv file states otherwise. The values in the column `rm` represent whether the analyzed cherry tree was the Yoshino cherry or a similar breed. The data suggests that all recorded cherry trees were the same Yoshino cherry breed, so all `rm` columns were dropped. 

The data was limited to the seven most major cities of Japan for an accessible data visualization on p5.js: Sapporo, Sendai, Tokyo, Nagoya, Osaka, Hiroshima, Fukuoka
```python
df = df.loc[df['location'].isin(['札幌', '仙台', '東京', '名古屋', '大阪', '広島', '福岡'])]
```

Column headers and location names were translated and renamed for easier analysis.
```python
# Rename column header
df.rename(columns={*})

# Rename location names
df['location'] = df['location'].replace([...],[...])
```

The latitude and longitude of the seven cities were taken from [LatLong.net](https://www.latlong.net/category/cities-111-15.html)
and inserted as new columns `latitude` and `longitude` with its respective values to map out with MapBox on p5.js.

```python
latitude = {'Sapporo': 43.066666, ..., 'Fukuoka': 33.583332}
longitude = {'Sapporo': 141.350006, ..., 'Fukuoka': 130.399994}

df.insert(loc = 0, column = 'latitude', value = latitude)
df.insert(loc = 1, column = 'longitude', value = longitude)

df.sort_values('latitude', ascending=[False], inplace=True)
```
The analyzed data is saved as a new csv file in `/csv_files/finalizedcsv`, later to be used in p5.js.

### Temperature Data

The csv files were downloaded from the Japanese Meteorological Agency, each consisting of the daily average temperature from March 10th to May 15th, between 1953 to 2022. Due to the size of the data, the files were split into four and later concatenated using Pandas.

Each file was temporarily saved as a new csv file as the columns were saved as a tuple and needed to be split into separate columns. Any duplicated columns were removed before concatenating into a single csv file. 

```python
tempdf = tempdf.loc[:, ~tempdf.columns.duplicated()]

filename = file.split("/")[-1].split(".")[0]
tempdf.to_csv(sortedpath + '/' + filename + '.csv', encoding='utf-8')
```

The formatted csv files were read and saved as a list of dataframes to be concatenated.
```python
df_list = (pd.read_csv(newfile) for newfile in sorted(sortedcsv_files)) 

df = pd.concat(df_list).reset_index(drop=True)
```

The newly concatenated dataframe is then transposed to match the format of `sakuraData.csv`.
```python
df = df.transpose()
```

The latitude and longitude of the seven cities were inserted similar to `sakura.py` then saved as a new csv file.
```python
latitude = {'Sapporo': 43.066666, ..., 'Fukuoka': 33.583332}
longitude = {'Sapporo': 141.350006, ..., 'Fukuoka': 130.399994}

df.insert(loc = 0, column = 'latitude', value = latitude)
df.insert(loc = 1, column = 'longitude', value = longitude)

df.sort_values('latitude', ascending=[False], inplace=True)

df.to_csv('./csv_files/finalizedcsv/tempData.csv', encoding='utf-8')
```

`sakuraData.csv` and `tempData.csv` is now fully processed and analyzed to be used in the p5.js sketch.

## p5.js Code

The p5.js sketch can be viewed here: [https://editor.p5js.org/21017659/full/lkrsi-Npr](https://editor.p5js.org/21017659/full/lkrsi-Npr)

To understand how to use Mapbox, I referenced The Coding Train's video on mapping earthquake data: [Coding Challenge #57: Mapping Earthquake Data](https://www.youtube.com/watch?v=ZiYdOwOrGyc&t=1048s) by The Coding Train.

Using Mapbox's API, an image of the world map with geographic coordinate systems can be loaded into p5.js. The latitude and longitude values from the csv files must be calculated and converted into pixels using Web Mercator projection. 

```javascript
function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}
```

The contents of the csv files are read and stored as a String array of its individual lines. To access each index, the string array must be iterated through using a for-loop.

```javascript
// sakura data
for (var i = 1; i < sakura.length-1; i++){
    var data = sakura[i].split(/,/);
    var lat = data[1]; // latitude
    var lon = data[2]; // longitude
    var bloomdate = data[2 + yearval - 1952]; // bloom date
}

// temperature data
for (var j = 1; j < temp.length-1; j++){
    var tempdata = temp[j].split(/,/);
    var temploc = tempdata[0]; // location name
    var templat = tempdata[1]; // latitude
    var templon = tempdata[2]; // longitude
}
```

The data visualization can be interacted using sliders to see the change in bloom dates and temperature over the years by selecting the year or date.

```javascript
function preload() {
    // Create a slider for the selected year
    yearslider = createSlider(1953, 2022, 1953, 1);
    yearslider.style('width', '300px');
    yearslider.position(ww/2-50, hh/2+210);

    // Create a slider for the selected date
    dateslider = createSlider(1, 67, 1, 1);
    dateslider.style('width', '300px');
    dateslider.position(ww/2-50, hh/2+270);
}

function draw() {
    // The values must be constantly updated
    let yearval = yearslider.value();
    let dateval = dateslider.value() + 9;
}
```
A small ellipse, location name, and its temperature is located on each major city. The text color of the temperature will change depending on its value:

* Blue: -10°C to 0°C
* Green: 1°C to 10°C
* Yellow: 11°C to 19°C
* Red: 20°C to 30°C

An image of a cherry blossom will appear to show that the cherry blossoms have bloomed at its respective location when the user selects the date/year. 

```javascript
for (var i = 1; i < sakura.length-1; i++){
    ...
    push();
    noStroke();
    fill(255, 0, 255, 200);
    ellipse(x, y, 10, 10);
    pop();
    
    if (currdate >= bloomdate) {
        push();
        imageMode(CENTER);
        translate(x,y);
        rotate(sin(frameCount/40));
        let coord = image(sakuraimg, 0, 0);
        pop();
    }
}
```

The top left of the sketch shows data on the change in temperature from the previous date, previous year, and difference between 1953 and 2022. If the difference is positive, the color of the text changes red. If the difference is negative, the color of the text changes blue. If there is no difference, the color of the text changes black.

## Research and Design

[PDF](https://git.arts.ac.uk/21017659/Visualisation-and-Sensing/blob/main/images/Sakura%20Blooming%20Season_%20Impact%20of%20Climate%20Change%20on%20Cherry%20Blossoms%20in%20Japan.pdf)

## Credits
[Coding Challenge #57: Mapping Earthquake Data](https://www.youtube.com/watch?v=ZiYdOwOrGyc&t=1048s) by The Coding Train

[Mapbox](https://www.mapbox.com/) for maps, geocoding, and navigation APIs

[Historical Weather Data](https://www.data.jma.go.jp/gmd/risk/obsdl/) from the Japan Meteorological Agency

[Cherry Blossom Bloom Date Data](https://www.data.jma.go.jp/sakura/data/download_ruinenchi.html) from the Japan Meteorological Agency
