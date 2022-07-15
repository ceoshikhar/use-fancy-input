const isMacOS = (): boolean => {
    const platform =
        typeof navigator === "undefined"
            ? ""
            : `${navigator.platform || ""}`.toLowerCase().trim();

    return platform.startsWith("mac");
};

export { isMacOS };
