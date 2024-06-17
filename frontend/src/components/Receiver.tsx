import { useEffect} from "react";

export const Receiver = () => {

  useEffect(() => {
    const socket: WebSocket | null = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(message.sdp);
        const Answer = await pc.createAnswer();
        pc.setLocalDescription(Answer);
        socket.send(
          JSON.stringify({ type: "createAnswer", sdp: pc.localDescription })
        );
      }
    };
  }, []);

  return <div>Receiver</div>;
};
