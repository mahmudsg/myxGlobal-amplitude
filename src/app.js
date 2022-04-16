"use strict";

if (typeof utm_params === undefined) {
	utm_params = {};
}

// common var
var paramPageLoad = Object.assign({}, utm_params);
paramPageLoad.url = null;
paramPageLoad.referrerURL = null;

var isLoggedIn = document.querySelector("body.logged-in");
var mL = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

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

var mainMenu = document.getElementById("menu-main-menu-1");
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
			? currentMenuItem.querySelector("a").textContent
			: null;
	}

	currentMenuItemParent = mainMenu.querySelector(
		".current-menu-ancestor, .current-menu-parent, .current_page_parent, .current_page_ancestor"
	);
	if (currentMenuItemParent !== null) {
		currentMenuItemParentTxt = currentMenuItemParent.querySelector("a")
			? currentMenuItemParent.querySelector("a").textContent
			: null;
	}
}

// ===== page render event
var eventType = null;

// let sectionPageRender = ["/vote/", "/livetv/", "/news/", "/findmyxontv/"];
// var sectionPageRender = ["", "", "", ""];

var sectionPageRender = null;
var loginForm = document.querySelector("#loginform");

if (location.search.indexOf("?login=failed") >= 0 && loginForm !== null) {
	//login failed page
	eventType = "loginErrorPageRender";
	paramPageLoad.errorMessage =
		loginForm.querySelector("h6") !== null
			? loginForm.querySelector("h6").textContent
			: "Incorrect Username or Password, try again!!";
	paramPageLoad.pageUrl = location.href;
} else if (location.search.indexOf("?s=") >= 0) {
	//search page
	eventType = "searchPageRender";
	paramPageLoad.keyword = location.search.replace("?s=", "");
	paramPageLoad.originUrl = document.referrer;
	paramPageLoad.pageUrl = location.href;
} else if (location.pathname === "/") {
	// home page
	eventType = "homePageRender";
} else if (location.pathname === "/registration/") {
	// reg page
	eventType = "registrationPageRender";
	paramPageLoad.destinationUrl = "https://myx.global/registration/";
	paramPageLoad.originUrl = document.referrer;
} else {
	sectionPageRender = document.querySelector(
		".gtm.sectionPageRender.current_page_item"
	);
	if (sectionPageRender !== null) {
		// section pages
		eventType = "sectionPageRender";
		paramPageLoad.sectionName = currentMenuItemTxt;
		paramPageLoad.pageUrl = location.href;
	} else {
		subSectionPageRender = document.querySelector(
			".gtm.subSectionPageRender.current_page_item"
		);
		if (subSectionPageRender !== null) {
			// sub section pages
			eventType = "subSectionPageRender";
			paramPageLoad.sectionName = currentMenuItemParentTxt;
			paramPageLoad.subSectionName = currentMenuItemTxt;
			paramPageLoad.pageUrl = location.href;
		} else {
			chartPageRender = document.querySelector(
				".gtm.chartPageRender.current_page_item"
			);
			if (chartPageRender !== null) {
				let pageTitle = document
					.querySelector("h1")
					.textContent.replace(",", "");
				let hitChartMonth = null;
				pageTitle = pageTitle.substring(
					pageTitle.indexOf("(") + 1,
					pageTitle.indexOf(")")
				);
				chartData = pageTitle.split(" ");
				if (chartData.length) {
					hitChartMonth = parseInt(
						mL.findIndex(
							(month) =>
								month.toLowerCase() ===
								chartData[0].toLowerCase()
						) + 1
					);

					paramPageLoad.hitChartDateDuration = chartData[1];
					paramPageLoad.hitChartMonth =
						hitChartMonth !== null
							? hitChartMonth.toString()
							: undefined;
					paramPageLoad.hitChartYear = chartData[2];
				}

				// chart pages
				eventType = "chartPageRender";
				paramPageLoad.chartTitle = currentMenuItemTxt;
				paramPageLoad.pageUrl = location.href;
			} else {
				articlePageRender = document.querySelector("body.single-post");
				if (articlePageRender !== null) {
					// article page (post)
					eventType = "articlePageRender";
					paramPageLoad.articleID = metaPostID;
					paramPageLoad.articleTitle = metaPostTitle;
					paramPageLoad.author = metaPostAuthor;
					paramPageLoad.pageUrl = location.href;
					paramPageLoad.publishedDate = metaPostMDate.substring(
						0,
						10
					);
					paramPageLoad.publishedMonth = metaPostMDate.substring(
						5,
						7
					);
					paramPageLoad.publishedYear = metaPostMDate.substring(0, 4);
					paramPageLoad.subSectionName = currentMenuItemTxt;
				} else {
				}
			}
		}
	}
}

if (eventType !== null) {
	dataLayer.push({
		event: "logEvent",
		eventType: eventType,
		eventProperties: paramPageLoad,
	});
}

// ===== Submit events - login form
var loginForm = document.getElementById("loginform");
if (loginForm !== null) {
	loginForm.addEventListener("submit", function (event) {
		localStorage.setItem("loginFormSubmited", "true");
		return false;
	});
}

var params = {};

// login success
if (
	document.body.classList.contains("logged-in") &&
	localStorage.getItem("loginFormSubmited") === "true"
) {
	localStorage.removeItem("loginFormSubmited");

	params = Object.assign({}, utm_params);
	params.originUrl = document.referrer;
	params.pageUrl = location.href;
	params.url = null;
	params.referrerURL = null;

	dataLayer.push({
		eventProperties: undefined,
	});

	dataLayer.push({
		event: "logEvent",
		eventType: "loginSubmit",
		eventProperties: params,
	});
}

// ===== Clicks events - sections
var allSecItems = document.querySelectorAll("#menu-main-menu-1 .gtm>a");
if (allSecItems.length) {
	allSecItems.forEach((item) => {
		item.addEventListener("click", (event) => {
			// clear previous event
			params = Object.assign({}, utm_params);

			let itemParent = item.closest("li");
			let itemSParent = itemParent.closest(".menu-item-has-children");
			let itemSParentTxt = null;
			let href = item.getAttribute("href");
			console.log("e");
			console.log(href);
			if (itemSParent !== null) {
				itemSParentTxt = itemSParent.querySelector("a").textContent;
			}

			let itemInnerTxt = item.textContent;

			params.url = null;
			params.referrerURL = null;
			params.originUrl = location.href;
			params.destinationUrl = href;

			if (itemParent.classList.contains("sectionPageRender")) {
				eventType = "sectionClick";
				params.navName = itemInnerTxt;
				params.context = "Nav Bar";
			} else if (itemParent.classList.contains("subSectionPageRender")) {
				eventType = "subSectionClick";
				params.sectionName = itemSParentTxt; // reviously known as navParent
				params.navName = itemInnerTxt;
				params.context = "Nav Bar";
			} else if (itemParent.classList.contains("chartPageRender")) {
				eventType = "chartNavClick";
				params.chartTitle = itemInnerTxt;
				params.context = "Nav Bar";
			}

			dataLayer.push({
				eventProperties: undefined,
			});

			dataLayer.push({
				event: "logEvent",
				eventType: eventType,
				eventProperties: params,
			});
		});
	});
}

// ===== Clicks events - post articleIntent
var articles = document.querySelectorAll(".oxy-post a");
let post = null;
if (articles.length) {
	articles.forEach((a) =>
		a.addEventListener("click", (event) => {
			params = Object.assign({}, utm_params);

			post = a.closest(".oxy-post");
			params.articleTitle = post.querySelector(".oxy-post-title")
				? post.querySelector(".oxy-post-title").innerText
				: null;
			params.destinationUrl = a.getAttribute("href");
			// where clicked
			if (a.classList.contains("oxy-post-title")) {
				params.clickedElement = "title";
			} else if (a.classList.contains("oxy-post-image")) {
				params.clickedElement = "thumbnail";
			} else if (a.classList.contains("oxy-read-more")) {
				params.clickedElement = "read more";
			}

			params.originUrl = location.href;
			params.url = null;
			params.referrerURL = null;

			// section location
			params.context = currentMenuItemTxt;

			dataLayer.push({
				eventProperties: undefined,
			});

			dataLayer.push({
				event: "logEvent",
				eventType: "articleIntent",
				eventProperties: params,
			});
		})
	);
}

// ===== Clicks events - search
var siteSearchIcon = document.getElementById("fancy_icon-220-12");
if (siteSearchIcon !== null) {
	siteSearchIcon.addEventListener("click", (event) => {
		params = Object.assign({}, utm_params);

		if (location.search.indexOf("?s=") === 0) {
			params.context = "Search page";
		} else {
			params.context =
				currentMenuItemTxt !== null
					? currentMenuItemTxt
					: currentMenuItemParentTxt;
		}

		params.originUrl = location.href;
		params.url = null;
		params.referrerURL = null;

		dataLayer.push({
			eventProperties: undefined,
		});

		dataLayer.push({
			event: "logEvent",
			eventType: "searchClick",
			eventProperties: params,
		});
	});
}

// ===== Clicks events - vote
var voteClick = document.getElementById("_toggle-171-12");
if (voteClick !== null) {
	voteClick.addEventListener("click", (event) => {
		params = Object.assign({}, utm_params);

		if (currentMenuItemParentTxt !== null) {
			params.sectionName = currentMenuItemParentTxt;
			params.subSectionName = currentMenuItemTxt;
		} else {
			params.sectionName = currentMenuItemTxt;
		}

		params.pageUrl = location.href;
		params.url = null;
		params.referrerURL = null;

		dataLayer.push({
			eventProperties: undefined,
		});

		dataLayer.push({
			event: "logEvent",
			eventType: "voteClick",
			eventProperties: params,
		});
	});
}

// ===== Clicks events - registration
var regLinks = document.querySelectorAll('a[href*="/registration/"');
if (regLinks.length) {
	regLinks.forEach((item) => {
		item.addEventListener("click", (event) => {
			params = Object.assign({}, utm_params);

			params.destinationUrl = "https://myx.global/registration/";
			params.originUrl = location.href;
			params.url = null;
			params.referrerURL = null;

			dataLayer.push({
				eventProperties: undefined,
			});

			dataLayer.push({
				event: "logEvent",
				eventType: "registrationClick",
				eventProperties: params,
			});
		});
	});
}

// ===== Submit events - search form
var searchForms = document.querySelectorAll(".searchform");
if (searchForms.length) {
	searchForms.forEach((item) => {
		item.addEventListener("submit", function (event) {
			params = Object.assign({}, utm_params);

			let searchKey = item.querySelector("#s").value;
			params.keyword = searchKey;

			params.originUrl = location.href;
			params.destinationUrl = "https://myx.global/?s=" + searchKey;
			params.url = null;
			params.referrerURL = null;

			dataLayer.push({
				eventProperties: undefined,
			});

			dataLayer.push({
				event: "logEvent",
				eventType: "searchSubmit",
				eventProperties: params,
			});
			return false;
		});
	});
}

// ===== Submit events - vote form
var voteForm = document.getElementById("form_vote8e2655ef18");
if (voteForm !== null) {
	voteForm.addEventListener("submit", function (event) {
		params = Object.assign({}, utm_params);

		params.pageUrl = location.href;
		params.url = null;
		params.referrerURL = null;

		dataLayer.push({
			eventProperties: undefined,
		});

		dataLayer.push({
			event: "logEvent",
			eventType: "voteTop10Submit",
			eventProperties: params,
		});
		return false;
	});
}

// ===== Registration button
/* var regButton = document.querySelector(
	"#frm_form_38_container .frm_button_submit"
);
if (regButton !== null && location.pathname === "/registration/") {
	regButton.addEventListener("click", function () {
		var bithday = document.querySelector("#field_qyuwh");
		var gender = document.querySelector("#field_5prme");

		if (bithday === null || bithday.value === "") {
			bithday = "not provided";
		} else {
			bithday = bithday.value;
		}
		if (gender === null || gender.value === "") {
			gender = "not provided";
		} else {
			gender = gender.value;
		}
		// var params = Object.assign(
		// 	{ birthYear: bithday, gender: gender },
		// 	utm_params
		// );
		var params = Object.assign({}, utm_params);

		dataLayer.push({
			eventProperties: undefined,
		});

		dataLayer.push({
			event: "logEvent",
			eventType: "registrationSubmit",
			eventProperties: params,
		});

		dataLayer.push({
			event: "setUserProperties",
			userProperties: { birthYear: bithday, gender: gender },
		});
	});
} */

var regForm = document.getElementById("form_user-registration");
if (regForm !== null) {
	regForm.addEventListener("submit", (event) => {
		var fName = document.querySelector("#field_o69jd");
		var lName = document.querySelector("#field_l3dkc");
		var username = document.querySelector("#field_xyrs9");
		var eMail = document.querySelector("#field_qulq1");
		var pass = document.querySelector("#field_1abwj");

		var bithday = document.querySelector("#field_qyuwh");
		var gender = document.querySelector("#field_5prme");

		var check1 = document.querySelector("#field_40j5n-0").checked;
		var check2 = document.querySelector("#field_nw83y-0").checked;

		if (
			check1 &&
			check2 &&
			fName !== null &&
			fName.value !== "" &&
			lName !== null &&
			lName.value !== "" &&
			username !== null &&
			username.value !== "" &&
			eMail !== null &&
			eMail.value !== "" &&
			pass !== null &&
			pass.value !== ""
		) {
			if (bithday === null || bithday.value === "") {
				bithday = "not provided";
			} else {
				bithday = bithday.value;
			}
			if (gender === null || gender.value === "") {
				gender = "not provided";
			} else {
				gender = gender.value;
			}

			/* var params = Object.assign(
				{ birthYear: bithday, gender: gender },
				utm_params
			); */
			var params = Object.assign({}, utm_params);

			params.pageUrl = location.href;
			params.url = null;
			params.referrerURL = null;

			dataLayer.push({
				eventProperties: undefined,
			});

			dataLayer.push({
				event: "setUserProperties",
				userProperties: { birthYear: bithday, gender: gender },
			});

			dataLayer.push({
				event: "logEvent",
				eventType: "registrationSubmit",
				eventProperties: params,
			});
		}

		return false;
	});
}
