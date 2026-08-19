// OneSignal exige su worker en esta ruta exacta del root (su config de
// dashboard manda sobre los parámetros del init). Como dos workers no
// pueden controlar el scope "/", este archivo carga el de Serwist —
// que a su vez importa el SDK de OneSignal (ver app/sw.ts). Resultado:
// un único worker que hace offline de PWA y push.
importScripts("/sw.js");
