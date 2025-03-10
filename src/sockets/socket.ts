import { io, Socket } from "socket.io-client";


export class SocketSingleton {
  private static instance: Socket | null = null;
  private static isActive: boolean = false;

  private constructor() {}

  static getInstance(token  :string , documentID : string) {
    if (!SocketSingleton.instance ) {
      SocketSingleton.instance = io("http://localhost:4000", {
        auth: {
          userID : token,
        },
        query:{
            documentID
        },
        transports: ["websocket", "polling"],
        
      }
      );
      SocketSingleton.active();
    }
    
    return SocketSingleton.instance;
  }

  static getStatus() {
    return SocketSingleton.isActive;
  }


  static TheInstance (){
    return SocketSingleton.instance
  }
  static active() {
    SocketSingleton.isActive = true;
  }

  static disconnect() {
    if (SocketSingleton.instance) {
      SocketSingleton.instance.disconnect();
      console.log("Socket disconnected");
      SocketSingleton.instance = null;
      SocketSingleton.isActive = false;
    }
  }

  static emitEvent(eventName: string, data: unknown) {
    if (!this.instance) {
      console.error("Unable to connect to socket server");
      return;
    }
    this.instance?.emit(eventName, data, (response: unknown) => {
      console.log(response);
    });
  }

  static connectSocket(token : string , docId : string) {
    return SocketSingleton.getInstance(token, docId);
  }
}
