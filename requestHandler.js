// ---- CONFIGURABLE OBJECTS ----

// Change this to your API endpoint
const baseUrl = "http://0.0.0.0:3000/api/v1/me";

// Change headers as needed
const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTQxN2RjMTAxMGRiMmRlY2UxNGMyMyIsImlhdCI6MTc3OTcxMDY4MCwiZXhwIjoxNzgwNTc0NjgwfQ.lxdSCqxsbgd0zm4seIwnE41gKPi9oacWrA7clDGDHqE",
};

// Add any query parameters you want to send
const queryParams = {
  //   foo: "bar",
  //   page: 1,
  //   limit: 10,
};

// Add your request body (ignored for GET requests)
const body = {
  email: "mona@gmail.com",
  name: "mona",
  password: "iman00084",
  // passwordConfirmation: "iman00084",
  // role: "admin",
};

//HTTP method
const method = "GET"; // GET, POST, PUT, DELETE etc.

// ---- GENERIC REQUEST HANDLER ----

async function sendRequest() {
  try {
    // Construct query string
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    // Build fetch options
    const options = {
      method,
      headers,
    };

    // Add body only when needed
    if (method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    console.log("Sending request to:", url);
    const res = await fetch(url, options);

    // Print status
    console.log("Status Code:", res.status);

    // Try reading JSON (fallback if not JSON)
    let responseData;
    try {
      responseData = await res.json();
    } catch {
      responseData = await res.text();
    }

    console.log("Response:");
    console.log(responseData);
  } catch (error) {
    console.error("Error sending request:", error.message);
  }
}

sendRequest();
