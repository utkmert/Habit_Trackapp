const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitList = document.getElementById("habit-list");
const themeToggle = document.getElementById("theme-toggle");

const days = ["M", "T", "W", "T", "F", "S", "S"];

// Sayfa yüklendiğinde önceki verileri getir
window.onload = () => {
  const stored = JSON.parse(localStorage.getItem("habits")) || [];
  stored.forEach(habit => createHabit(habit.name, habit.checked));
};

// Tema değiştirme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️"; // Gündüz modu
  } else {
    themeToggle.textContent = "🌙"; // Gece modu
  }
});

// Yeni alışkanlık ekle
addHabitBtn.addEventListener("click", () => {
  const name = habitInput.value.trim();
  if (name === "") return;
  createHabit(name);
  habitInput.value = "";
});

function createHabit(name, checkedDays = []) {
  const card = document.createElement("div");
  card.className = "habit-card";

  const title = document.createElement("h3");
  title.textContent = name;

  const dayContainer = document.createElement("div");
  dayContainer.className = "days";

  days.forEach((d, i) => {
    const box = document.createElement("div");
    box.className = "day";
    box.textContent = d;
    if (checkedDays.includes(i)) box.classList.add("checked");

    box.addEventListener("click", () => {
      box.classList.toggle("checked");
      updateProgress(card);
      saveHabits();
    });

    dayContainer.appendChild(box);
  });

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const fill = document.createElement("div");
  fill.className = "progress-bar-fill";
  progressBar.appendChild(fill);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.onclick = () => {
    dayContainer.querySelectorAll(".day").forEach(d => d.classList.remove("checked"));
    updateProgress(card);
    saveHabits();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    card.remove();
    saveHabits();
  };

  actions.appendChild(resetBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(title);
  card.appendChild(dayContainer);
  card.appendChild(progressBar);
  card.appendChild(actions);

  habitList.appendChild(card);

  updateProgress(card);
  saveHabits();
}

function updateProgress(card) {
  const days = card.querySelectorAll(".day");
  const checked = [...days].filter(d => d.classList.contains("checked")).length;
  const fill = card.querySelector(".progress-bar-fill");
  const percent = Math.round((checked / 7) * 100);
  fill.style.width = percent + "%";
}

function saveHabits() {
  const allCards = document.querySelectorAll(".habit-card");
  const data = [];

  allCards.forEach(card => {
    const name = card.querySelector("h3").textContent;
    const checked = [];
    card.querySelectorAll(".day").forEach((d, i) => {
      if (d.classList.contains("checked")) checked.push(i);
    });
    data.push({ name, checked });
  });

  localStorage.setItem("habits", JSON.stringify(data));
}
