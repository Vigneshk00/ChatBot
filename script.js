// const chatInput = document.querySelector(".chat-input textarea");
// const sendChatBtn = document.querySelector(".chat-input button");
// const chatbox = document.querySelector(".chatbox");

// let userMessage;

// // const API_KEY = "AIzaSyBnQomQnLjT7nSsGEHimyG3Oh2tBxa3xVY";
// // const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
// const API_URL = "http://localhost:11434/api/generate";

// const createChatLi = (message, className) => {
//   const chatLi = document.createElement("li");
//   chatLi.classList.add("chat", className);
//   let chatContent =
//     className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
//   chatLi.innerHTML = chatContent;
//   return chatLi;
// };


// const generateAPIResponse = async (incomingChatLi) => {
//   const messageElement = incomingChatLi.querySelector("p");

//   const loadingIndicator = document.createElement("span");
//   loadingIndicator.classList.add("loading-indicator");
//   loadingIndicator.textContent = "  "; // Add a space for visual separation
//   messageElement.appendChild(loadingIndicator);

//   try {
//     // Make the fetch call to the API
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "Llama3.1",
//         prompt: userMessage,
//         stream: false
//       })
//     });

//     // Check if the response is OK
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     // Parse the response as JSON
//     const data = await response.json();

//     // Calculate the elapsed time
//     const endTime = new Date();
//     const elapsedTime = endTime - startTime; // Time in milliseconds

//     // Access the appropriate part of the response
//     const apiResponse = data.response || "No response text found";
//     const finalResponse = formatResponse(apiResponse);

//     // Set the final response
//     messageElement.innerHTML = finalResponse;
//     loadingIndicator.remove();

//     const displayNextChunk = () => {
//       if (index < apiResponse.length) {
//         const nextChunk = apiResponse[index];
//         chatbox.appendChild(createChatLi(nextChunk, "chat-incoming"));
//         chatbox.scrollTo(0, chatbox.scrollHeight);
//         index++;
//         setTimeout(displayNextChunk, delay); // Call next chunk after delay
//       }
//     };

//     displayNextChunk(); // Start displaying the response
//   } catch (error) {
//     console.log(error);
//     messageElement.classList.add("error");
//     messageElement.textContent =
//       "Oops! Something went wrong. Please try again!";
//     loadingIndicator.remove();
//   }
// };


// function formatResponse(text) {
//   // Convert '**' into HTML heading tags
//   let formattedText = text
//     .replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>") // Heading level 2
//     .replace(/\*(.*?)\*/g, "<li>$1</li>") // Bullet points
//     .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>") // Multiline code block
//     .replace(/`(.*?)`/g, "<code>$1</code>"); // Inline code block

//   return formattedText;
// }

// const handleChat = () => {
//   userMessage = chatInput.value.trim();  // Get the user input
  
//   if (!userMessage) {
//     return;  // If the message is empty, do nothing
//   }

//   // Append the user's message to the chatbox
//   chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
//   chatbox.scrollTo(0, chatbox.scrollHeight);

//   // Clear the input field after submitting the message
//   chatInput.value = "";  

//   setTimeout(() => {
//     const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
//     chatbox.appendChild(incomingChatLi);
//     chatbox.scrollTo(0, chatbox.scrollHeight);
//     generateAPIResponse(incomingChatLi);
//   }, 600);
// };

// // Event listener for handling Enter key and Shift + Enter key
// chatInput.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     if (event.shiftKey) {
//       // Shift + Enter: Add a new line
//       chatInput.value += "\n";  // Add a new line to the input
//       event.preventDefault();   // Prevent the default behavior of Enter
//     } else {
//       // Enter: Submit the chat
//       handleChat();
//       event.preventDefault();   // Prevent the default behavior of Enter
//     }
//   }
// });

// // Button click event for sending the chat
// sendChatBtn.addEventListener("click", handleChat);


// function newChat() {
//   const chatbox = document.querySelector(".chatbox");
//   const chatElements = chatbox.querySelectorAll("li");

//   // Start from the second element (index 1)
//   for (let i = 1; i < chatElements.length; i++) {
//     chatElements[i].remove();
//   }
// }

// sendChatBtn.addEventListener("click", handleChat);

const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input button");
const chatbox = document.querySelector(".chatbox");

let userMessage;

const API_URL = "http://localhost:11434/api/generate";

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  chatLi.innerHTML = `<p>${message}</p>`;
  return chatLi;
};

const generateAPIResponse = async (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector("p");

  // Display "Thinking..." and add a loading spinner
  messageElement.textContent = "Thinking..."; // Show "Thinking..." initially
  const loadingIndicator = document.createElement("span");
  loadingIndicator.classList.add("loading-indicator");
  loadingIndicator.innerHTML = '<div class="spinner"></div>'; // Add the spinner next to "Thinking..."
  messageElement.appendChild(loadingIndicator); // Append the spinner

  const startTime = new Date(); // Start the timer

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Llama3.1",
        prompt: userMessage,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const apiResponse = data.response || "No response text found";
    const finalResponse = formatResponse(apiResponse);

    // Calculate and log the elapsed time
    const endTime = new Date();
    const elapsedTime = endTime - startTime; // Time in milliseconds
    console.log(`Response time: ${elapsedTime} ms`);

    // Once response starts showing, remove "Thinking..." and loading spinner
    messageElement.innerHTML = ""; // Clear the "Thinking..." message and spinner
    let index = 0;
    const words = finalResponse.split(" "); // Split the response into words
    const delay = 100; // Adjust the delay for faster/slower display

    const displayNextChunk = () => {
      if (index < words.length) {
        const nextWord = words[index] + " "; // Add a space after each word
        messageElement.innerHTML += nextWord; // Display word progressively
        chatbox.scrollTo(0, chatbox.scrollHeight); // Keep scrolling to the latest message
        index++;
        setTimeout(displayNextChunk, delay); // Call next chunk after delay
      }
    };

    displayNextChunk(); // Start displaying the response progressively
  } catch (error) {
    console.log(error);
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again!";
    loadingIndicator.remove();
  }
};

function formatResponse(text) {
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>")
    .replace(/\*(.*?)\*/g, "<li>$1</li>")
    .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
    .replace(/`(.*?)`/g, "<code>$1</code>");

  return formattedText;
}

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get the user input
  
  if (!userMessage) {
    return; // If the message is empty, do nothing
  }

  chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  chatInput.value = ""; // Clear the input field after submitting the message

  setTimeout(() => {
    const incomingChatLi = createChatLi("", "chat-incoming"); // Empty message for spinner
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateAPIResponse(incomingChatLi);
  }, 600);
};

// Event listener for handling Enter key and Shift + Enter key
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      // Shift + Enter: Add a new line
      chatInput.value += "\n"; // Add a new line to the input
      event.preventDefault(); // Prevent the default behavior of Enter
    } else {
      // Enter: Submit the chat
      handleChat();
      event.preventDefault(); // Prevent the default behavior of Enter
    }
  }
});

// Button click event for sending the chat
sendChatBtn.addEventListener("click", handleChat);

function newChat() {
  const chatElements = chatbox.querySelectorAll("li");
  for (let i = 1; i < chatElements.length; i++) {
    chatElements[i].remove();
  }
}
