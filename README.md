# tuio_scratch
Scratch 3 extension for Tuio Markers

- Node-LTS-Hydrogen 18.18.0
- scratch-gui v. 3.0.5
- scratch-vm 2.0.3

## Install
```
cd scratch-vm && yarn install && yarn link
cd scratch-gui && yarn link scratch-vm && yarn install
cd tuio-server && yarn install
```

# Run
```
cd scratch-gui && yarn start &
node ../tuio-server/index.js
```
Open browser on localhost:8601
