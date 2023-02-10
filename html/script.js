let buttonParams = [];

const openMenu = (data = null) => {
    let html = "";
    data.forEach((item, index) => {
        if(!item.hidden) {
            let header = item.header;
            let message = item.txt || item.text;
            let isMenuHeader = item.isMenuHeader;
            let isDisabled = item.disabled;
            let icon = item.icon;
            html += getButtonRender(header, message, index, isMenuHeader, isDisabled, icon);  
            if (item.params) buttonParams[index] = item.params;
        }
    });
    $("#buttons").html(html);
    $('#container').css("opacity", "100%");
    $('.button').click(function() {
        const target = $(this)
        if (!target.hasClass('title') && !target.hasClass('disabled')) {
            postData(target.attr('id'));
        }
    });
};

const getButtonRender = (header, message = null, id, isMenuHeader, isDisabled, icon) => {
    return `
    <div class="${isMenuHeader ? "title" : "button"} ${isDisabled ? "disabled" : ""}" id="${id}" style = "font-size: 1.5rem;">
    ${icon ? '<div class="circle">' + icon + "</div>" : ""}
    ${id != 0 && icon == null ? '<div class="circle">' + id + "</div>" : ""}

    <div className="column">
    <div class="header"> ${header}</div>
    ${message ? `<div class="text">${message}</div>` : ""}
    </div>
</div>
    `;
};

// <i class="fa-solid fa-person-half-dress"></i>
// <img src=https://cdn.discordapp.com/attachments/865020100607868939/1052971885132001411/car-engine.png width=30px;">


const closeMenu = () => {
    $("#buttons").html(" ");
    $('#container').css("opacity", "0%");
    buttonParams = [];
};

const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    $.post(`https://${GetParentResourceName()}/hoveringRemove`);
    return closeMenu();
};

window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
        case "SHOW_HEADER":
            return openMenu(buttons)
        case "CLOSE_MENU":
            return closeMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        cancelMenu();
    }
};  

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).on("mouseenter", ".button", function (e) {
    e.preventDefault();
    const target = $(this)
    sleep(300)
    if (!target.hasClass('title') && !target.hasClass('disabled')) {
        $.post(`https://${GetParentResourceName()}/hoveringShow`, JSON.stringify(parseInt(target.attr('id')) + 1));
    }
});

$(document).on("mouseleave", ".button", function (e) {
    e.preventDefault();
    const target = $(this)
    sleep(300)
    if (!target.hasClass('title') && !target.hasClass('disabled')) {
        $.post(`https://${GetParentResourceName()}/hoveringRemove`);
    }
});