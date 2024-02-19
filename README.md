# Scratch_TUIO
TUIO, come si può leggere sul [sito di riferimento](https://www.tuio.org/), è un protocollo di comunicazione per superfici multitouch. Il protocollo TUIO consente quidi la trasmissione di una descrizione astratta, solo la posizione per i cursori o posizione e direzione per i markers, tramite superfici interattive. 
Questo protocollo codifica i dati da un'applicazione tracker (ad esempio basata sulla visione artificiale) e li invia a qualsiasi applicazione client in grado di decodificare il protocollo.

Scratch_TUIO è un'estensione di Scratch che consente l'utilizzo di dati TUIO tramite un client server, per produrre una nuova modalità di interazioine

## Requisiti

- OS
  - Windows 8
  - Windows 10
  - MacOS
  - iOS
- Browser
  - Chrome
  - Safari(iOS)
- server
- software aggiuntivi
  - reactivision
- simulatore
- webcam

## Installazione
### Windows
- Scarica l'installer di NodeJS da [qui](https://nodejs.org/download/release/v18.19.0/node-v18.19.0-x64.msi). Una volta scaricato fai doppio click per installare: per mandare avanti l'installazione è sufficiente cliccare sempre su Next, ma nella seconda schermata è necessario selezionare "I accept the terms in the license Agreement". L'installazione può richiedere qualche minuto e il sistema potrebbe chiedere di inserire la password di amministratore.
Installazione di Reactivision
- Scarica ReacTIVision da [questo link](http://prdownloads.sourceforge.net/reactivision/reacTIVision-1.5.1-win64.zip?download). Scompatta lo Zip.

## Come usare l'estensione
- Nella cartella in cui hai scaricato reacTIVision fai partire `reacTIVision.exe`
- Nella cartella in cui hai scaricato l'estensione fai partire `server.bat`
- Apri nel tuo browser preferito l'estensione scratch, che puoi trovare [qui](https://futureinv.github.io/)

## Esempi d'uso

1. Clicca il pulsante "Aggiungi estensione" in basso a sinistra.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/images/uno.PNG" width="400" />

2. Seleziona "scratch_TUIO".
<img src="https://github.com/futureinv/tuio_scratch/blob/main/images/due.PNG" width="400" />

3. Adesso puoi utilizzare i blocchi dell'estensione.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/images/tre.PNG" width="400" />

4. Ad esempio puoi combinare i blocchi in questo modo e far muovere il gatto con il marker 1
<img src="https://github.com/futureinv/tuio_scratch/blob/main/images/quattro.PNG" width="400" />

## Licenza
Distribuito con licenza BSD 3-Clause "New" or "Revised" License. Vedi il file `LICENSE.txt` per ulteriori informazioni.

## Ringraziamenti
- [scratch-tuio-sandbox](https://github.com/parsodyl/scratch-tuio-sandbox)

## Ulteriori informazioni tecniche (per sviluppatori)

### Dipendenze
- Node-LTS-Hydrogen 18.19.0
- scratch-gui v. 3.0.5
- scratch-vm v. 2.0.3

### Prerequisiti
- Yarn `npm install --global yarn`

## Installazione
```
cd tuio-client && yarn install && yarn link
cd scratch-vm && yarn link tuio-client && yarn install && yarn link
cd scratch-gui && yarn link scratch-vm && yarn install
cd tuio-server && yarn install
```

## Esecuzione
```
cd scratch-gui && yarn start &
node ../tuio-server/index.js &
cd ../tuio-simulator && java -jar TuioSimulator.jar
```
Apri il browser a localhost:8601
