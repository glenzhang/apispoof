#JSON/JSONP data spoof tool

## Easy to deploy ##
1. Install [node](http://nodejs.org/ "node")
2. Install [mongodb](https://www.mongodb.org/ "mongodb")
3. Get code, `git clone https://github.com/glenzhang/apispoof.git`
4. Go to apisoof folder, `npm install & node app`
5. [cool](http://localhost:3000)

## How to use ##

**Suppose there is a stroy#8888 need to implement.** Need an api to output json data. 

1. The story's apis are in the [LIST]("http://localhost:3000/story/8888")
2. [CREATE]("http://localhost:3000/add/8888")
3. [UPDATE]("http://localhost:3000/story/8888/01")
4. [JSON data]("http://localhost:3000/story/8888/01/api")
5. [JSONP data]("http://localhost:3000/story/8888/01/api?jsoncallback=functionname")
