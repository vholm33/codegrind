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
        handout.innerHTML = `
        <h1 class="mb-4 text-3xl font-bold text-blue-400">${category.name}</h1> 
        <p class="text-lg leading-relaxed text-gray-300">${category.handout}</p>
        `
    }
    console.log('category from url', selectedCategory)
})
   
