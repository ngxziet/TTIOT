// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyABu3mFJK_PyPppTymzGoPdcRkor7INs0M",
    authDomain: "iot-web-bf6e9.firebaseapp.com",
    databaseURL: "https://iot-web-bf6e9-default-rtdb.firebaseio.com",
    projectId: "iot-web-bf6e9",
    storageBucket: "iot-web-bf6e9.appspot.com",
    messagingSenderId: "633701788549",
    appId: "1:633701788549:web:4a4ea9bda7fe94eaf6f2ec",
    measurementId: "G-8326W7L64W"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Hàm cập nhật giá trị lên Firebase
function updateFirebaseValue(cardId, value) {
    database.ref(`/kiemtra/${cardId}`).set(value);
}

// Lắng nghe sự kiện thay đổi từ Firebase
function listenForUpdates(cardId, elementId) {
    database.ref(`/kiemtra/${cardId}`).on("value", (snapshot) => {
        if (snapshot.exists()) {
            document.getElementById(elementId).innerText = snapshot.val();
        }
    });
}

// Ánh xạ các phần tử trong giao diện với Firebase
const cards = [
    { id: "number1", firebaseKey: "number1" },
    { id: "number2", firebaseKey: "number2" },
    { id: "number3", firebaseKey: "number3" },
    { id: "number4", firebaseKey: "number4" },
    { id: "number5", firebaseKey: "number5" }
];

// Cập nhật Firebase khi giao diện thay đổi
cards.forEach(card => {
    const element = document.getElementById(card.id);
    if (element) {
        // Lắng nghe sự thay đổi giá trị trên Firebase
        listenForUpdates(card.firebaseKey, card.id);

        // Cập nhật Firebase khi giá trị thay đổi
        element.addEventListener("click", () => {
            const newValue = prompt(`Nhập giá trị mới cho ${card.id}:`, element.innerText);
            if (newValue !== null) {
                element.innerText = newValue;
                updateFirebaseValue(card.firebaseKey, newValue);
            }
        });
    }
});



// Cập nhật vòng tròn khi `number1` thay đổi
// Hàm cập nhật vòng tròn SVG
function updateProgressCircle(element, value) {
    const maxValue = 150; // Giá trị tối đa (có thể thay đổi)
    const percentage = Math.min(value / maxValue, 1); // Giới hạn 100%
    const offset = 157 - (157 * percentage); // Tính toán độ dài của tiến trình
    element.style.strokeDashoffset = offset;
}

// Lặp qua tất cả number1 → number5 để cập nhật Firebase và vòng tròn
for (let i = 1; i <= 5; i++) {
    database.ref(`/kiemtra/number${i}`).on("value", (snapshot) => {
        if (snapshot.exists()) {
            const newValue = snapshot.val();
            document.getElementById(`number${i}`).innerText = newValue;

            // Cập nhật vòng tròn tương ứng
            const progressElement = document.querySelector(`#progress${i}`);
            updateProgressCircle(progressElement, newValue);
        }
    });
}


// Lặp qua tất cả các card và cập nhật vòng tròn
document.querySelectorAll(".card").forEach(card => {
    const numberElement = card.querySelector(".number");
    const progressElement = card.querySelector(".progress");

    if (numberElement && progressElement) {
        const value = parseInt(numberElement.innerText);
        updateProgressCircle(progressElement, value);
    }
});
