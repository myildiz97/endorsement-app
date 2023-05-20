import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsement-list-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsementsList")

const textarea = document.getElementById("textarea")
const btn = document.getElementById("publish-btn")
const endorsements = document.getElementById("endorsements")
const text1 = document.getElementById("text1")
const text2 = document.getElementById("text2")

btn.addEventListener("click", function() {
    let inputValue = textarea.value
    if (inputValue.length < 5) {
        alert("You must enter a message at least 5 characters long.")
    } else {
        let text1Value = text1.value
        let text2Value = text2.value
        const arr = [inputValue, text1Value, text2Value]
        push(endorsementsInDB, arr)
    }
    textarea.value = ""
    text1.value = ""
    text2.value = ""
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
        endorsements.innerHTML = "No endorsement here... yet"
    }
})

function appendItem(item) {
    let itemId = item[0]
    let itemValue = item[1]

    for (let i = 1 ; i <= 2; i++) {
        if (itemValue[i].length < 1) {
            itemValue[i] = "Unknown"
        } else {
            i === 1 ? itemValue[i] = "From " + itemValue[i] : itemValue[i] = "To " + itemValue[i]
        }
    }

    let mainDiv = document.createElement("div")
    mainDiv.className = "endorsement"
    mainDiv.innerHTML = `
        <div class="like">
            <span style="font-weight: bold">${itemValue[2]}</span>
            <button class="del-like" id="like"><img src="./heart-solid.svg"></button>
            <span id="count">${0}</span>
            <button class="del-like" id="dislike"><img src="./heart-crack-solid.svg"></button>
        </div>
        <div>${itemValue[0]}</div>
        <div class="del">
            <span style="font-weight: bold">${itemValue[1]}</span>
            <button class="del-like" id="del"><img src="./trash-solid.svg"></button>
        </div> 
    `

    function handleClickDel() {
        let exactLocationOfItemInDB = ref(database, `endorsementsList/${itemId}`)
        remove(exactLocationOfItemInDB)
    }

    mainDiv.querySelector("#del").addEventListener("click", handleClickDel)

    const spanEl = mainDiv.querySelector("#count")

    mainDiv.querySelector("#like").addEventListener("click", function() {
        const count = parseInt(spanEl.textContent)
        let increment = count + 1
        spanEl.textContent = increment
    })

    mainDiv.querySelector("#dislike").addEventListener("click", function() {
        const count = parseInt(spanEl.textContent)
        if (count > 0) {
            let decrement = count - 1
            spanEl.textContent = decrement
        }
    })

    endorsements.append(mainDiv)
}