import { UserOptions, ResolvedOptions } from "./types";

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
    const {
        routesDir = [{ dir: "src/pages", baseRoute: "" }],
        extensions = ["tsx"],
        exclude = [/components/],
        hash = false
    } = userOptions;

    return Object.assign({}, userOptions, { routesDir, extensions, exclude, hash });
}
