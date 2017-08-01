import * as React from "react";
import "./hello-world.scss";

export class HelloWorld extends React.Component<null, null> {

    public render() {
        return(
            <div className="react-hello-world">
                <h1>Hello World from React!</h1>
            </div>
        );
    }
}
