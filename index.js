document.getElementById("button-create").addEventListener("click", handleCreateShortURL);
document.getElementById("button-delete").addEventListener("click", handleDeleteURL);

let listLength = 0;

function handleCreateShortURL() {
    // 1. Check validity of given URL. Show error text if invalid
    const givenUrl = document.getElementById("input-url").value.trim();
    if (!isUrlValid(givenUrl)) {
        return; // Do not proceed if URL is invalid
    }

    // 2. Create short URL
    let randomString = Math.random().toString(36).substring(2, 7);

    // 3. Append to list of URLs

    // 3a. Create new list item
    const listItem = document.createElement("li");
    listItem.setAttribute("data-clickcount", 0);

    // 3b. Create link and add to list item
    const link = document.createElement("a");
    link.setAttribute("href", givenUrl);
    link.setAttribute("target", "_blank");
    link.innerText = `localhost/${randomString}`;
    listItem.insertAdjacentElement("afterbegin", link);

    // 3c. Add original URL to list item
    listItem.insertAdjacentText("beforeend", ` - ${givenUrl} - `);

    // 3d. Add click counter to list item
    const clickCounter = document.createElement("span");
    listItem.insertAdjacentElement("beforeend", clickCounter);
    clickCounter.innerText = `Clicks: 0 `;
    link.addEventListener("click", function () {
        let newClickCount = (parseInt(listItem.dataset.clickcount) + 1).toString();
        listItem.setAttribute("data-clickcount", newClickCount);
        clickCounter.innerText = `Clicks: ${newClickCount} `;
    });

    // 3e. Add Edit button to list item
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    listItem.insertAdjacentElement("beforeend", editButton);
    const editUrlInput = document.createElement("input");
    editUrlInput.setAttribute("value", link.innerText.substring(10));
    editButton.addEventListener("click", function () {
        if (editButton.innerText === 'Edit') {
            editButton.innerText = "Save"
            link.replaceWith(editUrlInput);
        } else if (editButton.innerText === 'Save') {
            link.innerText = `localhost/${editUrlInput.value}`;
            editUrlInput.replaceWith(link);
            editButton.innerText = 'Edit';
        }
    })
    // 3f. Add list item to list
    document.getElementById("list-url").appendChild(listItem);
}

function handleDeleteURL() {
    const input = document.getElementById("input-url").value.trim();
    // 1. If no user input, remove all items in ordered list
    if (!input) {
        document.getElementById("list-url").innerHTML = '';
        // 2. If input matches any short or original URL, delete them
    } else {
        const listItems = document.querySelectorAll("li");
        listItems.forEach((item) => {
            if (item.innerText.includes(input)) {
                item.remove();
            }
        })
    }
}


function isUrlValid(givenUrl) {
    const validUrlRegex = /^(https?:\/\/)?([\d\w-])+\.([a-z])+(\/[\d\w/-_?]*)?/i;

    // URL is valid
    if (validUrlRegex.test(givenUrl)) {
        document.getElementById("error-invalid-url")?.remove();
        return true;
        // URL is invalid
    } else {
        if (!document.getElementById("error-invalid-url")) {
            const errorText = document.createElement("p");
            errorText.id = "error-invalid-url";
            errorText.innerText = "Please enter a valid url";
            document.getElementById("list-url").after(errorText);
        }
        return false;
    }
}