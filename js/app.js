import '@fortawesome/fontawesome-free/js/all'
import CalorieTracker from './CalorieTracker'
import { Meal, Workout } from './Items'
import { Modal, Collapse } from 'bootstrap'

import '../css/bootstrap.css'
import '../css/style.css'
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
    const bsCollapse = new Collapse(collapseItem, {
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

      const modal = Modal.getInstance(document.getElementById('limit-modal'))
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
