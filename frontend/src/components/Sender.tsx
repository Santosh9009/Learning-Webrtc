import { useEffect, useState } from "react";

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    const socket: WebSocket | null = new WebSocket("ws://localhost:8080");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };

    return ()=>{
      socket.close();
    }
  }, []);

  async function startSendingVideo() {
    if (!socket) return;
    const pc = new RTCPeerConnection();

    pc.onnegotiationneeded=async()=>{
      console.log("negociation")
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.send(
        JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
      );
    }

    pc.onicecandidate = (event) => {
      console.log(event);
      socket.send(
        JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
      );
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createAnswer") {
        await pc.setRemoteDescription(message.sdp);
      } else if (message.type === "iceCandidate") {
        await pc.addIceCandidate(message.candidate);
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    pc.addTrack(stream.getTracks()[0])
  }

  return (
    <div>
      Sender
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  );
};
