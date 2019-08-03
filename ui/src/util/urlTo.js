export default function urlTo(href) {
    let lnk = document.createElement("a");
    lnk.setAttribute("href", href);
    return lnk;
}
