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

// UI helpers
function showApp(user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    document.getElementById("userEmail").innerText = "Logged in as: " + user.email;
}

function showLogin() {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
}

// 🔥 AUTO LOGIN (legfontosabb)
auth.onAuthStateChanged(async (user) => {
    console.log("Auth state:", user);
    console.log("LOGIN SUCCESS");
    if (user) {
        currentToken = await user.getIdToken();
        showApp(user);
    } else {
        currentToken = null;
        showLogin();
    }
});

// 🔐 EMAIL LOGIN
document.getElementById("loginBtn").onclick = async () => {
    const email = emailInput();
    const password = passwordInput();

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);

        currentToken = await userCredential.user.getIdToken();

        showApp(userCredential.user); // showApp

    } catch (err) {
        alert(err.message);
    }
};

// 🆕 REGISTER
document.getElementById("registerBtn").onclick = async () => {
    const email = emailInput();
    const password = passwordInput();

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        currentToken = await userCredential.user.getIdToken();

        showApp(userCredential.user); // showApp

    } catch (err) {
        alert(err.message);
    }
};

// 🔵 GOOGLE LOGIN
document.getElementById("googleBtn").onclick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);

        currentToken = await result.user.getIdToken();

        showApp(result.user);

    } catch (err) {
        alert(err.message);
    }
};

// 🚪 LOGOUT
document.getElementById("logoutBtn").onclick = async () => {
    await auth.signOut();
        currentToken = null;
        showLogin(); 
};

// 📊 CALCULATE
document.getElementById("calcBtn").onclick = async () => {

    if (!currentToken) {
        alert("Login first");
        return;
    }

    const data = {
        price: num("purchase_price"),
        shipping: num("shipping_cost"),
        import_vat: num("import_vat"),
        fee: num("marketplace_fee"),
        sales_price: num("sale_price")
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
            throw new Error(await response.text());
        }

        const result = await response.json();

        document.getElementById("result").textContent =
`Profit: ${result.profit}
Margin: ${result.margin_percent.toFixed(2)}%`;

    } catch (err) {
        document.getElementById("result").textContent = "ERROR: " + err.message;
    }
};

// load history
document.getElementById("loadBtn").onclick = async () => {

    if (!currentToken) {
        alert("Login first");
        return;
    }

    try {
        
        const response = await fetch("/api/v1/my_calculations", {
            headers: {
                "Authorization": "Bearer " + currentToken
            }
        });

        // 🔥 NEM json() azonnal!
        const text = await response.text();

        console.log("RAW RESPONSE:", text); // 🔥 EZ A LÉNYEG

        if (!response.ok) {
            throw new Error(text);
        }

        // csak ha már tudjuk, hogy JSON
        const data = JSON.parse(text);

        const list = document.getElementById("history");
        list.innerHTML = "";

        data.forEach(item => {
            const li = document.createElement("li");

            li.textContent =
                `Profit: ${item.profit} | Margin: ${item.margin_percent.toFixed(2)}%`;

            list.appendChild(li);
        });

    } catch (err) {
        alert(err.message);
    }
};

// helpers
function num(id) {
    return Number(document.getElementById(id).value);
}

function emailInput() {
    return document.getElementById("email").value;
}

function passwordInput() {
    return document.getElementById("password").value;
}
