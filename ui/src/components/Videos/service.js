import { of } from "rxjs";
import { catchError, flatMap, mapTo, startWith } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { useEventCallback } from "rxjs-hooks";

export function useDeleteVideo(name) {
    const [deleteVideo, value] = useEventCallback(
        event$ =>
            event$.pipe(
                flatMap(() =>
                    ajax({
                        url: `/video/${name}`,
                        method: "DELETE",
                    }).pipe(
                        mapTo(true),
                        catchError(() => of(false)),
                        startWith(true)
                    )
                )
            ),
        false
    );

    return [value, () => deleteVideo(name)];
}
