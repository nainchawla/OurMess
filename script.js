let currentMess = "veg"; // Default to Veg Mess
let currentDate = new Date().toLocaleDateString('en-CA'); // Today's Date in 'YYYY-MM-DD' format

let menuData = {}; // To store fetched menu data

// Function to fetch menu data from JSON
async function fetchMenu() {
    try {
        const response = await fetch(`menu.json?t=${new Date().getTime()}`);
        menuData = await response.json();

        // Check if today's menu exists; if not, default to the first available date
        if (!menuData[currentMess][currentDate]) {
            alert("No menu available for today's date. Defaulting to the first date in the JSON.");
            currentDate = Object.keys(menuData[currentMess])[0];
        }
        updateMenuDisplay();
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
}

// Function to update menu display
function updateMenuDisplay() {
    const menu = menuData[currentMess][currentDate];
    const menuContainer = document.querySelector(".menu");
    const dateLabel = document.querySelector(".date-label");

    // Generate dynamic labels for Today, Yesterday, and Tomorrow
    const today = new Date().toLocaleDateString('en-CA');
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-CA');
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA');

    let label = "";
    if (currentDate === today) label = "(Today)";
    else if (currentDate === yesterday) label = "(Yesterday)";
    else if (currentDate === tomorrow) label = "(Tomorrow)";

    dateLabel.textContent = label;

    // Update the menu content
    if (menu) {
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
    } else {
        alert("No menu available for this date.");
    }
}

// Helper function to format date
function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric", weekday: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
}

// Event listener for mess toggle
document.querySelectorAll(".toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".toggle").forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        currentMess = e.target.id; // Set the current mess based on the button ID
        updateMenuDisplay(); // Reload the menu
    });
});

// Event listeners for navigation
document.getElementById("prev").addEventListener("click", () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1); // Go to the previous date
    const newDate = date.toLocaleDateString('en-CA');
    if (!menuData[currentMess][newDate]) {
        alert("No menu available for this date.");
        return;
    }
    currentDate = newDate; // Update `currentDate`
    updateMenuDisplay();
});

document.getElementById("next").addEventListener("click", () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1); // Go to the next date
    const newDate = date.toLocaleDateString('en-CA');
    if (!menuData[currentMess][newDate]) {
        alert("No menu available for this date.");
        return;
    }
    currentDate = newDate; // Update `currentDate`
    updateMenuDisplay();
});

// Initialize the page
window.onload = () => {
    currentDate = new Date().toLocaleDateString('en-CA'); // Reset to today's date
    fetchMenu();
};
