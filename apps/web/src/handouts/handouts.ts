import { marked } from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-dark.css"

document.addEventListener("DOMContentLoaded", async() => {

    const title = document.getElementById("handout-title") as HTMLElement
    const handout = document.getElementById("handout-content") as HTMLElement

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
