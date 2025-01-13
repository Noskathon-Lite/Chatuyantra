import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useUser } from "../userContext"; // Import user context
import io from "socket.io-client"; // Import socket.io-client

export default function Chatbox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useUser(); // Access user data from context
  const fullName = user.name || "John Doe"; // Default to "John Doe" if fullName is unavailable
  const token = user?.token; // Access the token from user context

  const SERVER_URL = "https://723a-110-44-118-28.ngrok-free.app"; // Replace with your server's URL
  const flatListRef = useRef(null); // Ref for FlatList
  const [socket, setSocket] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true); // Track if we are at the bottom of the chat

  // Fetch messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/chat/messages`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in Authorization header
          },
        });

        const data = await response.json();
        console.log("Fetched messages:", data);

        if (data && Array.isArray(data)) {
          const formattedMessages = data.map((msg) => ({
            id: msg._id,
            text: msg.text,
            fullName: msg.fullName,
            sentByMe: msg.fullName === fullName,
          }));
          setMessages(formattedMessages);
        }
      } 
      catch (error) {
        console.error("Failed to fetch messages:",error);
      }
    };

    fetchMessages();
  }, [token, fullName]);

  // WebSocket setup
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ["websocket"], // Use WebSocket as the transport protocol
      query: { token }, // Pass token for authentication if necessary
    });

    setSocket(newSocket);

    // Listen for new messages
    newSocket.on("chat message", (newMessage) => {
      console.log("New message received:", newMessage);

      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === newMessage._id)) {
          return prevMessages; // Prevent duplicate message
        }
        return [
          ...prevMessages,
          {
            id: newMessage._id,
            text: newMessage.text,
            fullName: newMessage.fullName,
            sentByMe: newMessage.fullName === fullName,
          },
        ];
      });

      // Scroll to bottom when a new message is received, but only if we are at the bottom
      if (isAtBottom) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [token, fullName, isAtBottom]);

  const sendMessage = () => {
    if (message.trim() !== "" && socket) {
      const newMessage = {
        fullName,
        text: message,
      };

      // Emit message to server
      socket.emit("chat message", newMessage);

      // Clear input field
      setMessage("");
    }
  };

  const handleScroll = (contentOffset, contentHeight) => {
    // Check if we're close to the bottom of the list
    const isCloseToBottom = contentOffset.y + contentHeight === contentHeight;
    setIsAtBottom(isCloseToBottom);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.chatWrapper}>
            <FlatList
              ref={flatListRef} // Reference for FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sentByMe ? styles.myMessage : styles.theirMessage,
                  ]}
                >
                  <Text style={styles.senderName}>{item.fullName}</Text>
                  <Text
                    style={[
                      styles.messageText,
                      item.sentByMe
                        ? styles.myMessageText
                        : styles.theirMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.chatContainer}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: false })
              }
              onScroll={({ nativeEvent }) => {
                const { contentOffset, contentSize } = nativeEvent;
                handleScroll(contentOffset, contentSize.height);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  chatWrapper: {
    flex: 1, // Ensure the chat container takes up remaining space
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 4, // Radius of the shadow
  },
  chatContainer: {
    flexGrow: 1, // Ensure the content grows to allow scrolling
    paddingBottom: 10, // Add some space at the bottom for the last message
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: "80%",
    borderRadius: 8,
    padding: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d4f8e8",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "#004d00",
  },
  theirMessageText: {
    color: "#333",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
