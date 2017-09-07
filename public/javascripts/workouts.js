var workouts = document.querySelectorAll(".workout");
workouts.forEach(workout => {
	workout.querySelector("header").addEventListener("click", e => {
		workout.querySelector("div").classList.toggle("collapsed")
	})
})