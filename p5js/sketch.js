// Daniel Shiffman
// http://codingtra.in
// Earthquake Data Viz
// Video: https://youtu.be/ZiYdOwOrGyc

var mapimg;
var sakuraimg;

var clat = 37.5; // center latitude
var clon = 137; // center longitude

var lat; // latitude
var lon; // longitude

var ww = 600; // width of sketch
var hh = 650; // height of sketch

var zoom = 4.3; // zoom value

// color variables
var tempcold; // temperatures between -10c ~ 0c
var tempcool; // temperatures between 1c ~ 10c
var tempwarm; // temperatures between 11c ~ 19c
var temphot; // temperatures between 20c ~ 25c

// slider variables
let dateslider; // slider for date (Mar10 - May15)
let yearslider; // slider for year (1953 - 2022)

function preload() {
  mapimg = loadImage("https://api.mapbox.com/styles/v1/rikum/clluynett005v01qz37omhrwy/static/137,37.5,4.3,0,0/600x650?access_token=pk.eyJ1IjoicmlrdW0iLCJhIjoiY2xnYmZmYm5uMDFmdDNoc3g2Z3VtZWc0ZCJ9.G5erfv7BEESMLCFNsks0ZQ");
  
  sakuraimg = loadImage("cherryblossom.png")
  sakura = loadStrings("sakuraData.csv");
  
  temp = loadStrings("tempData.csv");
  
  yearslider = createSlider(1953, 2022, 1953, 1);
  yearslider.style('width', '300px');
  yearslider.position(ww/2-50, hh/2+210);
  
  dateslider = createSlider(1, 67, 1, 1);
  dateslider.style('width', '300px');
  dateslider.position(ww/2-50, hh/2+270);
} 

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


function setup() {
  createCanvas(600, 650); // set canvas 600x650
  
  // color variables
  tempcold = "blue"; // temperatures between -10c ~ 0c
  tempcool = "green"; // temperatures between 1c ~ 10c
  tempwarm = "orange"; // temperatures between 11c ~ 19c
  temphot = "red"; // temperatures between 20c ~ 25c
}

function draw() {
  background(0);
  imageMode(CENTER);
  translate(width / 2, height / 2);
  image(mapimg, 0, 0);
  stroke("white");
  strokeWeight(5);
  textFont("Gill Sans");
  
  let yearval = yearslider.value();
  let dateval = dateslider.value() + 9;
  
  push();
  const c = color(200, 200, 200, 102);
  fill(c);
  stroke("grey");
  strokeWeight(2);
  translate(-ww/2, -hh/2);
  rect(2, 68, 344, 236);
  pop();
  
  // Text for "YEAR"
  push();
  textAlign(CENTER);
  textSize(20);
  fill(0);
  text("YEAR", 105, hh/2-80);
  pop();
  
  // Text for "DATE"
  push();
  textAlign(CENTER);
  textSize(20);
  fill(0);
  text("DATE", 105, hh/2-20);
  pop();
  
  // Text for title of project
  push();
  textAlign(LEFT);
  textSize(40);
  fill(0);
  text("Sakura blooming season over time", -ww/2+10, -hh/2+50);
  pop();
  
  // Text for data title
  push();
  textAlign(LEFT);
  translate(-ww/2 + 10, -hh/2 + 95);
  textSize(25);
  text("Temperature difference", 0, 0);
  textSize(15);
  text("City", 0, 23);
  text("Prev. Day", 110, 23);
  text("Prev. Year", 185, 23);
  text("1953/2022", 260, 23);
  pop();
  
  // Text for selected year
  push();
  textAlign(LEFT);
  textSize(60);
  fill(0);
  text(yearval, -ww/2+10, hh/2-80);
  pop();
  
  // Text for selected date
  push();
  textAlign(LEFT);
  textSize(50);
  fill(0);
  var datetext;
  if (dateval <= 31) {
    datetext = "March " + dateval;
  } else if (dateval <= 61) {
    datetext = "April " + (dateval - 31);
  } else {
    datetext = "May " + (dateval - 61);
  }
  text(datetext, -ww/2+10,hh/2-30);
  pop();

  var cx = mercX(clon);
  var cy = mercY(clat);
  
  var currdate = dateval + 300;
    if (dateval <= 31) {
      currdate = dateval + 300;
    } else if (dateval <= 61) {
      currdate = 400 + (dateval - 31);
    } else {
      currdate = 500 + (dateval - 61);
    }
  
  for (var i = 1; i < sakura.length-1; i++){
    var data = sakura[i].split(/,/);
    var lat = data[1];
    var lon = data[2];
    var bloomdate = data[2 + yearval - 1952];

    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;

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
  
  for (var j = 1; j < temp.length-1; j++){
    var tempdata = temp[j].split(/,/);
    
    var temploc = tempdata[0];
    
    var templat = tempdata[1];
    var templon = tempdata[2];
    
    var tx = mercX(templon) - cx;
    var ty = mercY(templat) - cy;
    
    var tempindex = 2;
    var days = dateval - 9;
    if (yearval - 1953 == 0) {
      tempindex = tempindex + days;
    } else {
      tempindex = ((yearval - 1953) * 67) + tempindex + days;
    }
    var tempofdate = tempdata[tempindex];
    
    // Difference between previous day
    var tempdatediff = 0;
    if (yearval == 1953 && dateval == 10){
      tempdatediff = 0
    } else {
      tempdatediff = round(tempofdate-tempdata[tempindex-1], 2);
    }
    
    // Difference between previous year
    var tempyeardiff = 0;
    if (yearval == 1953){
      tempyeardiff = 0
    } else {
      tempyeardiff = round(tempofdate-tempdata[tempindex-67], 2);
    }
    
    // Difference between 1953 and 2022
    var nowandthen = 0;
    var pasttemp = tempdata[2 + days];
    var currenttemp = tempdata[((2022 - 1953) * 67) + 2 + days]
    nowandthen = round(currenttemp-pasttemp, 2);
    
    // Temperature by location
    push();
    textAlign(CENTER);
    translate(tx, ty);
    textSize(20);
    if (tempofdate >= 20 && tempofdate < 30) { // hot
      fill(temphot);
    } else if (tempofdate >= 10 && tempofdate < 20) { // warm
      fill(tempwarm);
    } else if (tempofdate >= 0 && tempofdate < 10) { // cool
      fill(tempcool);
    } else if (tempofdate >= -10 && tempofdate < 0) { // cold
      fill(tempcold);
    }
    text(tempofdate+"°C", 0, -20);
    pop();
    
    // Location on map
    push();
    textAlign(CENTER);
    translate(tx, ty);
    textSize(13);
    text(temploc, 0, 33);
    pop();
    
    // Temperature difference location text
    push();
    textAlign(LEFT);
    translate(-ww/2 + 10, -hh/2 + 120);
    textSize(20);
    text(temploc, 0, j * 25);
    
    // Difference between previous day in text
    push();
    if(tempdatediff > 0) {
      fill(temphot);
    } else if (tempdatediff < 0) {
      fill(tempcold);
    } else {
      fill(0)
    }
    text(tempdatediff+"°C", 110, j * 25);
    pop();
    
    // Difference between previous year in text
    push();
    if(tempyeardiff > 0) {
      fill(temphot);
    } else if (tempyeardiff < 0) {
      fill(tempcold);
    } else {
      fill(0)
    }
    text(tempyeardiff+"°C", 185, j * 25);
    pop();
    
    // Difference between 1953 and 2022 in text
    push();
    if(nowandthen > 0) {
      fill(temphot);
    } else if (nowandthen < 0) {
      fill(tempcold);
    } else {
      fill(0)
    }
    text(nowandthen+"°C", 260, j * 25);
    pop();
    pop();
  }

}
