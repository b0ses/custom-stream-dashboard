#### Stream Overlay

The actual frontend overlay you want OBS or your streaming app to connect to.

##### Installing
```
    # Install npm
    apt-get install npm
    # Install dependencies
    npm install
    # Set your node path
    export NODE_PATH=./src
```

##### Settings

Fill in your [settings](src/Settings.js) to match the API settings. 
Also modify [package.json](package.json) to setup where you want this server to be hosted.

##### Running
```
    # Note: when running locally, run as sudo for that port 80 access 
    npm start
```
