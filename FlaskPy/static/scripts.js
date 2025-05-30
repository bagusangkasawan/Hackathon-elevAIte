    // Elements
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    
    // Functions
    function sendMessage() {
      const message = userInput.value.trim();
      if (message === "") return;

      appendMessage("Kamu", message, "chat-message user-message");

      // Clear input
      userInput.value = "";
      scrollChatToBottom();

      // Langsung kirim ke fetch
      fetchAIResponse(message);
    }
    
    function appendMessage(sender, content, className, isMarkdown = false) {
      const messageElement = document.createElement("div");
      messageElement.className = className;

      const senderElement = document.createElement("strong");
      senderElement.textContent = sender + ":";
      
      const contentElement = document.createElement("span");
      contentElement.innerHTML = isMarkdown ? marked.parse(content) : escapeHtml(content);
      
      messageElement.appendChild(senderElement);
      messageElement.appendChild(document.createTextNode(" "));
      messageElement.appendChild(contentElement);
      
      chatBox.appendChild(messageElement);
      scrollChatToBottom();
      return messageElement;
    }
    
    function fetchAIResponse(message) {
      // Tampilkan loading
      const loadingMsg = document.createElement("div");
      loadingMsg.className = "chat-message ai-message";
      
      const loadingSender = document.createElement("strong");
      loadingSender.textContent = "MentalMate:";
      
      const loadingDots = document.createElement("div");
      loadingDots.className = "loading-dots";
      loadingDots.innerHTML = "<span></span><span></span><span></span>";
      
      loadingMsg.appendChild(loadingSender);
      loadingMsg.appendChild(document.createTextNode(" "));
      loadingMsg.appendChild(loadingDots);
      
      chatBox.appendChild(loadingMsg);
      scrollChatToBottom();

      fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `user_input=${encodeURIComponent(message)}`
      })
      .then(res => res.json())
      .then(data => {
        // Hapus loading
        chatBox.removeChild(loadingMsg);

        // Bersihkan tag HTML yang mungkin ada dalam respons
        const cleanedResponse = data.response.replace(/<\/?p>/g, '').replace(/\n{2,}/g, '\n\n');
        
        const aiMessage = document.createElement("div");
        aiMessage.className = "chat-message ai-message";
        
        const aiSender = document.createElement("strong");
        aiSender.textContent = "MentalMate:";
        
        const aiContent = document.createElement("span");
        aiContent.className = "ai-content";
        
        aiMessage.appendChild(aiSender);
        aiMessage.appendChild(document.createTextNode(" "));
        aiMessage.appendChild(aiContent);
        
        chatBox.appendChild(aiMessage);
        typeText(aiContent, cleanedResponse);
      })
      .catch(err => {
        chatBox.removeChild(loadingMsg);

        const errorMsg = document.createElement("div");
        errorMsg.className = "chat-message ai-message";
        
        const errorSender = document.createElement("strong");
        errorSender.textContent = "MentalMate:";
        
        const errorContent = document.createElement("span");
        errorContent.textContent = " Maaf, terjadi kesalahan. Silakan coba lagi nanti.";
        
        errorMsg.appendChild(errorSender);
        errorMsg.appendChild(errorContent);
        
        chatBox.appendChild(errorMsg);
        console.error("Error fetching AI response:", err);
      });
    }
    
    function typeText(element, text, index = 0, speed = 10) {
      const html = marked.parse(text); // Convert markdown to HTML

      // Split HTML into characters for typing effect
      let i = 0;
      function typeChar() {
        if (i <= html.length) {
          element.innerHTML = html.substring(0, i);
          scrollChatToBottom();
          i++;
          setTimeout(typeChar, speed);
        }
      }

      typeChar();
    }
    
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    function scrollChatToBottom() {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Handle textarea auto-resize
    userInput.addEventListener("input", function() {
      userInput.style.height = "auto";
      userInput.style.height = (userInput.scrollHeight) + "px";
      // Limit to 4 rows
      if (userInput.scrollHeight > (24 * 4)) {
        userInput.style.overflowY = "auto";
      } else {
        userInput.style.overflowY = "hidden";
      }
    });
    
    // Event Listeners
    sendButton.addEventListener("click", sendMessage);
    
    userInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      });
    });

    document.addEventListener("DOMContentLoaded", function () {
        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(link => {
            link.addEventListener("click", function () {
                // Hapus kelas "active" dari semua link
                navLinks.forEach(nav => nav.classList.remove("active"));

                // Tambahkan kelas "active" ke link yang diklik
                this.classList.add("active");
            });
        });
    });
    
    // Make the navbar change color on scroll
    window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    });
    
    // Script for chatbot modal interactivity enhancement
    const chatbotModalElement = document.getElementById('chatbotModal');

    if (chatbotModalElement) {
        chatbotModalElement.addEventListener('shown.bs.modal', () => {
            if (typeof scrollChatToBottom === 'function') {
                scrollChatToBottom();
            }
            if (typeof userInput !== 'undefined' && userInput) {
                userInput.focus();
            }
        });
    }
    