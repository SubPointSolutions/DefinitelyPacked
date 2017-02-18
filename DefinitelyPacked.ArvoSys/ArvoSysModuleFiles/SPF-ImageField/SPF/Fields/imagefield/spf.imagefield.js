var SPF = SPF || {};
SPF.SPImageField = SPF.SPImageField || {};

var SPFImageField = function (_inParams) {
    var _self = this;
    _self.Fields = [];

    this.Resources = {
        'ru-ru': {
            LinkText: 'Загрузите изображение с <a href="javascript:;" id="{0}_{3}_computer_link">компьютера</a> или выберите из <a href="javascript:;" id="{0}_{3}_sharepoint_link">SharePoint',
            Clear: "Очистить",
            ImageLinkText: "Ссылка на изображение",
            Loading: "Работаем над этим..."
        },
        LinkText: 'Load the image from <a href="javascript:;" id="{0}_{3}_computer_link">computer</a> or select from <a href="javascript:;" id="{0}_{3}_sharepoint_link">SharePoint',
        Clear: "Clear",
        ImageLinkText: "Link to the image",
        Loading: "Working on it..."
    };

    this.ResourcedValue = function (value) {
        var returnValue = value;
        if (_self.Resources) {
            var resource = _self.Resources[_spPageContextInfo.currentCultureName.toLowerCase()];
            if (!resource) {
                resource = _self.Resources;
            };
            if (resource) {
                returnValue = resource[value];
            }
        };
        return returnValue;
    };

    this.updateProtos = function () {
        if (typeof Element.prototype.remove != 'function') {
            Element.prototype.remove = function () {
                this.parentElement.removeChild(this);
            }
        }
        if (typeof NodeList.prototype.remove != 'function') {
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
                for (var i = 0, len = this.length; i < len; i++) {
                    if (this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            }
        }

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.slice(0, str.length) == str;
            };
        }
        if (typeof String.prototype.endsWith != 'function') {
            String.prototype.endsWith = function (str) {
                return this.slice(-str.length) == str;
            };
        }

        if (typeof Array.isArray === 'undefined') {
            Array.isArray = function (obj) {
                return Object.toString.call(obj) === '[object Array]';
            }
        }
    };

    this._init = function () {
        _self.updateProtos();

        var _mapTemplate = {
            'DisplayForm': _self.RenderPhoto,
            'EditForm': _self.RenderEditPhoto,
            'NewForm': _self.RenderEditPhoto,
            'View': _self.RenderPhoto
        };

        var _over = {};
        _over.Templates = {};
        _over.Templates.Fields = {};
        var FieldMap = {};
        if (Array.isArray(_inParams.Fields)) {
            _self.Fields = _inParams.Fields;
        } else {
            _self.Fields.push(_inParams.Fields);
        };

        _self.Fields.forEach(function (value, b, c) {
            FieldMap[value] = _self._copyObject(_mapTemplate);
        });

        _over.Templates.Fields = FieldMap;
        _over.OnPreRender = _self.PreRenderControl;
        _over.OnPostRender = _self.PostRenderControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(_over);
    };

    this._copyObject = function (object) {
        var newObject = {};
        for (var index in object) {
            newObject[index] = object[index];
        }
        return newObject;
    };

    this.SelectorDialogDesktop = function (fieldName, title, dialogType, additionalQueryString, showMaximized, startWidth) {
        _self.SelectorDialog('Upload.aspx', title, dialogType, additionalQueryString, showMaximized, startWidth, function (dlgResult, returnValue) {
            if (returnValue) {
                var linkUrl = returnValue.newFileUrl;
                if (linkUrl) {
                    _self.SelectorSetValue(fieldName, linkUrl);
                }
            }
        });
    };

    this.SelectorDialogFoundation = function (fieldName, title, dialogType, additionalQueryString, showMaximized, startWidth) {
        var imageField = document.getElementById(_self.FormId + "_" + fieldName + "_PhotoImg");

        var url = "";
        if (imageField)
            url = imageField.getAttribute("src");

        _self.SelectorDialog('RteDialog.aspx?Dialog=CreateLink&Param2=' + url + "&Param1=" + _self.ResourcedValue('ImageLinkText'), title, dialogType, additionalQueryString, showMaximized, startWidth, function (dlgResult, returnValue) {
            if (returnValue) {
                if (returnValue.length > 0) {
                    var linkUrl = returnValue[1];
                    if (linkUrl) {
                        _self.SelectorSetValue(fieldName, linkUrl);
                    }
                }
            }
        });
    };

    this.SelectorDialogSharePoint = function (fieldName, title, dialogType, additionalQueryString, showMaximized, startWidth) {
        _self.SelectorDialog('AssetPortalBrowser.aspx', title, dialogType, additionalQueryString, showMaximized, startWidth, function (dlgResult, returnValue) {
            if (returnValue) {
                var linkUrl = returnValue.AssetUrl;
                if (linkUrl) {
                    _self.SelectorSetValue(fieldName, linkUrl);
                }
            }
        });
    };

    this.SelectorDialog = function (dialogUrl, title, dialogType, additionalQueryString, showMaximized, startWidth, callback) {
        var dialogOptions = new SP.UI.DialogOptions();
        var concatSymbol = dialogUrl.indexOf('?') != -1 ? "&" : "?";

        dialogOptions.url = SP.Utilities.UrlBuilder.urlCombine(
            SP.PageContextInfo.get_webServerRelativeUrl(),
            SP.Utilities.Utility.get_layoutsLatestVersionRelativeUrl() + dialogUrl) + concatSymbol +
            'UseDivDialog=true' + '&LCID=' + SP.Utilities.HttpUtility.urlKeyValueEncode(SP.PageContextInfo.get_currentLanguage().toString()) +
            '&Source=' + SP.Utilities.HttpUtility.urlKeyValueEncode(document.URL);
        if (dialogType) {
            dialogOptions.url = dialogOptions.url + '&Dialog=' + SP.Utilities.HttpUtility.urlKeyValueEncode(dialogType);
            if (dialogType === 'CreateLink') {
                dialogOptions.url = dialogOptions.url + '&FirstLine=false';
            }
        }
        if (additionalQueryString) {
            dialogOptions.url = dialogOptions.url + '&' + additionalQueryString;
        }
        dialogOptions.title = title;
        dialogOptions.dialogReturnValueCallback = callback;
        dialogOptions.showMaximized = showMaximized;
        dialogOptions.autoSize = !showMaximized;
        if (startWidth > 0) {
            dialogOptions.autoSizeStartWidth = startWidth;
        }
        SP.UI.ModalDialog.showModalDialog(dialogOptions);
    };

    this.SelectorSetValue = function (fieldName, linkUrl) {
        document.getElementById(_self.FormId + "_" + fieldName + "_ValueInput").value = linkUrl + ", " + linkUrl;
        document.getElementById(_self.FormId + "_" + fieldName + "_PhotoTr").style.display = "block";
        document.getElementById(_self.FormId + "_" + fieldName + "_ClearButton").style.display = "block";
        document.getElementById(_self.FormId + "_" + fieldName + "_PhotoImg").src = linkUrl;

    };

    this.SelectorClearValue = function (fieldName) {
        document.getElementById(_self.FormId + "_" + fieldName + "_ValueInput").value = "";
        document.getElementById(_self.FormId + "_" + fieldName + "_PhotoTr").style.display = "none";
        document.getElementById(_self.FormId + "_" + fieldName + "_ClearButton").style.display = "none";
        document.getElementById(_self.FormId + "_" + fieldName + "_PhotoImg").src = "";

    };

    this.CallBack = function (fieldName) {
        var value = document.getElementById(_self.FormId + "_" + fieldName + "_ValueInput").value;
        return value;
    };

    this.RenderEditPhoto = function (ctx) {
        var f = ctx.ListSchema.Field[0];
        _self.formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);

        if (_self.formCtx == null || _self.formCtx.fieldSchema == null)
            return '';

        var fieldName = _self.formCtx.fieldName
        _self.formCtx.registerGetValueCallback(_self.formCtx.fieldName, function () {
            return document.getElementById(_self.FormId + "_" + fieldName + "_ValueInput").value
        });

        var template = "<div id=\"{0}_{3}_PhotoContainer\" style=\"border: 1px dashed gray; padding: 5px;\"><input type=\"hidden\" id=\"{0}_{3}_ValueInput\" value='{4}'/>" +
    					"<table>" +
    					"<tr><td>" + _self.ResourcedValue("LinkText") + "</td></tr>" +
    					"<tr style=\"display:{1};\" id=\"{0}_{3}_PhotoTr\"><td><a href=\"{2}\" target=\"_blank\"><img src=\"{2}\" id=\"{0}_{3}_PhotoImg\" style=\"width: 200px;\"></a></td></tr>" +
    					"<tr style=\"display:{1};\" id=\"{0}_{3}_ClearButton\"><td><a href=\"javascript:;\" id=\"{0}_{3}_ClearButton\">" + _self.ResourcedValue("Clear") + "</a></td></tr>" +
    					"</table></div>";

        var img = "";
        var isImage = "none";
        var value = ctx.CurrentFieldValue;
        if (value) {
            var img = value.split(',')[0].trim();
            isImage = "block";
        }


        var returns = String.format(template, _self.FormId, isImage, img, f.Name, value);
        return returns;
    }

    this.RenderPhoto = function (ctx, f) {
        var value = '';
        if (ctx.view) {
            if (f) {
                f.AllowGridEditing = false;
                if (ctx.CurrentItem) {
                    value = ctx.CurrentItem[f.Name];
                };
            }
        } else {
            value = ctx.CurrentFieldValue;
        }

        if (value) {
            var img = value.split(',')[0].trim();

            return "<a href=\"" + img + "\" target=\"_blank\"><img src=\"" + img + "\" style=\"max-width: 200px;\"></a>";
        } else {
            return "";
        }
    };

    this.PreRenderControl = function (ctx) {
        var f = ctx.ListSchema.Field[0];
        if (_self.Fields.indexOf(f.Name) != -1) {
            SP.SOD.executeFunc("clientrenderer.js", "SPClientRenderer.ReplaceUrlTokens", function () {
                _self.ctx = ctx;
                _self.FormId = ctx.FormUniqueId;

                if (_inParams.Folder) {
                    _inParams.Folder = SPClientRenderer.ReplaceUrlTokens(_inParams.Folder);
                }

            });
        }
    };


    this.PostRenderControl = function (ctx) {
        if (!ctx.view) {
            var f = ctx.ListSchema.Field[0];
            if (_self.Fields.indexOf(f.Name) != -1) {

                var computer_select = document.getElementById(_self.FormId + "_" + f.Name + "_computer_link");

                if (computer_select) {
                    $addHandler(computer_select, 'click', function () {
                        if (_inParams.NoLoadDialog) {

                            var inputId = _self.FormId + "_" + f.Name + "_computer_input";
                            var input = document.getElementById(inputId);
                            if (!input) {
                                var input = document.createElement('input');
                                input.setAttribute('id', _self.FormId + "_" + f.Name + "_computer_input");
                                input.setAttribute('type', 'file');
                                input.style.display = "block";
                                input.onchange = function (event) {
                                    _self.dynamicLoadFile(event, f.Name);
                                }
                                var container = document.getElementById(_self.FormId + "_" + f.Name + "_PhotoContainer");
                                container.insertBefore(input, container.firstChild)
                            } else {
                                if (input.style.display == "block") {
                                    input.style.display = "none";
                                } else {
                                    input.style.display = "block";
                                }
                            }

                        } else {
                            _self.SelectorDialogDesktop(f.Name);
                        }
                    });
                }
                var sharepoint_select = document.getElementById(_self.FormId + "_" + f.Name + "_sharepoint_link");

                if (sharepoint_select) {
                    $addHandler(sharepoint_select, 'click', function () {
                        if (_inParams.Foundation) {
                            _self.SelectorDialogFoundation(f.Name);
                        } else {
                            _self.SelectorDialogSharePoint(f.Name);
                        }
                    });
                }
                var clear_select = document.getElementById(_self.FormId + "_" + f.Name + "_ClearButton");
                if (clear_select) {
                    $addHandler(clear_select, 'click', function () {
                        _self.SelectorClearValue(f.Name);
                    });
                }
            }
        }
    };

    this.dynamicLoadFile = function (event, FieldName) {
        var input = event.target;
        if (input.files.length > 0) {

            var file = input.files[0];

            _self.waitForLoad = SP.UI.ModalDialog.showWaitScreenWithNoClose(_self.ResourcedValue("Loading"));

            _self.Reader = new FileReader();
            _self.Reader.onload = function () {
                if ((file.size > '2097152') || (_inParams.UseREST)) {
                    _self.dynamicRESTFile(_self.Reader, file, FieldName);
                } else {
                    _self.dynamicJSOMFile(_self.Reader, file, FieldName);
                }
            };
            _self.Reader.readAsArrayBuffer(file);
        }
    };

    this.dynamicRESTFile = function (Reader, file, FieldName) {
        RegisterSod('spf.sp.request', SP.Utilities.VersionUtility.getLayoutsPageUrl('sp.requestexecutor.js'));
        EnsureScriptFunc('spf.sp.request', 'SP.RequestExecutor', function () {
            var _executor = new SP.RequestExecutor(_spPageContextInfo.siteAbsoluteUrl);
            var arr = new Uint8Array(Reader.result);
            var dataString = '';
            for (var i = 0; i < arr.byteLength; i++) {
                dataString += String.fromCharCode(arr[i]);
            }

            var fileName = SP.Guid.newGuid().toString() + "." + _self.GetExtention(file.name);
            _self.returnImage = "/" + _self.UrlCombine(_inParams.Folder, fileName);


            var requestUrl = String.format("{0}/_api/web/getFolderByServerRelativeUrl(@Folder)/Files/add(url=@FileName,overwrite='true')?@Folder='{1}'&@FileName='{2}'",
                _spPageContextInfo.siteServerRelativeUrl,
                _inParams.Folder,
                fileName);

            _executor.executeAsync({
                url: requestUrl,
                method: "POST",
                body: dataString,
                binaryStringRequestBody: true,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) {
                    _self.onSuccess(data, FieldName);
                },
                error: function (data, errorCode, errorMessage) {
                    console.log(data);
                    _self.waitForLoad.close();
                }
            });
        });
    };

    this.dynamicJSOMFile = function (Reader, file, FieldName) {
        var fileName = SP.Guid.newGuid().toString() + "." + _self.GetExtention(file.name);
        _self.returnImage = "/" + _self.UrlCombine(_inParams.Folder, fileName);

        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var folder = web.getFolderByServerRelativeUrl(_inParams.Folder);
        var fileCI = new SP.FileCreationInformation();
        fileCI.set_url(fileName);
        fileCI.set_overwrite(true);
        fileCI.set_content(new SP.Base64EncodedByteArray());

        var arr = new Uint8Array(Reader.result);
        for (var i = 0; i < arr.length; ++i) {
            fileCI.get_content().append(arr[i]);
        }

        var newFile = folder.get_files().add(fileCI);

        context.load(newFile);
        context.executeQueryAsync(function (data) { _self.onSuccess(data, FieldName); }, _self.onFailure);
    };

    this.onSuccess = function (data, FieldName) {
        _self.SelectorSetValue(FieldName, _self.returnImage)
        var selectinput = document.getElementById(_self.FormId + "_" + FieldName + "_computer_input");
        if (selectinput) {
            selectinput.remove();
        }
        _self.waitForLoad.close();
    }

    this.onFailure = function (sender, args) {
        _self.waitForLoad.close();
        console.log('SOFImageField fail: ' + args.get_message() + '\n' + args.get_stackTrace());
    };

    this.UrlCombine = function (url, path) {    	    	
        var start_url = _self.UrlReplaceSlash(url);
        var start_path = _self.UrlReplaceSlash(path);

        return start_url + "/" + start_path;
    };
    this.UrlReplaceSlash = function (url) {
        var start = 0;
        var end = url.length;
        if (url.startsWith("/"))
            start = 1;
        if (url.endsWith("/"))
            end = url.length - 1;

        url = url.substring(start, end);
        return url;
    };

    this.GetExtention = function (filename) {
        var ext = "";
        var arr = filename.split('.');
        if (arr.length > 1) {
            ext = arr[arr.length-1];
        }
        return ext;
    };

    this._init();
};


(function () {
    if (SPF.ImageField.FieldsParams) {
        SPF.ImageField.FieldsParams.forEach(function (o) {
            new SPFImageField(o);
        });
    }

})();