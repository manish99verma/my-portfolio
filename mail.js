// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7Tn8zXAkeOiWXsCAACWyOtp3KezRYSzw",
  authDomain: "my-portfolio-b0995.firebaseapp.com",
  databaseURL: "https://my-portfolio-b0995-default-rtdb.firebaseio.com",
  projectId: "my-portfolio-b0995",
  storageBucket: "my-portfolio-b0995.appspot.com",
  messagingSenderId: "979874989766",
  appId: "1:979874989766:web:ee0fcd2212beb0e22e79c7",
  measurementId: "G-M1F7S6LJTX",
};

const errorMessageStyles = {
  none: "error-message-invisible",
  failure: "error-message",
  success: "error-message-sent",
};

let sendingMessage = false;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference of databse
const messagesDbRef = firebase.database();

const sendMessage = function () {
  if (sendingMessage) return;

  sendingMessage = true;

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var subject = document.getElementById("subject").value.trim();
  var message = document.getElementById("comment").value.trim();

  // Validating
  let error = validateInput(name, email, subject, message);
  if (error == null) {
    uploadData(name, email, subject, message);
  } else {
    showErroMessage(error, false);
    sendingMessage = false;
  }
};

const uploadData = function (name, email, subject, message) {
  showErroMessage("Sending....", true);

  let sentTime = Date.now();

  const msgId = generateUUID();
  const time = Date.now();
  const timeZoneOffset = getTimeZoneOffset();

  messagesDbRef.ref("messages/" + msgId).set(
    {
      name: name,
      email: email,
      subject: subject,
      message: message,
      sentTime: time,
      timeZoneOffset: timeZoneOffset,
    },
    (error) => {
      // On Failed to write
      if (error) {
        showErroMessage(error.message, false);
        sendingMessage = false;
      }
      // On Successful
      else {
        // Clear message
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("comment").value = "";

        // Show message sent info
        showErroMessage("Message sent", true);

        // remove message sent info after 2 second
        setTimeout(() => {
          showErroMessage("", true);
          sendingMessage = false;
        }, 10000);
      }
    }
  );
};

function showErroMessage(message, status) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;

  for (const key in errorMessageStyles) {
    errorElement.classList.remove(errorMessageStyles[key]);
  }

  if (message === "") {
    errorElement.classList.add(errorMessageStyles["none"]);
  } else if (status) {
    errorElement.classList.add(errorMessageStyles["success"]);
  } else {
    errorElement.classList.add(errorMessageStyles["failure"]);
  }
}

function getTimeZoneOffset() {
  const date = new Date();
  const offsetInMinutes = date.getTimezoneOffset();
  const hoursOffset = Math.abs(Math.floor(offsetInMinutes / 60));
  const minutesOffset = Math.abs(offsetInMinutes % 60);
  const sign = offsetInMinutes > 0 ? "-" : "+";

  return `${sign}${pad(hoursOffset)}:${pad(minutesOffset)}`;
}

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function validateInput(name, email, subject, message) {
  if (name === "") return "Please enter your name";
  if (email === "") return "Please enter your email";
  if (subject === "") return "Please enter your subject";
  if (message === "") return "Please enter your message";

  if (name.length < MINIMUM_NAME_LENGTH) return "Please enter a valid name";

  if (name.length > MAXIMUN_NAME_LENGTH) return "Please enter a shorter name";

  if (email.length < MINIMUM_EMAIL_LENGTH) return "Please enter a valid email";

  if (email.length > MAXIMUN_EMAIL_LENGTH)
    return "Please enter a shorter Email";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email";

  if (subject.length < MINIMUM_SUBJECT_LENGTH)
    return "Please enter a longer subject";

  if (subject.length > MAXIMUM_SUBJECT_LENGTH)
    return "Please enter a smaller subject";

  if (message.length < MINIMUM_MESSAGE_LENGTH)
    return "Please enter a longer message";

  if (message.length > MAXIMUM_MESSAGE_LENGTH)
    return "Please enter a shorter message";

  return null;
}

// Costants
const MINIMUM_NAME_LENGTH = 3;
const MAXIMUN_NAME_LENGTH = 50;
const MINIMUM_EMAIL_LENGTH = 5;
const MAXIMUN_EMAIL_LENGTH = 100;
const MINIMUM_SUBJECT_LENGTH = 3;
const MAXIMUM_SUBJECT_LENGTH = 1000;
const MINIMUM_MESSAGE_LENGTH = 10;
const MAXIMUM_MESSAGE_LENGTH = 8000;
