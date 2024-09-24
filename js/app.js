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

// Local Storage Class
class Storage {
  static getCalorielimit(defaultLimit = 2000) {
    let calorieLimit

    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit
    } else {
      calorieLimit = localStorage.getItem('calorieLimit')
    }
    return calorieLimit
  }

  static setCalorielimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit)
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories

    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories
    } else {
      totalCalories = parseFloat(localStorage.getItem('totalCalories'))
    }
    return totalCalories
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories)
  }

  // Meals
  static getMeals() {
    let meals

    if (localStorage.getItem('meals') === null) {
      meals = []
    } else {
      meals = JSON.parse(localStorage.getItem('meals'))
    }
    return meals
  }
  static saveMeals(meal) {
    const meals = Storage.getMeals()
    meals.push(meal)
    localStorage.setItem('meals', JSON.stringify(meals))
  }

  static removeMeal(id) {
    const meals = Storage.getMeals()
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1)
      }
    })
    localStorage.setItem('meals', JSON.stringify(meals))
  }

  // Workouts
  static getWorkouts() {
    let workouts

    if (localStorage.getItem('workouts') === null) {
      workouts = []
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'))
    }
    return workouts
  }
  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts()

    workouts.push(workout)
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts()
    workouts.forEach((meal, index) => {
      if (meal.id === id) {
        workouts.splice(index, 1)
      }
    })
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }
}
// App Class
class App {
  constructor() {
    this._tracker = new CalorieTracker()

    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'))

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'))

    document
      .getElementById('meal-items')
      .addEventListener('click', this._deleteItem.bind(this, 'meal'))

    document
      .getElementById('workout-items')
      .addEventListener('click', this._deleteItem.bind(this, 'workout'))

    document
      .getElementById('filter-meals')
      .addEventListener('input', this._filter.bind(this, 'meal'))

    document
      .getElementById('filter-workouts')
      .addEventListener('input', this._filter.bind(this, 'workout'))

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this))

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this))

    this._tracker.loadItems()
  }

  _deleteItem(type, e) {
    if (e.target.classList.contains('delete') || e.target.closest('.delete')) {
      if (confirm('Are you sure you want to delete this item?')) {
        const cardEl = e.target.closest('.card')
        const id = cardEl.getAttribute('id')

        type === 'meal'
          ? this._tracker.deleteMeal(id)
          : this._tracker.deleteWorkout(id)

        cardEl.remove()
        // console.log(id)
      }
    }
  }

  _newItem(type, e) {
    e.preventDefault()

    const name = document.getElementById(`${type}-name`)
    const calories = document.getElementById(`${type}-calories`)

    if (!name.value || !calories.value) {
      alert('Please fill in all fields')
      return
    }

    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value)
      // console.log(meal)
      this._tracker.addMeal(meal)
    }
    if (type === 'workout') {
      const wotkout = new Workout(name.value, +calories.value)

      this._tracker.addWorkout(wotkout)
    }

    name.value = ''
    calories.value = ''

    const collapseItem = document.getElementById(`collapse-${type}`)
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    })
  }

  _filter(type, e) {
    e.preventDefault()
    const filterInput = e.target.value.toLowerCase()
    const items = document.querySelectorAll(`#${type}-items .card`)
    console.log(items)
    console.log(this._tracker._meals)
    type === 'meal'
      ? this._tracker._meals.forEach((meal, index) => {
          if (meal.name.toLowerCase().includes(filterInput)) {
            items[index].classList.remove('d-none')
          } else {
            items[index].classList.add('d-none')
          }
        })
      : this._tracker._workouts.forEach((workout, index) => {
          if (workout.name.toLowerCase().includes(filterInput)) {
            items[index].classList.remove('d-none')
          } else {
            items[index].classList.add('d-none')
          }
        })
  }

  _reset() {
    const mealItems = document.getElementById('meal-items')
    const workoutItems = document.getElementById('workout-items')
    if (mealItems || workoutItems) {
      mealItems.innerHTML = ''
      workoutItems.innerHTML = ''
    }
    this._tracker.reset()
  }
  _setLimit(e) {
    e.preventDefault()
    const limitInput = document.getElementById('limit')
    const calorieLimitEl = document.getElementById('calories-limit')
    const limitValue = Number(limitInput.value)

    if (limitValue === 0 || isNaN(limitValue)) {
      alert('Please enter a valid calorie limit')

      const modalButton = document.querySelector('[data-bs-dismiss="modal"]')
      modalButton.style.cursor = 'not-allowed'
      modalButton.setAttribute('disabled', 'disabled')
      limitInput.value = ''

      return
    } else {
      const modalButton = document.querySelector('[data-bs-dismiss="modal"]')
      modalButton.style.cursor = 'pointer'
      modalButton.removeAttribute('disabled')

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('limit-modal')
      )
      modal.hide()

      this._calorieLimit = +limitValue
      this._tracker.setLimit(+limitValue)
      calorieLimitEl.textContent = +limitInput.value

      alert(`Calorie limit set to ${limitValue}`)

      limitInput.value = ''
    }
  }
}

const app = new App()
