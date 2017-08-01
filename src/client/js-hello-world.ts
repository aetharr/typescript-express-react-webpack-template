import "./js-hello-world.scss";

export function HelloWorld() {
    return "Hello World from JS!";
}

window.addEventListener("load", (event: Event) => {
    const mynode = document.createElement("h1");
    mynode.innerText = HelloWorld();
    mynode.className = "js-hello-world"

    document.body.appendChild(mynode);
});
