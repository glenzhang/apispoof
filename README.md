# A remote JSON/JSONP data spoof tool by NODEJS  #

## Setup ##
1. install node on [http://nodejs.org/](http://nodejs.org/ "http://nodejs.org/")
2. install mongodb on [https://www.mongodb.org/](https://www.mongodb.org/ "https://www.mongodb.org/")
3. clonse code, run npm install & node app
4. cool http://localhost:3000

## How to use ##

let's suppose there is a stroy #9085 need to implement.

- CREATE http://localhost:3000/add/9085
- LIST http://localhost:3000/story/9085
- UPDATE http://localhost:3000/story/9085/01
- JSON http://localhost:3000/story/9085/01/api
- JSONP http://localhost:3000/story/9085/01/api?jsoncallback=functionname
