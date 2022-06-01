function nothingToShowInProfileTweetsTitles(subTitle) {
    return {
        title: "NOTHING TO SHOW",
        subTitle: subTitle
    }
}

const nothingToShowInSearchTitles = {
    title: "NOTHING TO SHOW",
    subTitle: "Try searching for something else, or revise the search parameters."
}

const endReachedTitles = {
    title: "REACHED THE END",
    subTitle: "Try scrolling up, or reload to fetch latest content."
}

function getContentEmptyPlaceholder(c) {
    return `
        <div style="margin: 200px 0; text-align: center;">
            <div style="display: inline-block;">
                <img style="width: 180px; height: 180px;" src="images/nothing-vadivel.png">
            </div>
            <div style="font-size: 22px; font-weight: 900;">` + c.title.toUpperCase() + `</div>
            <div style="font-size: 16px; font-weight: 500; color: rgb(110, 110, 110); white-space: pre;">` + c.subTitle + `</div>
        </div>
    `;
}

function getContentEndPlaceholder(c) {
    return `
        <div style="margin: 200px 0; text-align: center;">
            <div style="display: inline-block;">
                <img style="width: 180px; height: 180px;" src="images/vanakam.png">
            </div>
            <div style="font-size: 22px; font-weight: 900;">` + c.title.toUpperCase() + `</div>
            <div style="font-size: 16px; font-weight: 500; color: rgb(110, 110, 110); white-space: pre;">` + c.subTitle + `</div>
        </div>
    `;
}