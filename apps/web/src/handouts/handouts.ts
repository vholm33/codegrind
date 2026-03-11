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

        const html = await marked.parse(category.handout)

        title.textContent = category.name
        handout.innerHTML = html

        hljs.highlightAll()
    }
})
   
