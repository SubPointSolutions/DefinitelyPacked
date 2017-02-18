function CreateNewDocument(TemplateId){
	var url = _spPageContextInfo.webServerRelativeUrl+"/_layouts/15/CreateNewDocument.aspx?SaveLocation="+encodeURIComponent(window.NICRootFolder)+"&DefaultItemOpen=1&Source="+window.location.href+"&TemplateType="+TemplateId;
	OpenPopUpPageWithTitle(url.replace("//","/"), OnCloseDialogNavigate);
}

var SPFNIC  = SPFNIC  || {};

var NewItemCalloutData = function (params) {
    var InParams = params || {};
    var listId;
    var CTList = [];
    var _self = this;
    var RootFolderCTId = "0x012001";
    var MainObjectName = "_SPFCustomCallout";

    function _init() {
        var CustomEvent = {};
        CustomEvent.OnPreRender = function (ctx) {
            AddStyles();
        };

        CustomEvent.OnPostRender = function (ctx) {
            var wpq = ctx.wpq;
            window[MainObjectName + wpq] = window[MainObjectName + wpq] || {};

            var Loaded = window[MainObjectName + wpq].Loaded;

            if (!Loaded) {
                window[MainObjectName + wpq].Loaded = true;
                var Hero = document.getElementById('Hero-' + wpq);



                if (Hero) {
                    if (InParams.ReloadPage || InParams.Mask) {
                        _self.Mask(ctx, Hero);
                    }

                    Hero.setAttribute('class', 'display-none');

                    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
                        _self.MakeRequest(ctx);
                    }, 'sp.js');

                }
            }

        };

        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(CustomEvent);
    };

    this.closest = function (el, tag) {
        tag = tag.toUpperCase();
        do {
            if (el.nodeName === tag) {
                return el;
            }
        } while (el = el.parentNode);

        return null;
    };
    this.GetLinkButton = function (ctx, Hero) {
        Hero = Hero || document.getElementById("Hero-" + ctx.wpq);
        var Link = Hero.querySelector(".ms-heroCommandLink") || Hero.querySelector(".js-listview-qcbNewButton");
        return Link;
    };
    this.LoadingMaskTemplate = function (ctx) {
        return "<div id=\"LoadingMask_" + ctx.wpq + "\"><img src=\"/_layouts/15/images/progress-circle-24.gif?rev=38\" alt=\"Loading...\"></div>";
    };
    this.Mask = function (ctx, Hero) {
        var Hero = Hero || document.getElementById('Hero-' + ctx.wpq);

        var Empty = document.getElementById('empty-' + ctx.wpq);
        if (Empty)
            Empty.setAttribute('class', 'display-none');

        var parentTd = Hero.parentNode;
        if (parentTd)
            parentTd.setAttribute('class', 'display-none');
        var parentTr = _self.closest(parentTd, "tr");
        if (parentTr) {
            var MaskElem = document.createElement("td");
            MaskElem.innerHTML = _self.LoadingMaskTemplate(ctx);
            parentTr.appendChild(MaskElem);
        }
    };
    this.Unmask = function (ctx, Hero) {
        var Hero = Hero || document.getElementById('Hero-' + ctx.wpq);

        var parentTd = Hero.parentNode;
        if (parentTd)
            parentTd.className = parentTd.className.replace('display-none',"");

        var MaskDiv = document.getElementById('LoadingMask_' + ctx.wpq);
        if (MaskDiv) {
            var td = MaskDiv.parentNode;
            if (td) {
                var tr = td.parentNode;
                if (tr) {
                    tr.removeChild(td);
                }
            }
        }

    };
    this.ResourcedValue = function (value) {
        var returnValue = value;
        if (SPFResources) {
            var resource = SPFResources[_spPageContextInfo.currentCultureName.toLowerCase()];
            if (!resource) {
                resource = SPFResources;
            };
            if (resource) {
                returnValue = resource[value];
            }
        };
        return returnValue;
    };
    this.CreateHeroLink = function (ctx, CTList) {
        var Hero = document.getElementById('Hero-' + ctx.wpq);
        if (Hero) {
            var LinkButton = _self.GetLinkButton(ctx, Hero);
            if (LinkButton) {
                LinkButton.setAttribute('href', ctx.newFormUrl + "&ContentTypeId=" + CTList[0].id + "&Source=" + encodeURIComponent(window.location.href));
                LinkButton.setAttribute('onclick', 'javascript:;');
                Hero.setAttribute('class', 'display-inlineblock');
            }
        }
    };

    this.CreateCallout = function (ctx, CTList) {
        if (CTList.length > 0) {
            var wpq = ctx.wpq;
            var Hero = document.getElementById('Hero-' + wpq);
            if (Hero) {
                var LinkButton = _self.GetLinkButton(ctx, Hero);
                if (LinkButton) {
                    LinkButton.setAttribute('href', 'javascript:;');
                    LinkButton.setAttribute('onclick', 'javascript:;');
                    Hero.setAttribute('class', 'display-inlineblock');

                    EnsureScript('callout.js', typeof CalloutManager, function () {
                        if (Boolean(LinkButton)) {
                            var callout = CalloutManager.getFromLaunchPointIfExists(LinkButton);
                            if (callout) {
                                var parentl = LinkButton.parentNode;
                                var newd = document.createElement("div");
                                newd.innerHTML = LinkButton.outerHTML;
                                parentl.removeChild(LinkButton);
                                var newb = newd.children[0];
                                parentl.insertBefore(newb, parentl.children[0]);
                                LinkButton = newb;
                            }

                            var content = "";
                            var foldersContent = "";
                            for (var i = 0; i < CTList.length; i++) {
                                var CT = CTList[i];
                                
                                var FormUrl = ctx.newFormUrl;

								if (CT.Template.indexOf(".aspx") != -1){	
									FormUrl = (_spPageContextInfo.webServerRelativeUrl+CT.Template+"?List="+encodeURIComponent(ctx.listName)+"&RootFolder="+window.NICRootFolder).replace("//","/");
								}

                                var href = ctx.newFormUrl + "&ContentTypeId=" + CT.id + "&Source=" + encodeURIComponent(window.location.href);


                                if (CT.id.indexOf("0x0120") == 0) {
                                    foldersContent += String.format("<a class=\"ms-newdoc-callout-item ms-displayBlock\" onclick=\"CalloutManager.closeAll(); OpenLink('{2}'); return false;\" href=\"javascript:;\"><img src=\"/_layouts/15/images/mb_folder.png?rev=38\" class=\"ms-verticalAlignMiddle ms-newdoc-callout-img\"><h3 class=\"ms-displayInline ms-newdoc-callout-text ms-verticalAlignMiddle ms-soften\">{1}</h3></a>",
										wpq, CT.name, href);
                                } else {
                                    content += String.format("<a class=\"ms-newdoc-callout-item ms-displayBlock\" onclick=\"CalloutManager.closeAll(); OpenLink('{2}'); return false;\" href=\"javascript:;\"><img src=\"/_layouts/15/images/256_ICGEN.png?rev=38\" height=\"32px\" class=\"ms-verticalAlignMiddle ms-newdoc-callout-img\"><h3 class=\"ms-displayInline ms-newdoc-callout-text ms-verticalAlignMiddle ms-soften\">{1}</h3></a>",
										wpq, CT.name, href);
                                }

                            };

                            var resultContent = "<div id=\"js-newdocWOPI-divMain-WPQ2\" class=\"ms-newdoc-callout-main\" style=\"margin-left: 20px; margin-right: 20px;\">";
                            resultContent += content;
                            
                            if (ctx.ListSchema.IsDocLib == "1"){
	                            resultContent += "<hr /><a id=\"js-newdocWOPI-divWord-WPQ4\" class=\"ms-newdoc-callout-item ms-displayBlock\" onclick=\"CalloutManager.closeAll(); CreateNewDocument('1'); return false;\" href=\"#\"><img id=\"js-newdocWOPI-divWord-img-WPQ4\" src=\"/_layouts/15/images/lg_icdocx.png?rev=38\" alt=\"Создайте документ Word\" class=\"ms-verticalAlignMiddle ms-newdoc-callout-img\"><h3 id=\"js-newdocWOPI-divWord-txt-WPQ4\" class=\"ms-displayInline ms-newdoc-callout-text ms-verticalAlignMiddle ms-soften\">Создайте документ Word</h3></a><a id=\"js-newdocWOPI-divExcel-WPQ4\" class=\"ms-newdoc-callout-item ms-displayBlock\" onclick=\"CalloutManager.closeAll(); CreateNewDocument('2'); return false;\" href=\"#\"><img id=\"js-newdocWOPI-divExcel-img-WPQ4\" src=\"/_layouts/15/images/lg_icxlsx.png?rev=38\" alt=\"Создайте документ Excel\" class=\"ms-verticalAlignMiddle ms-newdoc-callout-img\"><h3 id=\"js-newdocWOPI-divExcel-txt-WPQ4\" class=\"ms-displayInline ms-newdoc-callout-text ms-verticalAlignMiddle ms-soften\">Создайте документ Excel</h3></a><a id=\"js-newdocWOPI-divPowerPoint-WPQ4\" class=\"ms-newdoc-callout-item ms-displayBlock\" onclick=\"CalloutManager.closeAll(); CreateNewDocument('3'); return false;\" href=\"#\"><img id=\"js-newdocWOPI-divPowerPoint-img-WPQ4\" src=\"/_layouts/15/images/lg_icpptx.png?rev=38\" alt=\"Создайте документ PowerPoint\" class=\"ms-verticalAlignMiddle ms-newdoc-callout-img\"><h3 id=\"js-newdocWOPI-divPowerPoint-txt-WPQ4\" class=\"ms-displayInline ms-newdoc-callout-text ms-verticalAlignMiddle ms-soften\">Создайте документ PowerPoint</h3></a><a id=\"js-newdocWOPI-divOneNote-WPQ4\" class=\"ms-newdoc-callout-item ms-displayBlock\" onclick=\"CalloutManager.closeAll(); CreateNewDocument('4'); return false;\" href=\"#\"><img id=\"js-newdocWOPI-divOneNote-img-WPQ4\" src=\"/_layouts/15/images/lg_icont.png?rev=38\" alt=\"Создайте документ OneNote\" class=\"ms-verticalAlignMiddle ms-newdoc-callout-img\"><h3 id=\"js-newdocWOPI-divOneNote-txt-WPQ4\" class=\"ms-displayInline ms-newdoc-callout-text ms-verticalAlignMiddle ms-soften\">Создайте документ OneNote</h3></a>";
                            }

                            if (content && foldersContent) {
                                resultContent += "<hr />";
                            }
                            resultContent += foldersContent;
                            resultContent += "</div>";

                            var calloutOptions = new CalloutOptions();
                            calloutOptions.ID = 'notificationcallout';
                            calloutOptions.launchPoint = LinkButton;
                            calloutOptions.beakOrientation = 'leftRight';
                            calloutOptions.content = resultContent;
                            calloutOptions.title = _self.ResourcedValue('CalloutText');
                            var callout = CalloutManager.createNew(calloutOptions);
                        }
                    });

                }
            }
        }
    };

    this.MakeRequest = function (ctx) {
        var currentUrl = window.location.protocol + "//" + window.location.host;
        var WebUrl = ctx.HttpRoot.replace(currentUrl, "");

        var UpdateFolderCT = false;
        if (InParams.UpdateFolderCT && InParams.ContentTypes) {
            UpdateFolderCT = true;
        }

        JSRequest.EnsureSetup();
        var RootFolderUrl = JSRequest.QueryString["RootFolder"];

        var clientContext = new SP.ClientContext();
        var site = clientContext.get_site();
        var web = site.openWeb(WebUrl);

        var targetList = web.get_lists().getById(ctx.listName);

        var contenttypes = targetList.get_contentTypes();

        var folder = targetList.get_rootFolder();
        var folderItem;
        if (RootFolderUrl) {
            folder = web.getFolderByServerRelativeUrl(RootFolderUrl);
            folderItem = folder.get_listItemAllFields();
            clientContext.load(folderItem, 'ContentType');
        } else {
            folderItem = targetList;
        }


        clientContext.load(folder);
        clientContext.load(folder, 'ContentTypeOrder');
        clientContext.load(folderItem, 'EffectiveBasePermissions');
        clientContext.load(targetList);
        clientContext.load(contenttypes);

        clientContext.executeQueryAsync(
			function (data) {
				window.NICRootFolder = folder.get_serverRelativeUrl();
							
			    var returndata = [];
			    var permission = folderItem.get_effectiveBasePermissions();
			    if (permission.has(SP.PermissionKind.addListItems)) {

			        var contents = folder.get_contentTypeOrder();

			        var CurrentFolderCTId = RootFolderCTId;
			        if (folderItem instanceof SP.ListItem) {
			            CurrentFolderCTId = folderItem.get_contentType().get_id().get_stringValue();
			        }

			        var SelectedCT = [];

			        if (InParams.ContentTypes) {
			            for (var DefaultForCT in InParams.ContentTypes) {
			                if (CurrentFolderCTId.indexOf(DefaultForCT) != -1) {
			                    SelectedCT = InParams.ContentTypes[DefaultForCT];
			                }
			            }
			        };


			        var FolderCTString = "";
			        for (var i = 0; i < contents.length; i++) {
			            var selectedFolderCT = contents[i];
			            FolderCTString += selectedFolderCT.get_stringValue() + ";";
			        }
			        var NewFolderCTString = "";

			        var UpdateFolder = false;
			        var ctEnum = contenttypes.getEnumerator();
			        var NewCTOrderFolder = "";
			        var NewCTOrder = [];


			        while (ctEnum.moveNext()) {
			            var currentCT = ctEnum.get_current();
			            var stringCTId = currentCT.get_id().get_stringValue();

			            if (!currentCT.get_sealed()) {
			                if (SelectedCT.length > 0) {
			                    for (var j = 0; j < SelectedCT.length; j++) {
			                        var AvalCTId = SelectedCT[j];

			                        if (stringCTId.indexOf(AvalCTId) != -1) {
			                            if (NewCTOrderFolder.indexOf(stringCTId + ";") == -1) {
			                                NewCTOrderFolder += stringCTId + ";";

			                                var returnCT = {};
			                                returnCT.name = currentCT.get_name();
			                                returnCT.id = currentCT.get_stringId();
			                                returnCT.Template = currentCT.get_documentTemplateUrl();			                                
			                                returndata.push(returnCT);

			                                NewCTOrder.push(currentCT.get_id());
			                            }
			                        }
			                    }
			                } else {
			                    if (FolderCTString.indexOf(stringCTId) != -1) {
			                        var returnCT = {};
			                        returnCT.name = currentCT.get_name();
			                        returnCT.id = currentCT.get_stringId();
	                                returnCT.Template = currentCT.get_documentTemplateUrl();			                        
			                        returndata.push(returnCT);
			                    }
			                }
			            }

			        }

			    }


			    if (InParams.HideIfOne && (returndata.length == 1)) {
			        _self.CreateHeroLink(ctx, returndata);
			    } else {
			        _self.CreateCallout(ctx, returndata);
			    }


			    if ((FolderCTString != NewCTOrderFolder) && (NewCTOrder.length > 0)) {
			        folder.set_uniqueContentTypeOrder(NewCTOrder);
			        folder.update();

			        clientContext.executeQueryAsync(function (data) {
			            if (InParams.ReloadPage) {
			                window.location.reload();
			            } else {
			                if (InParams.Mask) {
			                    _self.Unmask(ctx);
			                }
			            }

			        }, clientContextError);

			    } else {
			        if (InParams.ReloadPage || InParams.Mask) {
			            _self.Unmask(ctx);
			        }
			    }

			},
			clientContextError
		);
    };

    function clientContextError(sender, args) {
        console.log('SPF NewItemCallout ' + args.get_message() + '\n' + args.get_stackTrace());
    };

    function AddStyles() {
        var css = '.display-none{display:none;}.display-inlineblock{display:inline-block;}.js-callout-body{margin-left:0px !important;}',
		    head = document.head || document.getElementsByTagName('head')[0],
		    style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };

    _init();
};


function OpenLink(href) {
    window.location.href = href;
};


(function () {
    var Register = function () {

        window.ShouldRenderHeroButton = function (renderCtx) {
            return true;
        }

        window.SPFResources = {
            'ru-ru': {
                CalloutText: 'Создайте новый элемент'
            },
            CalloutText: 'Create a new item'
        };
		
        var params = SPFNIC.Params || {};
        
        new NewItemCalloutData(params);
    };

    var MdsRegister = function () {
        var thisUrl = _spPageContextInfo.webServerRelativeUrl + "/_catalogs/masterpage/SPF/Modules/newitemcallout/spf.newitemcallout.js".replace(new RegExp("//", "g"), "/");

        Register();
        RegisterModuleInit(thisUrl, Register);
    };

    function init() {
        if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
            MdsRegister();
        } else {
            Register();
        }
    }

    ExecuteOrDelayUntilScriptLoaded(function () {
        init();
    }, 'clienttemplates.js');

})();