console.log("MPX Training Player");
console.log("Chapter list card");
console.log("-----------------------------------");

// turn off auto-init
//window._PDK_SUPRESS_INITIALIZE = true;

// set up namespaces
$pdk.ns("$fl.cards");

// add styles
$fl.cards.ChapterListStyles =  "" + 
			'<style>' +
				'.tpPlayer .tpChapterCardOverlay {' +
//					'pointer-events: none !important;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterCard' +
				'{' +
					'position: absolute;' +
					'top: 0px;' +
					'left: 0px;' +
					'right: 0px;' +
					'bottom: 0px;' +
					'cursor: pointer;' +
					'padding: 20px;' +
					'background: rgba(92,154,32, 0.9);' +
					'overflow: scroll;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterCard .tpTitle' +
				'{' +
					'font-size: 150%;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterCard .tpDisclaimer' +
				'{' +
					'display: none;' +
					'background-color: red;' +
					'padding: 10px;' +
					'margin-bottom: 10px;' +
					'margin-left: -20px;'+
					'margin-right: -20px;' +
				'}' +
				'.tpPlayer .tpChapterCardOverlay .tpChapterCard .tpUnderNda' +
				'{' +
					'display: none;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterCard .tpThumb' +
				'{' +
					'height: 135px;' +
					'width: 240px;' +
					'float: right;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterCard div' +
				'{' +
					'font-size: 100%;' +
					'color: white;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterCard .tpChapterListHeader' +
				'{' +
					'padding-top: 20px;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterList' +
				'{' +
					'-webkit-column-count: 2;' +
					'-moz-column-count: 2;' +
					'column-count: 2;' +
				'}' +

				'.tpPlayer .tpChapterCardOverlay .tpChapterList .tpChapterRow' +
				'{' +
					'padding: 5px;' +
				'}' +

				'.tpFormActions' +
				'{' +
					'margin-top: 20px;' +
				'}' +

				'.tpFormActions div' +
				'{' +
					'float: left;' +
					'color: black;' +
				'}' +

			'</style>';

// add card
$fl.cards.ChapterListMarkup =  "" + 
			'<div class="tpChapterCardOverlay">' +
				'<div class="tpChapterCard">' + 
					'<div class="tpDisclaimer"><b>Confidential</b> <span class="tpUnderNda"> - under NDA</span>' +
					'<br/>Do not share this page, player or video unless authorised</div>' +
					'<img class="tpThumb" src="${release.defaultThumbnailUrl}"></img>' +
					'<div class="tpTitle">${release.title}</div>' +
					'<div class="tpDescription">${release.description}</div>' +
					'<div>Presented on <span class="tpAirdate"></span> by <span class="tpPresenters"></span></div>' +
					'<div class="tpChapterListHeader">Select a chapter:<br/></div>' +
					'<div class="tpChapterList"></div>' +
					'<div class="tpFormActions">' +
					'  ... or <a href="#" class="tpResumeButton">resume play</a>' +
					'</div>' +
				'</div>' +
			'</div>';

$fl.cards.ChapterListPresenter = function() {}

$fl.cards.ChapterListPresenter.prototype.show = function(initVars)
{
	if (!this.controller)
	{
		var me = this;
		if (initVars.controller._controller)
			this.controller = initVars.controller._controller;
		else
			this.controller = initVars.controller;
		$pdk.jQuery(document.head).append($fl.cards.ChapterListStyles);
	}

	this.card = initVars.card;
	this.initVars = initVars;

	// resume link
	var me = this;
	$pdk.jQuery(this.card).find(".tpFormActions .tpResumeButton").click(function() {
		me.resume();
	})

	// add airdate	
	$pdk.jQuery(this.card).find(".tpAirdate").html( this.initVars.release.airdate.toLocaleDateString() )
	$pdk.jQuery(this.card).find(".tpPresenters").html( this.initVars.clip.baseClip.contentCustomData.presenters )

	this.waiting = false;

	if (!initVars.clip)
	{
		this.controller.addEventListener("OnMediaStart", function(e) { me.mediaStart(e); });
		this.waiting = true;
		console.log(this.controller);
		this.controller.clickPlayButton();
	}
	else
	{
		this.startUp();
	}
}

$fl.cards.ChapterListPresenter.prototype.hide = function() {}

$fl.cards.ChapterListPresenter.prototype.resume = function() {
	this.controller.pause(false);
}


$fl.cards.ChapterListPresenter.prototype.startUp = function()
{
	this.playlist = $fl.cards.releases[this.initVars.player.id];
	this.displayChapters();
}

$fl.cards.ChapterListPresenter.prototype.mediaStart = function(e)
{
	if (this.waiting)
		this.controller.showPlayerCard("forms", "tpChapterListCard");
}

$fl.cards.ChapterListPresenter.prototype.displayChapters = function()
{
	console.log("displaying chapters");

	$pdk.jQuery(this.card).find(".tpChapterList").empty();

	var image = null;
	var me = this;

	if (this.initVars.clip.baseClip.contentCustomData.isConfidential && this.initVars.clip.baseClip.contentCustomData.isConfidential=='true') {
		$pdk.jQuery(this.card).find(".tpDisclaimer").css('display', 'block');
	}
	if (this.initVars.clip.baseClip.contentCustomData.underNda && this.initVars.clip.baseClip.contentCustomData.underNda=='true') {
		$pdk.jQuery(this.card).find(".tpUnderNda").css('display', 'inline');
	}

	for (var i=0; i<this.playlist.clips.length; i++)
	{
		$pdk.jQuery(this.card).find(".tpChapterList").append("<div class='tpChapterRow'><a href='#" + i + "'>" + i + ". " + this.playlist.clips[i].title + "</a></div>");
		$pdk.jQuery(this.card).find(".tpChapterList").children().last().children().first().click(function(e) {
			me.selectChapter(parseInt(e.target.href.split("#")[1]));
		})
	}
}

$fl.cards.ChapterListPresenter.prototype.selectChapter = function(i)
{
	console.log(this);
	console.log("chapter selected: " + i + " (seek to " + this.playlist.clips[i].startTime + ")");
	this.controller.seekToPosition(this.playlist.clips[i].startTime);
	this.controller.pause(false);
}

$fl.cards.releases = {};
$fl.cards.releaseFirstLoad = 1;

$fl.cards.handleRelease = function(e)
{
	$fl.cards.releases[e.originator.controlId] = e.data;
	//console.log(e.data);
	//$pdk.controller.showPlayerCard("forms", "tpChapterListCard", null, null, ["*"]);
}

$pdk.controller.addPlayerCard("forms", "tpChapterListCard", $fl.cards.ChapterListMarkup, "urn:theplatform:pdk:area:player", {}, $fl.cards.ChapterListPresenter, ["*"]);
$pdk.controller.addEventListener("OnReleaseStart", $fl.cards.handleRelease, ["*"]);