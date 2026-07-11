
# this file is for personal information about components, mathods and more

### document VS window
window = the browser tab/window itself
document = the HTML page inside that window

### beforeunload
"beforeunload" - it means do something right before the user leaves the page!!!
window.addEventListener("beforeunload", function () {
    // CODE //
});

window controls things like:

- URL navigation
- browser size
- alerts
- timers
- storage
- page events

document represents the HTML page.
- It lets JavaScript:
- find elements
- change text
- change styles
- create elements
- remove elements