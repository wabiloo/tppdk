console.log("MPX Training Player");
console.log("Chapter info panel");
console.log("-----------------------------------");

// set up namespaces
$pdk.ns("$fl.cards");

// add styles
$fl.cards.ChapterInfoStyles =  "" + 
			'<style>' +
				'.tpPlayer .tpChapterInfoOverlay {' +
					'pointer-events: none !important;' +
				'}' +

				'.tpPlayer .tpChapterInfoOverlay .tpChapterListButton {' +
					'float: right' +
				'}' +

				'.tpPlayer .tpChapterInfoOverlay .tpChapterListLink {' +
					'pointer-events: auto !important;' +
				'}' +

				'.tpPlayer .tpChapterInfoOverlay .tpChapterInfo' +
				'{' +
					'position: absolute;' +
					//'top: 10px;' +
					//'bottom: 0px;' +
					'left: 0px;' +
					'right: 0px;' +
					'height: 50px;' +
					'cursor: pointer;' +
					'background: rgba(92,154,32, 0.8);' +
					'padding: 10px;' +
				'}' +

				'.tpPlayer .tpChapterInfoOverlay .tpChapterInfo div' +
				'{' +
					'font-size: 100%;' +
					'color: white;' +
				'}' +

				'.tpPlayer .tpChapterInfoOverlay .tpChapterInfo .tpTitle' +
				'{' +
					'font-weight: bold;' +
				'}' +

			'</style>';

// add card
$fl.cards.ChapterInfoMarkup =  "" + 
			'<div class="tpChapterInfoOverlay">' +
				'<div class="tpChapterInfo">' + 
					'<div class="tpChapterListButton"><a href="#" class="tpChapterListLink">Chapter List</a></div>' +
					'<div class="tpTitle">${release.title}</div>' +
					'<div class="tpExtra"></div>' +
				'</div>' +
			'</div>';

$fl.cards.ChapterInfoPresenter = function() {}

$fl.cards.ChapterInfoPresenter.prototype.show = function(initVars)
{
	if (!this.controller)
	{
		var me = this;
		this.controller = initVars.controller;
		this.controller.addEventListener("OnShowControls", function(e) {me.showControls(e);});
		this.controller.addEventListener("OnMediaStart", function(e) {me.mediaStart(e.data);});
		$pdk.jQuery(document.head).append($fl.cards.ChapterInfoStyles);
	}

	this.card = initVars.card;
	this.initVars = initVars;

	$pdk.jQuery(this.card).find(".tpChapterListLink").click(function() {
		$pdk.controller.showPlayerCard("forms", "tpChapterListCard", null, null, ["*"]);
	})

	$pdk.jQuery(this.card).css('display', 'none');
}

$fl.cards.ChapterInfoPresenter.prototype.hide = function() { }

$fl.cards.ChapterInfoPresenter.prototype.showControls = function(e)
{
	var me = this;
	if (e.data.regionId.indexOf("Bottom") >= 0)
	{
		console.log(e.data.regionId + ": " + e.data.visible);
		$pdk.jQuery(this.card).css('display', 'none');
		if (e.data.visible)
		{
			$pdk.jQuery(this.card).fadeIn(500);
		}
	}
}

$fl.cards.ChapterInfoPresenter.prototype.mediaStart = function(clip)
{
	$pdk.jQuery(this.card).fadeIn(1000);
	console.log(clip);
	console.log("chapter: " + clip.title)
	$pdk.jQuery(this.card).find(".tpExtra").html("&nbsp;" + (clip.clipIndex+1) + " - " + clip.title);
}

$pdk.controller.addPlayerCard("overlays", "tpChapterInfoOverlayCard", $fl.cards.ChapterInfoMarkup, "urn:theplatform:pdk:area:player", {}, $fl.cards.ChapterInfoPresenter, ["*"]);

$pdk.controller.addEventListener("OnReleaseStart", function(e) {
	console.log(e);
	$pdk.controller.showPlayerCard("overlays", "tpChapterInfoOverlayCard", null, null, [e.originator.controlId]);
	//setTimeout(function(){$pdk.controller.hidePlayerCard("overlays", "tpChapterInfoOverlayCard", [e.originator.controlId]);},3000)
}, ["*"]);

$pdk.controller.addEventListener("OnReleaseEnd", function(e) {
	console.log(e);
	$pdk.controller.hidePlayerCard("overlays", "tpChapterInfoOverlayCard", [e.originator.controlId]);
}, ["*"]);