// Meal Class
class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.calories = calories
  }
}

// Workout Class
class Workout extends Meal {
  constructor(name, calories, id) {
    super(name, calories, id)
  }
}

export { Meal, Workout }
