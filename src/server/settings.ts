import * as DevSettings from "../../devenv-settings";

export const renderSettings = {
    useExternalStyles: !DevSettings.isDevelopment,
    scriptRoot: DevSettings.isDevelopment ? DevSettings.clientDevScriptPath : ""
};
