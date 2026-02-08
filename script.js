// DOM ELEMENTS
const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");
const saveBtn = document.getElementById("save-btn");
const savedPalettesContainer = document.getElementById("saved-palettes");

generateBtn.addEventListener("click", generatePalette);
saveBtn.addEventListener("click", savePalette);
document.addEventListener("click", (e) => {
    // find the closest copy button/icon in case the user clicks an inner <i> or child element
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
        const hexElement = copyBtn.previousElementSibling;
        const hexValue = hexElement ? hexElement.textContent : "";

        navigator.clipboard.writeText(hexValue)
        .then(() => {
            // prefer the icon element if present, otherwise use the button itself
            const icon = copyBtn.querySelector("i") || copyBtn;
            showCopySuccess(icon);
        })
        .catch((err) => console.log(err));
        return;
    }

    const colorEl = e.target.closest(".color");
    if (colorEl) {
        const details = colorEl.nextElementSibling;
        const hexEl = details ? details.querySelector(".hex-value") : null;
        const hexValue = hexEl ? hexEl.textContent : "";

        navigator.clipboard.writeText(hexValue)
        .then(() => {
            const copyBtnEl = details ? details.querySelector(".copy-btn") : null;
            const icon = copyBtnEl ? (copyBtnEl.querySelector("i") || copyBtnEl) : null;
            if (icon) showCopySuccess(icon);
        })
        .catch((err) => console.log(err));
    }
})

function showCopySuccess(element){
    const hexValue = element.previousElementSibling;
    if (!element) return;
    element.classList.remove("far", "fa-copy");
    element.classList.add("fa-solid", "fa-check");
    
    element.style.color = "#48bb78";
    
    // keep the check visible for 1.5s before reverting
    setTimeout(() => {
        element.classList.remove("fa-solid", "fa-check");
        element.classList.add("far", "fa-copy");
        
        element.style.color = "#111F35";
    }, 1500);
    alert("Hex value copied to clipboard: " + hexValue.textContent);
}

function generatePalette() {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
    }

    updatePaletteDisplay(colors);
}

function generateRandomColor(){
    const letters = "0123456789ABCDEF";
    let color = "#";

    for(let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)]; // generate number from 0 - 15
    }

    return color;
}

function updatePaletteDisplay(colors){
    const colorBoxes = paletteContainer.querySelectorAll(".color-box") // previously document.querySelectorAll(".color-box") but this way it only looks for color boxes within the palette container, which is more efficient and prevents potential issues if there are other elements with the same class elsewhere in the document

    colorBoxes.forEach((box, index) => {
        const color = colors[index];
        const colorDiv = box.querySelector(".color");
        const hexValue = box.querySelector(".hex-value");

        colorDiv.style.backgroundColor = color;
        hexValue.textContent = color;
    })
}

function savePalette(){
    const clonedPalette = paletteContainer.cloneNode(true);
    const deleteBtn = document.createElement("i");
    deleteBtn.classList.add("far", "fa-trash-can", "delete-btn");
    clonedPalette.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
        clonedPalette.remove();
    })

    // Delete button styling
    deleteBtn.addEventListener("mouseover", () => {
        deleteBtn.style.color = "#e53e3e";
    })
    deleteBtn.addEventListener("mouseout", () => {
        deleteBtn.style.color = "#111F35";
    })
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.color = "#111F35";

    savedPalettesContainer.appendChild(clonedPalette);

    clonedPalette.style.marginBottom = "20px"; 
    
}

// generatePalette() // if you want to generate a new color palette every time you reload or visit, remove to have the default