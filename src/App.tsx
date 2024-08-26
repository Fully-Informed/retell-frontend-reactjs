import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { RetellWebClient } from "retell-client-js-sdk";

const agentId = process.env.REACT_APP_RETELL_AGENTID;

interface RegisterCallResponse {
  callId?: string;
  sampleRate: number;
}

const webClient = new RetellWebClient();

const App = () => {
  const [callStatus, setCallStatus] = useState<'not-started' | 'active' | 'inactive'>('not-started');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { RetellWebClient } from "retell-client-js-sdk";

const agentId = process.env.REACT_APP_RETELL_AGENTID;

interface RegisterCallResponse {
  callId?: string;
  sampleRate: number;
}

const retellWebClient = new RetellWebClient();

const App = () => {
  const [callStatus, setCallStatus] = useState<'not-started' | 'active' | 'inactive'>('not-started');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  retellWebClient.on("call_started", () => {
    console.log("call started");
  });

  retellWebClient.on("call_ended", () => {
    console.log("call ended");
    setIsCalling(false);
  });

  retellWebClient.on("agent_start_talking", () => {
    console.log("agent_start_talking");
  });

  retellWebClient.on("agent_stop_talking", () => {
    console.log("agent_stop_talking");
  });

  retellWebClient.on("audio", (audio) => {
    // console.log(audio);
  });

  retellWebClient.on("update", (update) => {
    // console.log(update);
  });

  retellWebClient.on("metadata", (metadata) => {
    // console.log(metadata);
  });

  retellWebClient.on("error", (error) => {
    console.error("An error occurred:", error);
    retellWebClient.stopCall();
  });
}, []);

  const toggleConversation = async () => {
    if (callStatus === 'active') {
      webClient.stopConversation();
    } else {
      setCallStatus('active');
      setIsAgentSpeaking(true);
      const registerCallResponse = await registerCall(agentId);
      if (registerCallResponse.callId) {
        webClient
          .startConversation({
            callId: registerCallResponse.callId,
            sampleRate: registerCallResponse.sampleRate,
            enableUpdate: true,
          })
          .catch(console.error);
      }
    }
  };
  
  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    console.log("Registering call for agent:", agentId);
    try {
      const response = await fetch("/api/register-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: agentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: RegisterCallResponse = await response.json();
      console.log("Call registered successfully:", data);
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw new Error(String(err));
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div 
          ref={containerRef} 
          className={`portrait-container 
            ${callStatus === 'active' ? 'active' : ''} 
            ${callStatus === 'inactive' ? 'inactive' : ''} 
            ${isAgentSpeaking ? 'agent-speaking' : ''}`}
          onClick={toggleConversation}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/Fiona_Round.png`}
            alt="Agent Portrait" 
            className="agent-portrait"
          />
        </div>
      </header>
    </div>
  );
};

export default App;


const toggleConversation = async () => {
  if (isCalling) {
    retellWebClient.stopCall();
  } else {
    const registerCallResponse = await registerCall(agentId);
    if (registerCallResponse.access_token) {
      retellWebClient
        .startCall({
          accessToken: registerCallResponse.access_token,
        })
        .catch(console.error);
      setIsCalling(true);
    }
  }
};
  
async function registerCall(agentId: string): Promise<RegisterCallResponse> {
  try {
    const response = await fetch("/api/create-web-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: RegisterCallResponse = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(String(err));
  }
}

  return (
    <div className="App">
      <header className="App-header">
        <div 
          ref={containerRef} 
          className={`portrait-container 
            ${callStatus === 'active' ? 'active' : ''} 
            ${callStatus === 'inactive' ? 'inactive' : ''} 
            ${isAgentSpeaking ? 'agent-speaking' : ''}`}
          onClick={toggleConversation}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/Fiona_Round.png`}
            alt="Agent Portrait" 
            className="agent-portrait"
          />
        </div>
      </header>
    </div>
  );
};

export default App;
