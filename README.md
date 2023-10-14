# tuio_scratch
Scratch 3 extension for Tuio Markers

- Node-LTS-Hydrogen 18.18.0
- scratch-gui v. 3.0.5
- scratch-vm 2.0.3

## Prerequisites
- Yarn `npm install --global yarn`

## Install as dev


```
cd tuio-client && yarn install && yarn link
cd scratch-vm && yarn link tuio-client && yarn install && yarn link
cd scratch-gui && yarn link scratch-vm && yarn install
cd tuio-server && yarn install
```
TBD: reactivision

## Run as dev
```
cd scratch-gui && yarn start &
node ../tuio-server/index.js &
cd ../tuio-simulator && java -jar TuioSimulator.jar
```
Open browser on localhost:8601

TBD reactivision


## Install on Windows
- Install Node from [here](https://nodejs.org/it/v18.18.2/node-v18.18.2.msi) 
- Download from [here](https://drive.google.com/file/d/1qJEuakeFO-hfqUVP82g3nTPU0cFJ1gd4) and unzip

## Run on Windows
- In the `server` folder double click on `server.bat`
- Use browser to open `.\extension\index.html`
- Load Tuio extension and open `.\examples\primo.sb3`

## Supported blocks

- [ ] Connect tuio
- [ ] When cursor x enters/exits
- [ ] Cursor x, y, angle
- [ ] Cursor present
- [ ] I due che espongono la lista dei marker attivi
- [ ] la velocità (anche se in modo sperimentale)
