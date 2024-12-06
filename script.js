let currentMess = "veg"; // Default to Veg Mess
let currentDate = new Date().toISOString().split("T")[0]; // Today's Date
let menuData = {}; // To store fetched menu data

// Function to fetch menu data from JSON
async function fetchMenu() {
  try {
    const response = await fetch("menu.json");
    menuData = await response.json();
    if (!menuData[currentMess][currentDate]) {
      alert("No menu available for today's date. Defaulting to the first date in the JSON.");
      currentDate = Object.keys(menuData[currentMess])[0];
    }
    loadMenu();
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
}

// Function to load menu into the webpage
function loadMenu() {
  const menu = menuData[currentMess][currentDate];
  const menuContainer = document.querySelector(".menu");
  const dateLabel = document.querySelector(".date-label");
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];

  // Determine the label to display
  let label = "";
  if (currentDate === today) {
    label = "(Today)";
  } else if (currentDate === yesterday) {
    label = "(Yesterday)";
  } else if (currentDate === tomorrow) {
    label = "(Tomorrow)";
  }
  dateLabel.textContent = label;

  // Populate the menu
  menuContainer.innerHTML = `
    <div class="meal">
      <h5>BREAKFAST:</h5>
      <p>${menu.breakfast.menu}</p>
      <span>${menu.breakfast.time}</span>
    </div>
    <div class="meal">
      <h5>LUNCH:</h5>
      <p>${menu.lunch.menu}</p>
      <span>${menu.lunch.time}</span>
    </div>
    <div class="meal">
      <h5>SNACKS:</h5>
      <p>${menu.snacks.menu}</p>
      <span>${menu.snacks.time}</span>
    </div>
    <div class="meal">
      <h5>DINNER:</h5>
      <p>${menu.dinner.menu}</p>
      <span>${menu.dinner.time}</span>
    </div>
  `;
  document.getElementById("date").textContent = formatDate(currentDate);
}

// Helper function to format date
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric", weekday: "long" };
  return new Date(date).toLocaleDateString("en-US", options);
}

// Event listeners for mess toggle
document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".toggle").forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentMess = e.target.id;
    loadMenu();
  });
});

// Event listeners for navigation
document.getElementById("prev").addEventListener("click", () => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() - 1);
  currentDate = date.toISOString().split("T")[0];
  if (!menuData[currentMess][currentDate]) {
    alert("No menu available for this date.");
    date.setDate(date.getDate() + 1);
    currentDate = date.toISOString().split("T")[0];
  }
  loadMenu();
});

document.getElementById("next").addEventListener("click", () => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 1);
  currentDate = date.toISOString().split("T")[0];
  if (!menuData[currentMess][currentDate]) {
    alert("No menu available for this date.");
    date.setDate(date.getDate() - 1);
    currentDate = date.toISOString().split("T")[0];
  }
  loadMenu();
});

// Initialize the page
window.onload = fetchMenu;

// Event listeners for mess toggle
document.querySelectorAll(".toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".toggle").forEach((btn) => btn.classList.remove("active")); // Remove active class from all buttons
      e.target.classList.add("active"); // Add active class to clicked button
      currentMess = e.target.id; // Set the current mess based on the button ID
      loadMenu(); // Reload the menu
    });
  });
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker Registered'));
  }