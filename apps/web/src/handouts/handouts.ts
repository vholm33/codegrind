// 1. fetch mot api (om har route) --> name & handout

// 2. rendera beroende på klickad kategori från sidebaren
document.addEventListener("DOMContentLoaded", async() => {

    const handout = document.getElementById("handout") as HTMLElement

    const params = new URLSearchParams(window.location.search)
    const selectedCategory = params.get("category")

    const response = await fetch("http://localhost:3000/api/categories/get")
    const json = await response.json()

    const categories = json.data
    const category = categories.find((c: any) => c.name === selectedCategory)

    if (category) {
        handout.innerHTML = `<h2>${category.name}</h2> <p>${category.handout}</p>`
    }
    console.log('category from url', selectedCategory)
})
   
