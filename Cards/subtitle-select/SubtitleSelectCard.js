if (!this.$pdk)
    throw ('SubtitleSelectCard.js - $pdk is undefined!');

if (!this.$)
    throw ('SubtitleSelectCard.js - JQuery is undefined!');

// we need all the info
//tpLogLevel = "test";

// find this script's URL to load other resources dynamically from the same location
var scr=document.getElementsByTagName('script');
var srcDir=scr[scr.length-1].getAttribute("src").replace(/[^\/]*$/, '');
var cssFile = srcDir + 'SubtitleSelectCard.css';
var htmlFile = srcDir + 'SubtitleSelectCard.html';

//dynamically include CSS
$.holdReady(true);
if (document.createStyleSheet)
    document.createStyleSheet(cssFile);
else
    $('head').append($('<link>').attr({type: 'text/css', rel: 'stylesheet', href: cssFile}));
setTimeout(function (){$.holdReady(false)},500);


var presenter = {
	_id: null,

	// adds the card's HTML to the DOM, and extract the ID from it  // ASSUMES ONLY ONE CARD PER HTML DOCUMENT
	addToDom: function(htmlSrc) {
		var me = this;
		var containerId = "CardHolder" + Math.random().toString(36).substr(2,5);

		$('body').append( $("<div/>", {id: containerId, style: 'display:none'}) );
		$('#'+containerId).load(htmlSrc, function () {
			// extract the ID from the first DIV
			me._id = $('#'+containerId).find('div:first').attr('id')
			if (!me._id) { throw ("No identifier found for card in " + htmlSrc) }

			$pdk.controller.addPlayerCard("forms", me._id, document.getElementById(me._id), "urn:theplatform:pdk:area:player", 
				 {title: 'SELECT LANGUAGE', apply: 'Apply', close: 'Close'},
				 me, 100); 
		});	
	},

	show: function(initVars)
	{
		var me = this;

		this.card = initVars.card;
		this.clip = initVars.clip;

		if (!this.controller)
		{
			this.controller = initVars.controller;
			if (!this.loadedLanguage || !this.loadStyles)
			{
				this.card.style.display = "none";
			}

			this.listeners = {};
		}

		var addOption = function(title,code) {
			return $("<div/>", { 'class': 'subtitleListOption' })
					.append($("<a/>", { text: title })
							.click(function() { me.apply(code); }))			
		}
		
		$pdk.jQuery.each(this.clip.baseClip.availableSubtitles, function(i, subt) {
		    $('#subtitleList').append( addOption(subt.name, subt.language) );
		});

	    $('#noSubtitle').append( addOption("No subtitles", "none"));


		$pdk.jQuery(this.card).find(".adButtonApply").click(function() {
			me.apply();
		})

		initVars.controller.addEventListener("OnGetSubtitleLanguage", this.listeners.lang = function (e) { me.loadLanguage(e) });
//		initVars.controller.addEventListener("OnGetSubtitleStyle", this.listeners.style = function (e) { me.loadStyles(e) });
//					initVars.controller.addEventListener("OnSubtitleCuePoint", this.listeners.cue = function(e) { me.cuePoint(e) });

//		this.loadedStyles = false;
		this.loadedLanguage = false;
//		$pdk.controller.getSubtitleStyle();
		$pdk.controller.getSubtitleLanguage();

		// define a default subtitle style
		var style = {
			globalDataType: "com.theplatform.pdk.data::SubtitleStyle",
			textAlignVertical: "bottom",
			textAlign: "center"
		}
		$pdk.controller.setSubtitleStyle(style);

	},

	hide: function()
	{
		$pdk.controller.removeEventListener("OnGetSubtitleLanguage", this.listeners.lang);
//		$pdk.controller.removeEventListener("OnGetSubtitleStyle", this.listeners.style);
//					$pdk.controller.removeEventListener("OnSubtitleCuePoint", this.listeners.cue);
	},


	loadLanguage: function(e)
	{
		if (e.data)
		{
			this.loadedLanguage = true;
			//$pdk.jQuery(this.card).find("#showCCs")[0].checked = (e.data.langCode !== "none");
			//$pdk.jQuery(this.card).find("#ccLang")[0].value = e.data.langCode;
			this.update();
		}
	}, 

	update: function()
	{
		if (this.loadedLanguage)
		{
			this.card.style.display = "";
		}
	},

	apply: function(lang)	
	{		
		$pdk.controller.setSubtitleLanguage(lang);
		$pdk.controller.hidePlayerCard("forms", this._id);					
	}

};


$(function () {
	presenter.addToDom(htmlFile)
});
