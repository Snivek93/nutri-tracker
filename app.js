const meals = [
  "Preentreno",
  "Desayuno",
  "Merienda Mañana",
  "Almuerzo",
  "Merienda Tarde",
  "Cena"
];

const foods = {
  "🥗 Fruta": { carbs: 15, protein: 0, fat: 0, kcal: 60, type: "carb" },
  "🥦 Vegetal": { carbs: 5, protein: 2, fat: 0, kcal: 25, type: "carb" },
  "🍚 Carbohidrato": { carbs: 5, protein: 2, fat: 0, kcal: 25, type: "carb" },
  "🍗 Prot. Magra": { carbs: 0, protein: 7, fat: 2, kcal: 45, type: "protein" },
  "🥩 Prot. Media": { carbs: 0, protein: 7, fat: 5, kcal: 75, type: "protein" },
  "🫒 Grasa": { carbs: 0, protein: 0, fat: 5, kcal: 45, type: "fat" },
  "🥜 Fruto Seco": { carbs: 7, protein: 5, fat: 15, kcal: 180, type: "fat" },
  "🥛 Lácteo": { carbs: 12, protein: 8, fat: 2, kcal: 100, type: "protein" }
};

const mealsContainer = document.getElementById("meals");
const goalInput = document.getElementById("calorieGoal");

let state = {};

function createMeals() {
  meals.forEach(meal => {
    state[meal] = {};

    const div = document.createElement("div");
    div.classList.add("meal");

    const header = document.createElement("div");
    header.classList.add("meal-header");
    header.innerHTML = `
      <span>${meal}</span>
      <span class="meal-kcal" id="kcal-${meal}">0 kcal</span>
    `;
    header.onclick = () => div.classList.toggle("active");

    const body = document.createElement("div");
    body.classList.add("meal-body");

    Object.keys(foods).forEach(food => {
      state[meal][food] = 0;

      const row = document.createElement("div");
      row.classList.add("food-row");

      row.innerHTML = `
        <span class="food-name ${foods[food].type}">${food}</span>
        <div class="controls">
          <button class="control-btn" onclick="changeQty('${meal}','${food}',-1)">−</button>
          <span class="quantity" id="qty-${meal}-${food}">0</span>
          <button class="control-btn" onclick="changeQty('${meal}','${food}',1)">+</button>
        </div>
      `;

      body.appendChild(row);
    });

    div.appendChild(header);
    div.appendChild(body);
    mealsContainer.appendChild(div);
  });
}

function changeQty(meal, food, amount) {
  state[meal][food] = Math.max(0, state[meal][food] + amount);
  document.getElementById(`qty-${meal}-${food}`).innerText = state[meal][food];
  updateTotals();
}

function updateTotals() {
  let totalKcal = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0;

  meals.forEach(meal => {
    let mealKcal = 0;

    Object.keys(foods).forEach(food => {
      const qty = state[meal][food];
      const data = foods[food];

      mealKcal += qty * data.kcal;
      totalKcal += qty * data.kcal;
      totalCarbs += qty * data.carbs;
      totalProtein += qty * data.protein;
      totalFat += qty * data.fat;
    });

    document.getElementById(`kcal-${meal}`).innerText = mealKcal + " kcal";
  });

  document.getElementById("totalCalories").innerText = totalKcal;
  document.getElementById("totalCarbs").innerText = totalCarbs + "g";
  document.getElementById("totalProtein").innerText = totalProtein + "g";
  document.getElementById("totalFat").innerText = totalFat + "g";

  updateProgress(totalKcal);
}

function updateProgress(calories) {
  const goal = parseInt(goalInput.value) || 1;
  const percent = Math.min((calories / goal) * 100, 100);
  document.getElementById("progressFill").style.width = percent + "%";
}

goalInput.addEventListener("input", () => updateTotals());

createMeals();
updateTotals();
