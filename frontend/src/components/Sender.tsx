import { useEffect, useState } from "react"

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket|null>();

  useEffect(()=>{
    const socket :WebSocket | null = new WebSocket('ws://localhost:8080');
    setSocket(socket)
    socket.onopen=()=>{
      socket.send(JSON.stringify({type:'sender'}))
    }
  },[])

  async function startSendingVideo(){
    if(!socket) return;
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);
    socket.send(JSON.stringify({type:"createOffer",sdp:pc.localDescription}))

    socket.onmessage = async(event)=>{
      const message = JSON.parse(event.data);
      await pc.setRemoteDescription(message.sdp)
    }
  }

  return (
    <div>Sender</div>
  )
}

