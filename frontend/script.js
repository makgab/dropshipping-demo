// frontend/script.js

// --- Firebase config ---
const firebaseConfig = {
    apiKey: "AIzaSyBuG-RLh2Gs_0STwUC4010FpAyi1l9Hnio",
    authDomain: "dropshipping-demo.firebaseapp.com",
    projectId: "dropshipping-demo",
    storageBucket: "dropshipping-demo.firebasestorage.app",
    messagingSenderId: "472931103864",
    appId: "1:472931103864:web:c4cf49d721929474c8698d"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let currentToken = null;

// LOGIN
document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentToken = await userCredential.user.getIdToken();

        document.getElementById("loginStatus").innerText = "Logged in";
        document.getElementById("calcBtn").disabled = false;

    } catch (err) {
        document.getElementById("loginStatus").innerText = "Login failed: " + err.message;
    }
};

// LOGOUT
document.getElementById("logoutBtn").onclick = async () => {
    await auth.signOut();
    currentToken = null;

    document.getElementById("loginStatus").innerText = "Logged out";
    document.getElementById("calcBtn").disabled = true;
};

// CALCULATE
document.getElementById("calcBtn").onclick = async () => {

    if (!currentToken) {
        alert("Login first");
        return;
    }

    const data = {
        price: Number(document.getElementById("purchase_price").value),
        shipping: Number(document.getElementById("shipping_cost").value),
        import_vat: Number(document.getElementById("import_vat").value),
        fee: Number(document.getElementById("marketplace_fee").value),
        sales_price: Number(document.getElementById("sale_price").value)
    };

    try {
        const response = await fetch("/api/v1/calculate_profit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentToken
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const txt = await response.text();
            throw new Error(txt);
        }

        const result = await response.json();

        document.getElementById("result").textContent =
            `Profit: ${result.profit}
Margin: ${result.margin_percent.toFixed(2)}%`;

    } catch (err) {
        document.getElementById("result").textContent = "ERROR: " + err.message;
    }
};
