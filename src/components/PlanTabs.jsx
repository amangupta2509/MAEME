import React, { useState } from "react";
import { icons } from "./Icons";

export function DietPlanTab() {
  const [sel, setSel] = useState({
    breakfast: "A",
    snack1: "A",
    lunch: "A",
    snack2: "A",
    dinner: "A",
  });
  const pick = (slot, opt) => setSel((p) => ({ ...p, [slot]: opt }));
  const StarIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#00a8a8"
      stroke="none"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
  const meals = [
    {
      id: "breakfast",
      title: "Breakfast",
      time: "7:30 AM",
      options: [
        {
          key: "A",
          name: "Quinoa Veggie Bowl",
          cal: "380 kcal",
          macros: "P18g  C52g  F10g",
          rec: true,
          ingredients: [
            ["Quinoa", "60g"],
            ["Spinach", "50g"],
            ["Cherry tomatoes", "80g"],
            ["Olive oil", "1 tsp"],
            ["Egg whites", "3"],
          ],
          steps: [
            "Cook quinoa for 15 min",
            "Sauté spinach and tomatoes",
            "Scramble egg whites",
            "Combine and serve",
          ],
        },
        {
          key: "B",
          name: "Whole wheat toast + PB + Banana",
          cal: "420 kcal",
          note: "High energy for workouts",
          ingredients: [
            ["Whole wheat bread", "2 slices"],
            ["Peanut butter", "2 tbsp"],
            ["Banana", "1 medium"],
            ["Honey", "1 tsp"],
          ],
          steps: [
            "Toast bread until golden",
            "Spread peanut butter evenly",
            "Slice banana on top",
            "Drizzle honey and serve immediately",
          ],
        },
        {
          key: "C",
          name: "Oats + Low-fat milk + Almonds + Honey",
          cal: "350 kcal",
          note: "Stable blood sugar",
          ingredients: [
            ["Rolled oats", "50g"],
            ["Low-fat milk", "250ml"],
            ["Almonds", "20g"],
            ["Honey", "1 tsp"],
            ["Water", "100ml"],
          ],
          steps: [
            "Mix oats, milk and water in a bowl",
            "Microwave for 3 minutes",
            "Stir well and let cool slightly",
            "Top with sliced almonds and drizzle honey",
          ],
        },
      ],
    },
    {
      id: "snack1",
      title: "Mid-Morning Snack",
      time: "10:30 AM",
      options: [
        {
          key: "A",
          name: "Greek Yogurt Parfait",
          cal: "180 kcal",
          rec: true,
          ingredients: [
            ["Greek yogurt", "150g"],
            ["Mixed berries", "60g"],
            ["Granola", "20g"],
          ],
          steps: ["Layer yogurt in glass", "Add berries", "Top with granola"],
        },
        {
          key: "B",
          name: "Apple + 5 Walnuts",
          cal: "175 kcal",
          note: "Heart-healthy fats",
          ingredients: [
            ["Apple", "1 medium"],
            ["Walnuts", "5 pieces"],
          ],
          steps: [
            "Wash and cut apple into slices",
            "Keep walnuts handy",
            "Eat apple slices with walnuts alternately",
            "Perfect before workouts",
          ],
        },
        {
          key: "C",
          name: "Roasted chickpeas + Cucumber",
          cal: "160 kcal",
          note: "High protein, low GI",
          ingredients: [
            ["Roasted chickpeas", "80g"],
            ["Cucumber", "1 medium"],
            ["Salt", "to taste"],
            ["Lemon juice", "1/2 tsp"],
            ["Black pepper", "pinch"],
          ],
          steps: [
            "Slice cucumber into pieces",
            "Take roasted chickpeas in a bowl",
            "Mix cucumber with chickpeas",
            "Season with salt, lemon juice and pepper",
          ],
        },
      ],
    },
    {
      id: "lunch",
      title: "Lunch",
      time: "1:00 PM",
      options: [
        {
          key: "A",
          name: "Grilled Chicken Mediterranean Bowl",
          cal: "520 kcal",
          macros: "P42g  C48g  F14g",
          rec: true,
          ingredients: [
            ["Chicken breast", "150g"],
            ["Brown rice", "80g"],
            ["Chickpeas", "60g"],
            ["Cucumber + tomato", "100g"],
            ["Olive oil + lemon", "dressing"],
          ],
          steps: [
            "Grill chicken 6 min per side",
            "Cook brown rice",
            "Assemble bowl with chickpeas and veggies",
            "Drizzle olive oil lemon dressing",
          ],
        },
        {
          key: "B",
          name: "Dal tadka + Multigrain roti 2 + Salad",
          cal: "480 kcal",
          note: "Complete Indian meal",
          ingredients: [
            ["Moong dal", "50g"],
            ["Turmeric powder", "1/2 tsp"],
            ["Cumin seeds", "1/2 tsp"],
            ["Garlic", "3 cloves"],
            ["Ginger", "1 tsp"],
            ["Green chili", "1"],
            ["Multigrain roti", "2"],
            ["Mixed salad", "100g"],
          ],
          steps: [
            "Boil moong dal until soft (20 min)",
            "Heat ghee, add cumin seeds",
            "Add garlic-ginger-chili paste",
            "Pour into cooked dal, simmer 2 min",
            "Warm roti and serve with tadka",
            "Serve fresh salad on the side",
          ],
        },
        {
          key: "C",
          name: "Paneer tikka wrap + Mint chutney",
          cal: "450 kcal",
          note: "Good vegetarian protein",
          ingredients: [
            ["Paneer", "100g"],
            ["Whole wheat wrap", "1"],
            ["Yogurt", "3 tbsp"],
            ["Ginger-garlic paste", "1 tsp"],
            ["Lemon juice", "1 tbsp"],
            ["Red chili powder", "1/2 tsp"],
            ["Cucumber", "50g"],
            ["Mint leaves", "10"],
            ["Cilantro", "10 leaves"],
          ],
          steps: [
            "Cut paneer into cubes",
            "Mix yogurt with spices and marinate 15 min",
            "Grill paneer for 3-4 min per side",
            "Make mint chutney by blending mint, cilantro, lemon",
            "Warm wrap and fill with paneer and cucumber",
            "Add mint chutney and roll",
          ],
        },
      ],
    },
    {
      id: "snack2",
      title: "Evening Snack",
      time: "4:30 PM",
      options: [
        {
          key: "A",
          name: "Protein Smoothie",
          cal: "220 kcal",
          macros: "P20g",
          rec: true,
          ingredients: [
            ["Banana", "1 medium"],
            ["Whey protein", "1 scoop"],
            ["Milk", "200 ml"],
            ["Chia seeds", "1 tsp"],
          ],
          steps: [
            "Add all ingredients to blender",
            "Blend for 45 seconds",
            "Serve chilled",
          ],
        },
        {
          key: "B",
          name: "Boiled Eggs (2)",
          cal: "140 kcal",
          note: "Best post-workout snack",
          ingredients: [
            ["Eggs", "2"],
            ["Salt", "to taste"],
            ["Black pepper", "pinch"],
          ],
          steps: [
            "Boil water in a pot (about 500ml)",
            "Place eggs in boiling water",
            "Cook for 10 minutes",
            "Remove and cool in cold water",
            "Peel and sprinkle salt and pepper",
          ],
        },
        {
          key: "C",
          name: "Mixed Nuts 30g + Green Tea",
          cal: "180 kcal",
          note: "Antioxidant boost",
          ingredients: [
            ["Almonds", "10g"],
            ["Walnuts", "10g"],
            ["Cashews", "10g"],
            ["Green tea bag", "1"],
            ["Water", "250ml"],
            ["Honey", "1 tsp"],
          ],
          steps: [
            "Portion out mixed nuts into a bowl",
            "Heat water in kettle until steaming",
            "Steep green tea for 3-4 minutes",
            "Add honey to green tea",
            "Sip tea while eating nuts slowly",
          ],
        },
      ],
    },
    {
      id: "dinner",
      title: "Dinner",
      time: "8:00 PM",
      options: [
        {
          key: "A",
          name: "Baked Salmon + Stir-fried Vegetables",
          cal: "460 kcal",
          macros: "P38g  C32g  F18g",
          rec: true,
          ingredients: [
            ["Salmon fillet", "150g"],
            ["Broccoli", "100g"],
            ["Bell pepper", "80g"],
            ["Quinoa", "50g"],
          ],
          steps: [
            "Marinate salmon with herbs",
            "Bake at 200°C for 15 min",
            "Stir-fry vegetables",
            "Serve with quinoa",
          ],
        },
        {
          key: "B",
          name: "Moong dal soup + Brown bread 2 + Salad",
          cal: "380 kcal",
          note: "Light, easy before sleep",
          ingredients: [
            ["Moong dal", "60g"],
            ["Spinach", "50g"],
            ["Carrot", "50g"],
            ["Turmeric", "1/4 tsp"],
            ["Cumin", "1/4 tsp"],
            ["Garlic", "2 cloves"],
            ["Brown bread", "2 slices"],
            ["Mixed salad", "100g"],
          ],
          steps: [
            "Boil moong dal until completely soft",
            "Blend dal with spinach and carrot",
            "Heat and add spices (turmeric, cumin)",
            "Add minced garlic and simmer 3 min",
            "Toast brown bread until crispy",
            "Serve hot soup with bread and fresh salad",
          ],
        },
        {
          key: "C",
          name: "Tofu stir-fry + Small rice",
          cal: "400 kcal",
          note: "Plant-based protein",
          ingredients: [
            ["Tofu", "150g"],
            ["Brown rice", "50g"],
            ["Bell pepper", "75g"],
            ["Broccoli", "75g"],
            ["Soy sauce", "1 tbsp"],
            ["Garlic", "2 cloves"],
            ["Ginger", "1 tsp"],
            ["Sesame oil", "1 tsp"],
            ["Green onions", "10g"],
          ],
          steps: [
            "Cook brown rice in advance (15 min)",
            "Press tofu and cut into cubes",
            "Heat sesame oil in wok/pan",
            "Add garlic-ginger, then vegetables",
            "Stir-fry for 4-5 minutes",
            "Add tofu cubes and soy sauce",
            "Toss for 2 minutes, garnish with green onions",
            "Serve alongside cooked rice",
          ],
        },
      ],
    },
  ];
  return (
    <>
      <div className="pl-summary">
        {[
          { v: "1800", l: "Daily Calories", u: "kcal" },
          { v: "90", l: "Protein", u: "g" },
          { v: "220", l: "Carbs", u: "g" },
          { v: "65", l: "Fat", u: "g" },
        ].map((s, i) => (
          <div className="pl-summary-chip" key={i}>
            <strong>{s.v}</strong>
            <span>
              {s.l} ({s.u})
            </span>
          </div>
        ))}
      </div>
      <div className="pl-restrict">
        <div className="pl-restrict-col">
          <h4>Avoid</h4>
          <div className="pl-chips-wrap">
            {[
              "White rice",
              "Refined sugar",
              "Fried snacks",
              "Alcohol",
              "Soda",
            ].map((c) => (
              <span className="pl-chip-red" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="pl-restrict-col">
          <h4>Prefer</h4>
          <div className="pl-chips-wrap">
            {[
              "Quinoa",
              "Lentils",
              "Leafy greens",
              "Greek yogurt",
              "Nuts",
              "Berries",
            ].map((c) => (
              <span className="pl-chip-green" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      {meals.map((meal) => (
        <div className="pl-meal" key={meal.id}>
          <div className="pl-meal-header">
            <span className="pl-meal-time">{meal.time}</span>
            <span className="pl-meal-title">{meal.title}</span>
          </div>
          <div className="pl-opts">
            {meal.options.map((opt) => {
              const isSel = sel[meal.id] === opt.key;
              return (
                <div
                  key={opt.key}
                  className={`pl-opt${isSel ? " selected" : ""}${
                    opt.rec ? " recommended" : ""
                  }`}
                  onClick={() => pick(meal.id, opt.key)}
                >
                  {opt.rec && (
                    <div className="pl-opt-badge">
                      <StarIcon />
                      <span className="pl-rec-badge">Recommended</span>
                    </div>
                  )}
                  <div className="pl-opt-name">{opt.name}</div>
                  <div className="pl-opt-cal">{opt.cal}</div>
                  {opt.macros && (
                    <div className="pl-opt-macros">{opt.macros}</div>
                  )}
                  {opt.note && <div className="pl-opt-note">{opt.note}</div>}
                  {opt.ingredients && (
                    <div className="pl-recipe">
                      <h5>Ingredients</h5>
                      <table className="pl-ing-table">
                        <tbody>
                          {opt.ingredients.map(([n, q], j) => (
                            <tr key={j}>
                              <td>{n}</td>
                              <td>{q}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <h5>Steps</h5>
                      <ol className="pl-steps">
                        {opt.steps.map((s, j) => (
                          <li key={j}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export function ExercisePlanTab() {
  const [day, setDay] = useState(0);
  const [exSel, setExSel] = useState({
    0: "A",
    1: "A",
    2: "A",
    3: "A",
    4: "A",
    5: "A",
    6: null,
  });
  const StarIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#00a8a8"
      stroke="none"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
  const calDays = [
    { label: "Mon", num: "28" },
    { label: "Tue", num: "29" },
    { label: "Wed", num: "30" },
    { label: "Thu", num: "1" },
    { label: "Fri", num: "2" },
    { label: "Sat", num: "3" },
    { label: "Sun", num: "4" },
  ];
  const exData = [
    [
      {
        key: "A",
        name: "Morning Run",
        dur: "40 min",
        intensity: "Moderate",
        cal: "320 kcal",
        rec: true,
        details:
          "Steady-paced running to build endurance. Maintain conversational pace. Start with 5 min easy warm-up, 30 min steady run, 5 min cool-down walk.",
      },
      {
        key: "B",
        name: "Cycling",
        dur: "45 min",
        intensity: "Low",
        cal: "260 kcal",
        note: "Low impact on joints",
        details:
          "Stationary or outdoor cycling at comfortable pace. Adjust seat height to 25-35° knee bend. Great for active recovery without joint stress.",
      },
      {
        key: "C",
        name: "Walk + Yoga",
        dur: "50 min",
        intensity: "Low",
        cal: "200 kcal",
        note: "Gentle active recovery",
        details:
          "20 min easy walking followed by 30 min gentle yoga. Focus on sun salutations, forward folds, and hip openers. Perfect recovery day routine.",
      },
    ],
    [
      {
        key: "A",
        name: "Upper Body Strength",
        dur: "45 min",
        intensity: "High",
        cal: "380 kcal",
        rec: true,
        details:
          "Bench press, rows, pull-ups, shoulder press. 4 sets x 6-8 reps per exercise. Rest 60-90 sec between sets. Focus on controlled movements.",
      },
      {
        key: "B",
        name: "Resistance Bands",
        dur: "40 min",
        intensity: "Moderate",
        cal: "300 kcal",
        note: "Home-friendly workout",
        details:
          "Full upper body using bands. Chest flies, rows, shoulder raises, tricep extensions. 3 sets x 12-15 reps. Perfect for travel or home workouts.",
      },
      {
        key: "C",
        name: "Pilates",
        dur: "45 min",
        intensity: "Low",
        cal: "220 kcal",
        note: "Core strength focus",
        details:
          "Controlled core-focused movements. Includes planks, leg lifts, bird dogs, bridges. Builds stability and prevents lower back pain.",
      },
    ],
    [
      {
        key: "A",
        name: "Yoga Flow",
        dur: "30 min",
        intensity: "Low",
        cal: "140 kcal",
        rec: true,
        details:
          "Dynamic yoga sequence with focus on flexibility and breathing. Sun salutations, warrior poses, and stretching. Great for recovery between intense sessions.",
      },
      {
        key: "B",
        name: "Foam Roll + Stretch",
        dur: "20 min",
        intensity: "Low",
        cal: "80 kcal",
        note: "Muscle recovery",
        details:
          "Self-myofascial release using foam roller (60-90 sec per muscle group). Follow with 5 min static stretching. Releases muscle tension and improves mobility.",
      },
      {
        key: "C",
        name: "Complete Rest",
        dur: "-",
        intensity: "Low",
        cal: "0 kcal",
        note: "Full body recovery",
        details:
          "Total rest day. Focus on hydration, good nutrition, and sleep. Light walking is okay if desired. Allows muscles to repair and adapt to training.",
      },
    ],
    [
      {
        key: "A",
        name: "HIIT Circuit",
        dur: "30 min",
        intensity: "High",
        cal: "420 kcal",
        rec: true,
        details:
          "High-intensity interval training: 40 sec work / 20 sec rest. Exercises: burpees, mountain climbers, jump squats, push-ups. 6 rounds total. Maximum calorie burn!",
      },
      {
        key: "B",
        name: "Functional Training",
        dur: "40 min",
        intensity: "Moderate",
        cal: "340 kcal",
        note: "Full body activation",
        details:
          "Compound movements using dumbbells: deadlifts, thrusters, kettlebell swings, box jumps. 5 sets x 5 reps. Builds functional strength and power.",
      },
      {
        key: "C",
        name: "Jump Rope + Core",
        dur: "35 min",
        intensity: "Moderate",
        cal: "300 kcal",
        note: "Cardio and core combo",
        details:
          "10 min jump rope intervals + 25 min core work. Includes planks, leg raises, Russian twists, Ab wheel. Improves coordination and core strength.",
      },
    ],
    [
      {
        key: "A",
        name: "Lower Body Strength",
        dur: "45 min",
        intensity: "High",
        cal: "360 kcal",
        rec: true,
        details:
          "Squats, deadlifts, leg press, lunges. 4 sets x 6-8 reps. Focus on form and progressive overload. Rest 90-120 sec between sets.",
      },
      {
        key: "B",
        name: "Swimming",
        dur: "40 min",
        intensity: "Moderate",
        cal: "320 kcal",
        note: "Full body, low impact",
        details:
          "Full-body cardio workout. Mix freestyle, backstroke, breaststroke. 400m warm-up, 6x200m main set, 200m cool-down. Zero joint impact!",
      },
      {
        key: "C",
        name: "Dance / Zumba",
        dur: "45 min",
        intensity: "Moderate",
        cal: "280 kcal",
        note: "Fun cardio session",
        details:
          "High-energy dance workout combining cardio and coordination. Great for mental health, social connection, and burning calories while having fun!",
      },
    ],
    [
      {
        key: "A",
        name: "Long Run",
        dur: "60 min",
        intensity: "Moderate",
        cal: "480 kcal",
        rec: true,
        details:
          "Build aerobic base with steady 60-minute run. Target 60-70% max heart rate. Take walk breaks if needed. Great for endurance and mental clarity.",
      },
      {
        key: "B",
        name: "Group Sports",
        dur: "60 min",
        intensity: "High",
        cal: "500 kcal",
        note: "Social and competitive",
        details:
          "Basketball, tennis, badminton, or football. Fun competitive outlet that builds agility, coordination, and social connections while burning calories.",
      },
      {
        key: "C",
        name: "Trek / Long Walk",
        dur: "90 min",
        intensity: "Low",
        cal: "350 kcal",
        note: "Nature and endurance",
        details:
          "Low-intensity outdoor hiking or brisk walking. Enjoy nature, scenic views, and fresh air. Great for active recovery and mental wellness.",
      },
    ],
    null,
  ];
  const intCls = (i) =>
    i === "High" ? "lvl-high" : i === "Moderate" ? "lvl-moderate" : "lvl-low";
  return (
    <>
      <div className="pl-summary">
        {[
          { v: "5", l: "Sessions", u: "/week" },
          { v: "45", l: "Avg Duration", u: "min" },
          { v: "~1800", l: "Weekly Burn", u: "kcal" },
        ].map((s, i) => (
          <div className="pl-summary-chip" key={i}>
            <strong>{s.v}</strong>
            <span>
              {s.l} ({s.u})
            </span>
          </div>
        ))}
      </div>
      <div className="pl-cal-row">
        {calDays.map((d, i) => (
          <div
            key={i}
            className={`pl-cal-day${day === i ? " active" : ""}`}
            onClick={() => setDay(i)}
          >
            <span className="pl-cal-label">{d.label}</span>
            <span className="pl-cal-num">{d.num}</span>
          </div>
        ))}
      </div>
      {day === 6 ? (
        <div className="pl-rest-card">
          <div className="pl-rest-title">Rest Day</div>
          <div className="pl-rest-text">
            Recovery and hydration. Light stretching if desired. Focus on sleep
            quality.
          </div>
        </div>
      ) : (
        <div className="pl-ex-opts">
          {exData[day].map((opt) => {
            const isSel = exSel[day] === opt.key;
            return (
              <div
                key={opt.key}
                className={`pl-ex-opt${isSel ? " selected" : ""}${
                  opt.rec ? " recommended" : ""
                }`}
                onClick={() => setExSel((p) => ({ ...p, [day]: opt.key }))}
                style={{ position: "relative" }}
              >
                {opt.rec && (
                  <div className="pl-opt-badge">
                    <StarIcon />
                    <span className="pl-rec-badge">Recommended</span>
                  </div>
                )}
                <div className="pl-ex-name">{opt.name}</div>
                <div className="pl-ex-meta">
                  <span className="pl-ex-chip">{opt.dur}</span>
                  <span className={`lvl ${intCls(opt.intensity)}`}>
                    {opt.intensity}
                  </span>
                  <span className="pl-ex-chip">{opt.cal}</span>
                </div>
                {opt.note && <div className="pl-ex-note">{opt.note}</div>}
                {opt.details && (
                  <div className="pl-ex-details">{opt.details}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
