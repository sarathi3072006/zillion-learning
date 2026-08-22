// ==================== IMPORT MODULES ====================
import config from "./config.js";
import { showLoadingAnimation, hideLoadingAnimation, showModal, initializeScrollReveal } from "./ui.js";
//==================== SHOW/HIDE LOGIN/SIGNUP FORM ====================
export function initializeLoginPage() {
    toggleLoginForm();
    initializeHandleLoginForm();
    initializeHandleSignupForm();
}
//==================== SHOW/HIDE LOGIN/SIGNUP FORM ====================
function toggleLoginForm() {
    const signupFormbtn = document.getElementById("showSignUpFormbtn");
    const signupSection = document.getElementById("signupSection");
    const loginSection = document.getElementById("loginSection");
    const backToLoginBtn = document.getElementById("backToLoginBtn");
    if (!signupFormbtn || !signupSection || !loginSection) return;
    signupFormbtn.addEventListener("click", showSignupSection);
    backToLoginBtn.addEventListener("click", showLoginSection);
}
function showLoginSection() {
    const signupSection = document.getElementById("signupSection");
    const loginSection = document.getElementById("loginSection");
    const backToLoginBtn = document.getElementById("backToLoginBtn");
    if (!signupSection || !loginSection) return;
    backToLoginBtn.addEventListener("click", function () {
        loginSection.classList.remove("hidden");
        signupSection.classList.add("hidden");
    });
}
function showSignupSection() {
    const signupSection = document.getElementById("signupSection");
    const loginSection = document.getElementById("loginSection");
    const signupFormbtn = document.getElementById("showSignUpFormbtn");
    if (!signupSection || !loginSection) return;
    signupFormbtn.addEventListener("click", function () {
        loginSection.classList.add("hidden");
        signupSection.classList.remove("hidden");
    });
}
//==================== INITIALIZE LOGIN FORM ====================
function initializeHandleLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;
    loginForm.addEventListener("submit", handleLoginForm);
}
//==================== HANDLE LOGIN FORM ====================
async function handleLoginForm(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const signinbtn = e.submitter;
    if (!email || !password) {
        showModal('Please enter your email and password.', 'danger');
        return;
    }
    showLoadingAnimation(signinbtn, 'Signing in...');
    try {
        const response = await fetch(`${config.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || 'Failed to login.', 'danger');
            return;
        }
        console.log(data);
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
        showModal('Login successful!', 'success');
    } catch (error) {
        console.error(error);
        showModal('Unable to connect to the server.', 'danger');
    } finally {
        hideLoadingAnimation(signinbtn);
    }
}
//==================== INITIALIZE SIGNUP FORM ====================
function initializeHandleSignupForm() {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;
    signupForm.addEventListener("submit", handleSignupForm);
}
//==================== HANDLE SIGNUP FORM ====================
async function handleSignupForm(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!name || !email || !password || !confirmPassword) {
        showModal('Please fill in all the required fields.', 'danger');
        return;
    } else if (password !== confirmPassword) {
        showModal('Passwords do not match.', 'danger');
        return;
    }
    try {
        const response = await fetch(`${config.API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        const data = await response.json();
        if (!response.ok) {
            showModal(data.error || 'Failed to signup.', 'danger');
            return;
        }
        console.log(data);
        showModal('Signup successful!', 'success');
    } catch (error) {
        console.error(error);
        showModal('Unable to connect to the server.', 'danger');
    }
}