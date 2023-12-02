const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = API_KEY;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {

    // create a chat <li> elemnet with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
  // Define the API URL for OpenAI chat completions
  const API_URL = "https://api.openai.com/v1/chat/completions";

  // Extract the user message from the incoming chat element
  const messageElement = incomingChatLi.querySelector("p");
  const userMessage = messageElement.textContent;

  // Construct the request body for the API call
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${API_KEY}`, // Replace with your OpenAI API key
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Specify the desired GPT-J model
      messages: [{
        role: "user", // Indicate the message is from the user
        content: userMessage, // Pass the user's message content
      }],
    }),
  };

  // Send POST request to the OpenAI API and process the response
  fetch(API_URL, requestOptions)
    .then((response) => response.json()) // Convert response to JSON format
    .then((data) => {
      // Update the message element with the AI's response
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      // Handle errors during the API call
      messageElement.classList.add("error"); // Add error class to the message element
      messageElement.textContent = "Oops! Something went wrong. Please try again."; // Display error message
    })
    .finally(() => {
      // Scroll the chatbox to the bottom
      chatbox.scrollTo(0, chatbox.scrollHeight);
    });
};


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = ""
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox  
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 400);
    
};
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;   
    chatInput.style.height = `${chatInput.scrollHeight}px`;   
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
        
    }   
});

sendChatBtn.addEventListener("click",  handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));