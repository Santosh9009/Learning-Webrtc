import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let SenderSocket: null| WebSocket = null;
let ReceiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);  

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    if(message.type=="sender"){
      SenderSocket = ws;
      console.log('sender set')
    }else if(message.type === "receiver"){
      ReceiverSocket = ws;
      console.log('receiver set')
    }
    else if(message.type === "createOffer"){
      if(ws !== SenderSocket){
        return;
      }
      console.log('offer received')
      ReceiverSocket?.send(JSON.stringify({type:"createOffer",sdp:message.sdp}))
    }else if(message.type === "createAnswer"){
      if(ws!==ReceiverSocket){
        return;
      }
      console.log('answer received')
      SenderSocket?.send(JSON.stringify({type:"createAnswer", sdp:message.sdp}))
    }else if(message.type=="iceCandidate"){
      if(ws === SenderSocket){
        ReceiverSocket?.send(JSON.stringify({type:"iceCandidate",candidate:message.candidate}))
      }
      if(ws === ReceiverSocket){
        SenderSocket?.send(JSON.stringify({type:"iceCandidate",candidate:message.candidate}))
      }
    }
  });

});