(English version below)
# Scratch_TUIO

TUIO, come si può leggere sul [sito di riferimento](https://www.tuio.org/), è un protocollo di comunicazione per superfici multitouch. Il protocollo TUIO consente la trasmissione di una descrizione astratta, come la posizione o la direzione di cursori o markers, tramite superfici interattive. 
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
- Nella cartella in cui hai scaricato l'estensione fai partire `release0\server\server.bat`
- Apri nel tuo browser preferito l'estensione scratch, che puoi trovare [qui on-line](https://futureinv.github.io/), oppure qui, in locale, `release0\estensione\index.html`

## Esempi d'uso


### Importare i blocchi dell'estensione
1. Clicca il pulsante "Aggiungi estensione" in basso a sinistra.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/aggiungi.jpg" width="300" />


2. Seleziona "scratch_TUIO".
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/estensione.jpg" width="400" />

3. Adesso puoi utilizzare i blocchi dell'estensione.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/blocchiTuio.jpg" width="300" />

4. IMPORTANTE
Affinchè i comandi dell'estensione funzionino, c'è bisogno di stabilire un collegamento con il server. Questo comando deve essere sempre presente.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/connect.jpg" width="300" />

### Controllare il movimento dello Sprite 
Assicurarsi di selezionare il numero del Marker che si sta utilizzando nel menù a tendina.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/posizione.jpg" width="400" />

### Controllare la rotazione dello Sprite 
Da questo mnenù a tendina è possibile decidere se controllare la posizione o la rotazione dello SPrite tramite il Marker.

<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/rotazione.jpg" width="300" />
### Tracciare una linea colorata

<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/matitaColorata.jpg" width="400" />
Nel caso in cui dovesse continuare a comparire una linea colorata anche dopo aver eliminato il codice, cliccare sul comando "penna su" nella lista dei comandi.
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/pulisci.jpg" width="300" /> 

### Cambiare lo sfondo
<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/sfondo.jpg" width="500" />

### Creare una pallina che rimabalza
Applicare il primo codice sullo Sprite controllato dal Marker.

<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/posizione.jpg" width="400" />

Selezionare poi la palla o l'oggetto da far rimbalzare.


<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/rimbalzo2.jpg" width="400" />

## Licenza
Distribuito con licenza BSD 3-Clause "New" or "Revised" License. Vedi il file `LICENSE.txt` per ulteriori informazioni.

## Ringraziamenti
- [scratch-tuio-sandbox](https://github.com/parsodyl/scratch-tuio-sandbox)
https://github.com/futureinv/tuio_scratch/assets/153513974/3371d48f-0345-4f25-ae80-228c48e50652
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




# English version:

# Scratch_TUIO
TUIO is a communication protocol for multitouch surfaces, more information can be read on the [reference site](https://www.tuio.org/) . The TUIO protocol allows the transmission of an abstract description, such as the position or direction of sliders or markers, via interactive surfaces.
This protocol encodes data from a tracker application (e.g., machine vision-based) and sends it to any client application that can decode the protocol.

Scratch_TUIO is an extension to Scratch that allows TUIO data to be used via a client server, to produce a new mode of interazioine

## technical requirements
- OS
  - Windows 8
  - Windows 10
  - MacOS
  - iOS
- Browser
  - Chrome
  - Safari(iOS)
- server
- additional software
  - reactivision
- simulator
- webcam

## Installation
### Windows
- Download the NodeJS installer from [here](https://nodejs.org/download/release/v18.19.0/node-v18.19.0-x64.msi). Once downloaded, double-click to install: to send the installation forward, always click Next; on the second screen you must select “I accept the terms in the license Agreement.” The installation may take a few minutes and the system may ask you to enter the administrator password.
Installing Reactivision
- Download ReacTIVision from [this link](http://prdownloads.sourceforge.net/reactivision/reacTIVision-1.5.1-win64.zip?download). Unzip the Zip.


## How to use the extension
- In the folder where you downloaded reacTIVision run `reacTIVision.exe`
- In the folder where you downloaded the extension run `server.bat`
- Open in your favorite browser the scratch extension, which you can find [here](https://futureinv.github.io/)


## Examples of use.


### Import the extension blocks.
1. Click the “Add Extension” button in the lower left corner.
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/aggiungi.jpg” width=“300” />


2. Select “scratch_TUIO.”
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/estensione.jpg” width=“400” />

3. Now you can use the extension blocks.
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/blocchiTuio.jpg” width=“300” />

4. IMPORTANT
In order for the extension commands to work, you need to establish a connection with the server. This command must always be present.
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/connect.jpg” width=“300” />

Translated with DeepL.com (free version)


### Check the movement of the Sprite. 
Be sure to select the number of the Marker you are using in the drop-down menu.
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/posizione.jpg” width=“400” />

### Control the rotation of the Sprite. 
From this drop-down mnenu you can decide whether to control the position or rotation of the SPrite by the Marker.

<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/rotazione.jpg” width=“300” />
### Draw a colored line.

<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/matitaColorata.jpg” width=“400” />
In case a colored line continues to appear even after deleting the code, click on the “pen on” command in the command list.
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/pulisci.jpg” width=“300” /> 

### Change the background
<img src=“https://github.com/futureinv/tuio_scratch/blob/main/readme_img/sfondo.jpg” width=“500” />


### Creare una pallina che rimabalza
Applicare il primo codice sullo Sprite controllato dal Marker.

<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/posizione.jpg" width="400" />

Selezionare poi la palla o l'oggetto da far rimbalzare.


<img src="https://github.com/futureinv/tuio_scratch/blob/main/readme_img/rimbalzo2.jpg" width="400" />

## Licenza
Distribuito con licenza BSD 3-Clause "New" or "Revised" License. Vedi il file `LICENSE.txt` per ulteriori informazioni.

## Ringraziamenti
- [scratch-tuio-sandbox](https://github.com/parsodyl/scratch-tuio-sandbox)
https://github.com/futureinv/tuio_scratch/assets/153513974/3371d48f-0345-4f25-ae80-228c48e50652
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



