import { of } from "rxjs";
import { catchError, flatMap, mapTo, startWith } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { useEventCallback } from "rxjs-hooks";

export function useSessionDelete(id) {
    const [deleteSession, deleted] = useEventCallback(
        event$ =>
            event$.pipe(
                flatMap(() =>
                    ajax({
                        url: `/wd/hub/session/${id}`,
                        method: "DELETE",
                    }).pipe(
                        mapTo(true),
                        catchError(e => {
                            console.error("Can't delete session", id, e);
                            return of(false);
                        }),
                        startWith(true)
                    )
                )
            ),
        false
    );

    return [deleted, () => deleteSession(id)];
}
