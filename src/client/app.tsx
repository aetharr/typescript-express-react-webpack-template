import "./app.scss"
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./js-hello-world";

function main() {
    const Routes = require("./routes").default;
    ReactDOM.render(<Routes />, document.getElementById("bootstrap"));
}

main();

if (module.hot) {
    module.hot.accept("./routes", () => {
        main();
    });
};
