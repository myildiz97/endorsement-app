import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-ac22f-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementsList")

const textarea = document.getElementById("textarea")
const btn = document.getElementById("publish-btn")
const endorsements = document.getElementById("endorsements")

textarea.style.color = "#000000";

btn.addEventListener("click", function() {
    let inputValue = textarea.value
    push(endorsementsInDB, inputValue)
    textarea.value = ""
})

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        endorsements.innerHTML = ""
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItem(currentItem)
        }  

    } else {
        endorsements.innerHTML = "No endorsements here... yet"
    }
})

function appendItem(item) {
    let itemId = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("div")
    newEl.textContent = itemValue
    newEl.className = "endorsement"

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemId}`)
        remove(exactLocationOfItemInDB)
    })

    endorsements.append(newEl)
}