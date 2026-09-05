import config from "./config.js";

export function initializeLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}

export async function loadprofile() {
    const token = localStorage.getItem("token");
    const pfp = document.getElementById("pfp");
    const nameElement = document.getElementById("name");
    const roleElement = document.getElementById("role");
    const emailElement = document.getElementById("email");
    const adminPanelButton = document.getElementById("adminPanel");
    if (!token || !pfp || !nameElement || !emailElement) return;

    try {
        const response = await fetch(`${config.API_URL}/me`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem("token");
            return;
        }

        const user = await response.json();
        const profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=00bfff&color=ffffff&bold=true&size=80`;
        pfp.src = profilePicture;
        pfp.alt = `${user?.name || "User"}'s profile picture`;
        nameElement.textContent = user?.name || "User";
        emailElement.textContent = user?.email || "User";
        roleElement.textContent = user?.role || "User";
        if (user?.role === "admin") {  
            adminPanelButton.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error loading user:", error);
    }
}