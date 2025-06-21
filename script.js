// Select main elements from the HTML
const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitList = document.getElementById("habit-list");
const themeToggle = document.getElementById("theme-toggle");

// Days of the week represented with initials
const days = ["M", "T", "W", "T", "F", "S", "S"];

// Load habits from localStorage when the page loads
window.onload = () => {
  const stored = JSON.parse(localStorage.getItem("habits")) || [];
  stored.forEach(habit => createHabit(habit.name, habit.checked));
};

// Handle theme toggle between light and dark modes
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Update icon or emoji based on the current theme
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Add new habit when the button is clicked
addHabitBtn.addEventListener("click", () => {
  const name = habitInput.value.trim();
  if (name === "") return; // Ignore empty input
  createHabit(name);       // Create new habit card
  habitInput.value = "";   // Clear the input field
});

// Function to create a habit card
function createHabit(name, checkedDays = []) {
  const card = document.createElement("div");
  card.className = "habit-card";

  const title = document.createElement("h3");
  title.textContent = name;

  const dayContainer = document.createElement("div");
  dayContainer.className = "days";

  // Create a day box for each day of the week
  days.forEach((d, i) => {
    const box = document.createElement("div");
    box.className = "day";
    box.textContent = d;

    // Mark as checked if this day is already selected
    if (checkedDays.includes(i)) box.classList.add("checked");

    // Toggle selection on click
    box.addEventListener("click", () => {
      box.classList.toggle("checked");
      updateProgress(card); // Update progress bar
      saveHabits();         // Save changes
    });

    dayContainer.appendChild(box);
  });

  // Create progress bar elements
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const fill = document.createElement("div");
  fill.className = "progress-bar-fill";
  progressBar.appendChild(fill);

  // Create Reset and Delete buttons
  const actions = document.createElement("div");
  actions.className = "card-actions";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.onclick = () => {
    // Uncheck all days
    dayContainer.querySelectorAll(".day").forEach(d => d.classList.remove("checked"));
    updateProgress(card);
    saveHabits();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    // Remove the card
    card.remove();
    saveHabits();
  };

  actions.appendChild(resetBtn);
  actions.appendChild(deleteBtn);

  // Assemble the habit card
  card.appendChild(title);
  card.appendChild(dayContainer);
  card.appendChild(progressBar);
  card.appendChild(actions);
  habitList.appendChild(card);

  updateProgress(card); // Initialize progress bar
  saveHabits();         // Save to localStorage
}

// Function to update the progress bar of a habit
function updateProgress(card) {
  const days = card.querySelectorAll(".day");
  const checked = [...days].filter(d => d.classList.contains("checked")).length;
  const fill = card.querySelector(".progress-bar-fill");
  const percent = Math.round((checked / 7) * 100);
  fill.style.width = percent + "%";
}

// Function to save all habits to localStorage
function saveHabits() {
  const allCards = document.querySelectorAll(".habit-card");
  const data = [];

  // Extract name and checked days from each habit card
  allCards.forEach(card => {
    const name = card.querySelector("h3").textContent;
    const checked = [];
    card.querySelectorAll(".day").forEach((d, i) => {
      if (d.classList.contains("checked")) checked.push(i);
    });
    data.push({ name, checked });
  });

  // Store the data as a JSON string
  localStorage.setItem("habits", JSON.stringify(data));
}
