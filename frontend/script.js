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

// --- Login ---
document.getElementById('loginBtn').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentToken = await userCredential.user.getIdToken();
        document.getElementById('loginStatus').innerText = "Logged in!";
        document.getElementById('calcBtn').disabled = false;
    } catch (err) {
        document.getElementById('loginStatus').innerText = "Login failed: " + err.message;
    }
};

// --- Calculate button ---
document.getElementById('calcBtn').onclick = async () => {
    if (!currentToken) {
        alert("Login first");
        return;
    }

    const data = {
        purchase_price: parseFloat(document.getElementById('purchase_price').value),
        shipping_cost: parseFloat(document.getElementById('shipping_cost').value),
        import_vat: parseFloat(document.getElementById('import_vat').value),
        marketplace_fee: parseFloat(document.getElementById('marketplace_fee').value),
        sale_price: parseFloat(document.getElementById('sale_price').value)
    };

    try {
        const response = await fetch('http://localhost:8000/calculate_profit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentToken
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        document.getElementById('result').innerText =
            `Profit: ${result.profit}, Margin: ${result.profit_margin.toFixed(2)}%`;
    } catch (err) {
        alert("Calculation failed: " + err.message);
    }
};
