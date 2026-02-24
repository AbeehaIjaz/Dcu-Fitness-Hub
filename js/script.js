// Workout generator + simple history // APIKEY Fetches exercise data from API Ninjas and selects a random result

const workoutBtn = document.getElementById("generateWorkoutBtn");
const workoutResult = document.getElementById("workoutResult");
const historyList = document.getElementById("historyList");

if (workoutBtn && workoutResult) {

    workoutBtn.addEventListener("click", generateWorkout);

    function generateWorkout() {

        workoutResult.innerHTML = "<p>Loading workout...</p>";

        fetch("https://api.api-ninjas.com/v1/exercises?muscle=chest", {
            headers: {
                "X-Api-Key": "pA4aXUH6iFwgBFQyx3bVkCRQmnzSdlYBEViUiR0F"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {

            if (!data || data.length === 0) {
                workoutResult.innerHTML = "<p>No exercises found. Try again.</p>";
                return;
            }

            const randomExercise =
                data[Math.floor(Math.random() * data.length)];

            workoutResult.innerHTML = `
                <h3>${randomExercise.name}</h3>
                <p><strong>Type:</strong> ${randomExercise.type}</p>
                <p>${randomExercise.instructions}</p>
            `;

            saveWorkoutToHistory(randomExercise.name);
        })
        .catch(error => {
            workoutResult.innerHTML =
                "<p>Unable to load workout. Please try again later.</p>";
            console.error("Workout fetch error:", error);
        });
    }
}


// Store last few workouts using localStorage

function saveWorkoutToHistory(workoutName) {

    let history =
        JSON.parse(localStorage.getItem("workoutHistory")) || [];

    // Remove duplicate if already exists
    history = history.filter(item => item !== workoutName);

    history.unshift(workoutName);

    // Limit to last 3
    if (history.length > 3) {
        history.pop();
    }

    localStorage.setItem("workoutHistory", JSON.stringify(history));
    displayWorkoutHistory();
}

function displayWorkoutHistory() {

    if (!historyList) return;

    historyList.innerHTML = "";

    const history =
        JSON.parse(localStorage.getItem("workoutHistory")) || [];

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

displayWorkoutHistory();


// Basic contact form validation

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name =
            document.getElementById("name")?.value.trim();
        const email =
            document.getElementById("email")?.value.trim();
        const message =
            document.getElementById("message")?.value.trim();

        const formMessage =
            document.getElementById("formMessage");

        if (!name || !email || !message) {
            formMessage.style.color = "red";
            formMessage.textContent =
                "Please fill in all required fields.";
            return;
        }

        if (!email.includes("@")) {
            formMessage.style.color = "red";
            formMessage.textContent =
                "Please enter a valid email address.";
            return;
        }

        formMessage.style.color = "limegreen";
        formMessage.textContent =
            "Form submitted successfully!";
        contactForm.reset();
    });
}


// Mobile menu toggle

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}


// FAQ accordion

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {
    question.addEventListener("click", function () {

        const answer = this.nextElementSibling;

        document.querySelectorAll(".faq-answer")
            .forEach(item => {
                if (item !== answer) {
                    item.style.display = "none";
                }
            });

        answer.style.display =
            answer.style.display === "block"
                ? "none"
                : "block";
    });
});


// Animated counter when stats scroll into view

const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector(".stats-section");

let counterStarted = false;

function startCounter() {

    if (counterStarted) return;
    counterStarted = true;

    counters.forEach(counter => {

        counter.innerText = "0";

        const target =
            +counter.getAttribute("data-target");

        const increment = target / 100;

        function updateCounter() {
            const current = +counter.innerText;

            if (current < target) {
                counter.innerText =
                    Math.ceil(current + increment);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target + "+";
            }
        }

        updateCounter();
    });
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter();
        }
    });
}, { threshold: 0.4 });

if (statsSection) {
    observer.observe(statsSection);
}


// Scroll reveal effect

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    reveals.forEach(reveal => {

        const elementTop =
            reveal.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            reveal.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// Membership auto-fill (from pricing page)

const joinButtons = document.querySelectorAll(".join-btn");

joinButtons.forEach(button => {
    button.addEventListener("click", function () {
        const selectedPlan =
            this.getAttribute("data-plan");
        localStorage.setItem("selectedPlan", selectedPlan);
    });
});

const reasonSelect = document.getElementById("reason");

if (localStorage.getItem("selectedPlan")) {

    const savedPlan =
        localStorage.getItem("selectedPlan");

    if (reasonSelect) {
        reasonSelect.value = "Membership Enquiry";
    }

    const messageField =
        document.getElementById("message");

    if (messageField) {
        messageField.value =
            "I'm interested in the " +
            savedPlan +
            " plan.";
    }

    localStorage.removeItem("selectedPlan");
}