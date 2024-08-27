import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { RetellWebClient } from "retell-client-js-sdk";

const agentId = process.env.REACT_APP_RETELL_AGENTID;

console.log("Agent ID:", agentId); // Log the agent ID

interface RegisterCallResponse {
  access_token: string;
}

const retellWebClient = new RetellWebClient();
console.log("RetellWebClient initialized");

const App = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log("App component rendered");

  useEffect(() => {
    console.log("Setting up event listeners");

    retellWebClient.on("call_started", () => {
      console.log("Call started event received");
      setIsCalling(true);
    });

    retellWebClient.on("call_ended", () => {
      console.log("Call ended event received");
      setIsCalling(false);
      setIsAgentSpeaking(false);
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("Agent start talking event received");
      setIsAgentSpeaking(true);
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("Agent stop talking event received");
      setIsAgentSpeaking(false);
    });

    retellWebClient.on("audio", (audio) => {
      console.log("Audio event received", audio.length);
    });

    retellWebClient.on("update", (update) => {
      console.log("Update event received", update);
    });

    retellWebClient.on("metadata", (metadata) => {
      console.log("Metadata event received", metadata);
    });

    retellWebClient.on("error", (error) => {
      console.error("Error event received:", error);
      retellWebClient.stopCall();
      setIsCalling(false);
      setIsAgentSpeaking(false);
    });

    console.log("Event listeners set up complete");
  }, []);

const toggleConversation = async () => {
  console.log("toggleConversation called, current isCalling:", isCalling);
  if (isCalling) {
    console.log("Stopping call");
    retellWebClient.stopCall();
  } else {
    console.log("Starting call");
    try {
      const registerCallResponse = await registerCall(agentId);
      console.log("Register call response:", registerCallResponse);
      if (registerCallResponse.access_token) {
        console.log("Starting call with access token");
        await retellWebClient.startCall({
          accessToken: registerCallResponse.access_token,
        });
        console.log("Call started successfully");
      } else {
        console.error("No access token received");
      }
    } catch (error) {
      console.error("Error starting call:", error.message);
      // You might want to show an error message to the user here
    }
  }
};

  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    console.log("Registering call for agent ID:", agentId);
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

      console.log("Register call response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: RegisterCallResponse = await response.json();
      console.log("Register call response data:", data);
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw new Error(String(err));
    }
  }

  console.log("Rendering, isCalling:", isCalling, "isAgentSpeaking:", isAgentSpeaking);

  return (
    <div className="App" ref={containerRef}>
      <header className="App-header">
        <div
          className={`portrait-container ${isCalling ? 'active' : 'inactive'} ${isAgentSpeaking ? 'agent-speaking' : ''}`}
          onClick={toggleConversation}
        >
          <img
            src="/Fiona_Round.png"
            alt="AI Agent"
            className="agent-portrait"
          />
        </div>
      </header>
    </div>
  );
};

export default App;
