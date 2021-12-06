"use strict";

if (typeof utm_params === undefined) {
	utm_params = {};
}

// common var
var paramPageLoad = Object.assign({ pageTitle: document.title }, utm_params);
var isLoggedIn = document.querySelector("body.logged-in");

var metaPostTitle = document.title.replace(" - MYX Global", "");
var metaPostID = document.querySelector('meta[name="post:id"]')
	? document.querySelector('meta[name="post:id"]').content
	: null;
var metaPostAuthor = document.querySelector('meta[name="post:author"]')
	? document.querySelector('meta[name="post:author"]').content
	: null;
var metaPostDate = document.querySelector(
	'meta[property="article:published_time"]'
)
	? document.querySelector('meta[property="article:published_time"]').content
	: null;
var metaPostMDate = document.querySelector(
	'meta[property="article:modified_time"]'
)
	? document.querySelector('meta[property="article:modified_time"]').content
	: null;

var mainMenu = document.getElementById("#menu-main-menu-1");
var currentMenuItem = null;
var currentMenuItemTxt = null;
var currentMenuItemParent = null;
var currentMenuItemParentTxt = null;
if (mainMenu !== null) {
	currentMenuItem = mainMenu.querySelector(
		".current_page_item, .current-menu-item"
	);
	if (currentMenuItem !== null) {
		currentMenuItemTxt = currentMenuItem.querySelector("a")
			? currentMenuItem.querySelector("a").innerText
			: null;
	}

	currentMenuItemParent = mainMenu.querySelector(
		".current-menu-ancestor, .current-menu-parent, .current_page_parent, .current_page_ancestor"
	);
	if (currentMenuItemParent !== null) {
		currentMenuItemParentTxt = currentMenuItemParent.querySelector("a")
			? currentMenuItemParent.querySelector("a").innerText
			: null;
	}
}

// ===== page render event
var eventType = null;

// let sectionPageRender = ["/vote/", "/livetv/", "/news/", "/findmyxontv/"];
// var sectionPageRender = ["", "", "", ""];

var sectionPageRender = null;

if (location.pathname === "/") {
	// home page
	eventType = "homePageRender";
} else if (location.pathname === "/registration/") {
	// reg page
	eventType = "registrationPageRender";
	paramPageLoad.destinationUrl = "https://myx.global/registration/";
} else {
	sectionPageRender = document.querySelector(
		".gtm.sectionPageRender.current_page_item"
	);
	if (sectionPageRender !== null) {
		// section pages
		eventType = "sectionPageRender";
		paramPageLoad.sectionName = currentMenuItemTxt;
	} else {
		subSectionPageRender = document.querySelector(
			".gtm.subSectionPageRender.current_page_item"
		);
		if (subSectionPageRender !== null) {
			// sub section pages
			eventType = "subSectionPageRender";
			paramPageLoad.sectionName = currentMenuItemParentTxt;
			paramPageLoad.subSectionName = currentMenuItemTxt;
		} else {
			chartPageRender = document.querySelector(
				".gtm.chartPageRender.current_page_item"
			);
			if (chartPageRender !== null) {
				// chart pages
				eventType = "chartPageRender";
				paramPageLoad.chartTitle = currentMenuItemTxt;
			} else {
				articlePageRender = document.querySelector("body.single-post");
				if (articlePageRender !== null) {
					// article page (post)
					eventType = "articlePageRender";
					paramPageLoad.articleID = metaPostID;
					paramPageLoad.articleTitle = metaPostTitle;
					paramPageLoad.author = metaPostAuthor;
					paramPageLoad.pageUrl = location.href;
					paramPageLoad.publishedDate = metaPostMDate;
					paramPageLoad.publishedMonth = metaPostMDate.substring(
						5,
						7
					);
					paramPageLoad.publishedYear = metaPostMDate.substring(0, 4);
				} else {
				}
			}
		}
	}
}
console.log({
	event: "logEvent",
	eventType: eventType,
	eventProperties: paramPageLoad,
});

// ===== Clicks events
var allSecItems = document.querySelectorAll("#menu-main-menu-1 .gtm");
if (allSecItems.length) {
	allSecItems.forEach((item) => {
		item.addEventListener("click", (event) => {
			let itemInnerTxt = item.querySelector("a")
				? item.querySelector("a").innerText
				: null;

			if (item.classList.contains("sectionPageRender")) {
				eventType = "sectionClick";
				paramPageLoad.navName = itemInnerTxt;
				paramPageLoad.context = "Nav Bar";
			} else if (item.classList.contains("subSectionPageRender")) {
				eventType = "subSectionClick";
				paramPageLoad.navName = itemInnerTxt;
				paramPageLoad.context = "Nav Bar";
			} else if (item.classList.contains("chartPageRender")) {
				eventType = "chartNavClick";
				paramPageLoad.chartTitle = itemInnerTxt;
				paramPageLoad.context = "Nav Bar";
			}

			console.log({
				event: "logEvent",
				eventType: eventType,
				eventProperties: paramPageLoad,
			});
		});
	});
}

/* switch (location.pathname) {
	case "/":
		eventType = "homePageRender";
		break;
	case "/registration/":
		eventType = "registrationPageRender";
		break;
	case sectionPageRender.find((x) => x == location.pathname):
		eventType = "sectionPageRender";
		paramPageLoad.sectionName = currentMenuItemTxt;
		break;
	case "/vote-myx-awards/":
		var alreadyVote = document.querySelector("#jkTime");
		if (isLoggedIn === null) {
			eventType = "awardsLoginPageRender";
		} else {
			if (alreadyVote !== null) {
				eventType = "votingLimitPageRender";
			} else {
				eventType = "awardsVotePageRender";
			}
		}
		break;
	case "/vote-thank-you/":
		eventType = "successfulVotePageRender";
		break;
	default:
		eventType = "otherPageRender";
		break;
} */
if (eventType !== null) {
	/* dataLayer.push({
		event: "logEvent",
		eventType: eventType,
		eventProperties: paramPageLoad,
	});
	console.log({
		event: "logEvent",
		eventType: eventType,
		eventProperties: paramPageLoad,
	});  */
}
