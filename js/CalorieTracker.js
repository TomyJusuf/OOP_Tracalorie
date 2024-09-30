import Storage from './Storage.js'

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorielimit()
    this._totalCalories = Storage.getTotalCalories()
    this._meals = Storage.getMeals()
    this._workouts = Storage.getWorkouts()

    this._displayCaloriesLimit()
    this._displayCalories()
    this._displayCaloriesCunsumed()
    this._displayCaloriesBurned()
    this._displayCaloriesProgress()
  }

  // PUBLIC METHODS/API
  addMeal(meal) {
    this._meals.push(meal)
    this._totalCalories += meal.calories

    Storage.updateTotalCalories(this._totalCalories)
    Storage.saveMeals(meal)
    this._displayNewItem(meal, 'meal')
    this._render()
  }

  addWorkout(workout) {
    this._workouts.push(workout)
    this._totalCalories -= workout.calories
    Storage.updateTotalCalories(this._totalCalories)
    Storage.saveWorkout(workout)
    this._displayNewItem(workout, 'workout')
    this._render()
  }
  deleteMeal(id) {
    const deletedCalorie = this._meals.find((meal) => meal.id === id)
    this._meals = this._meals.filter((meal) => meal.id !== id)
    this._totalCalories -= deletedCalorie.calories

    Storage.updateTotalCalories(this._totalCalories)
    Storage.removeMeal(id)
    this._render()
  }

  deleteWorkout(id) {
    const deletedCalorie = this._workouts.find((workout) => workout.id === id)
    this._workouts = this._workouts.filter((workout) => workout.id !== id)
    this._totalCalories += deletedCalorie.calories

    Storage.updateTotalCalories(this._totalCalories)
    Storage.removeWorkout(id)
    this._render()
  }

  setLimit(limit) {
    this._calorieLimit = limit
    Storage.setCalorielimit(limit)
    this._render()
  }
  reset() {
    this._totalCalories = 0
    this._meals = []
    this._workouts = []
    localStorage.setItem('totalCalories', 0)
    localStorage.setItem('workouts', JSON.stringify([]))
    localStorage.setItem('meals', JSON.stringify([]))
    this._render()
  }

  loadItems() {
    this._meals.forEach((meal) => {
      this._displayNewItem(meal, 'meal')
    })
    this._workouts.forEach((workout) => {
      this._displayNewItem(workout, 'workout')
    })
  }

  // PRIVATE METHODS
  _displayCalories() {
    const totalCaloriesEl = document.querySelector('#calories-total')

    totalCaloriesEl.textContent = this._totalCalories
  }
  _displayCaloriesLimit() {
    const calorieLimitEl = document.querySelector('#calories-limit')
    calorieLimitEl.textContent = this._calorieLimit
  }

  _displayCaloriesCunsumed() {
    const consumedCaloriesEl = document.querySelector('#calories-consumed')

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    )
    consumedCaloriesEl.textContent = consumed
  }

  _displayCaloriesBurned() {
    const consumedBurnedEl = document.querySelector('#calories-burned')

    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    )
    consumedBurnedEl.textContent = burned
  }

  _displayCaloriesProgress() {
    const remainingCaloriesEl = document.querySelector('#calories-remaining')
    const caloriesProgressEl = document.querySelector('#calorie-progress')
    const percentage = (this._totalCalories / this._calorieLimit) * 100
    const width = `${Math.min(percentage, 100)}%`

    remainingCaloriesEl.textContent = this._calorieLimit - this._totalCalories
    caloriesProgressEl.style.width = width

    if (percentage >= 100) {
      remainingCaloriesEl.parentElement.classList.add('bg-danger')
      caloriesProgressEl.classList.add('bg-danger')
    } else {
      remainingCaloriesEl.parentElement.classList.remove('bg-danger')

      caloriesProgressEl.classList.remove('bg-danger')
    }
  }

  _displayNewItem(data, type) {
    const { name, calories, id } = data
    const itemsEl = document.getElementById(`${type}-items`)

    const itemEl = document.createElement('div')
    itemEl.classList.add('card', 'my-2')
    itemEl.setAttribute('id', id)

    itemEl.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${name}</h4>
        <div class="fs-1 bg-${
          type === 'workout' ? 'secondary' : 'success'
        } text-white text-center rounded-2 px-2 px-sm-5">${calories}</div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>`
    itemsEl.appendChild(itemEl)
  }

  _render() {
    this._displayCalories()
    this._displayCaloriesCunsumed()
    this._displayCaloriesBurned()
    this._displayCaloriesProgress()
  }
}

export default CalorieTracker
