import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { RetellWebClient } from "retell-client-js-sdk";

const agentId = process.env.REACT_APP_RETELL_AGENTID;

interface RegisterCallResponse {
  access_token: string;
}

const retellWebClient = new RetellWebClient();

const App = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    retellWebClient.on("call_started", () => {
      console.log("call started");
      setIsCalling(true);
    });

    retellWebClient.on("call_ended", () => {
      console.log("call ended");
      setIsCalling(false);
      setIsAgentSpeaking(false);
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("agent_start_talking");
      setIsAgentSpeaking(true);
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("agent_stop_talking");
      setIsAgentSpeaking(false);
    });

    retellWebClient.on("audio", (audio) => {
      // Handle audio if needed
    });

    retellWebClient.on("update", (update) => {
      // Handle updates if needed
    });

    retellWebClient.on("metadata", (metadata) => {
      // Handle metadata if needed
    });

    retellWebClient.on("error", (error) => {
      console.error("An error occurred:", error);
      retellWebClient.stopCall();
      setIsCalling(false);
      setIsAgentSpeaking(false);
    });
  }, []);

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
      console.error("Error registering call:", err);
      throw new Error(String(err));
    }
  }

  return (
    <div className="App" ref={containerRef}>
      <header className="App-header">
        <div
          className={`portrait-container ${isCalling ? 'active' : 'inactive'} ${isAgentSpeaking ? 'agent-speaking' : ''}`}
          onClick={toggleConversation}
        >
          <img
            src="/Fiona_Round.png"
            alt="Fiona"
            className="agent-portrait"
          />
        </div>
      </header>
    </div>
  );
};

export default App;
