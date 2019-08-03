import { sessionIdFrom } from "./index";

it("handles old selenium protocol versions", () => {
    expect(
        sessionIdFrom({
            response: {
                sessionId: "session-1",
            },
        })
    ).toBe("session-1");
});

it("handles new selenium protocol versions", () => {
    expect(
        sessionIdFrom({
            response: {
                value: {
                    sessionId: "session-2",
                },
            },
        })
    ).toBe("session-2");
});

it("handles wrong response as empty", () => {
    expect(
        sessionIdFrom({
            response: {},
        })
    ).toBe("");
});
