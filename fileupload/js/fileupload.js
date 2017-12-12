/*!
 * File Upload v1.0.0
 * Copyright 2017 @icalapuja
 * Licensed under MIT (https://github.com/icalapuja/js/fileupload)
 */

(function($){
    function _isInvalid(variable){return (variable == undefined || variable == null);}
    function _isValid(variable){return !_isInvalid(variable);}

    function _isEmpty(variable){
    	if(_isInvalid(variable)){return true;}
    	var _typeof = typeof variable;
    	
    	if(_typeof == "string"){
    		if(variable == ''){return true;}
    	}

        if(_typeof == "object"){
            _typeof = typeof variable.length;

            if(_typeof == "undefined"){
                // is JSON
                if(JSON.stringify(variable) == '{}'){return true;}
            }else{
                // is Array
                if(_typeof == "number"){
                    if(variable.length == 0){return true;}
                }
            }
        }

        return false;
    }

	function _isOldMozilla(){
		return (navigator.userAgent.indexOf('Mozilla/4') != -1);
	}

    function _isIE8(){
        return (navigator.userAgent.indexOf('MSIE 8') != -1);
    }

    function _isIE9(){
        return (navigator.userAgent.indexOf('MSIE 9') != -1);
    }

    function _noSupportAjaxUpload(){
    	return (_isOldMozilla() || _isIE9());
    }

    function _getFileName(these){
    	var value = these.val();
    	var split = value.split("\\");
    	var fileName = split[split.length - 1];
    	return fileName;
    }

	function _ajax_upload(these){
		var data = new FormData();
		data.append("file", these.get(0).files[0]);
		data.append("data", these._data);

		$.ajax({
		    url: these._url,
		    type: 'POST',
		    data: data,
		    contentType: false,
		    processData: false,
		    enctype: 'multipart/form-data',
		    success: function(response){
		    	if(_isValid(these._success)){
	        		these._success(response);
		    	}
		    },
		    error: function(response){
		    	if(_isValid(these._error)){
	        		these._error({'status':{'nerror': -2,'serror': 'Ajax Error'},'response': response});
		    	}
		    }
		});
	}

    function _ie_ajax_upload(these){
		if(_isEmpty(these.attr('name'))){these.attr('name',these[0].id);}
		
		var fileInputParent = these.parent();
		var iframe = $("#__fileupload_iframe__");
		var form = $("#__fileupload_form__");
		var text = $("#__fileupload_text__");

		if(iframe.length == 0){
			iframe = $('<iframe name="__fileupload_iframe__" id="__fileupload_iframe__" style="width: 800px; height:500px"></iframe>');
			$("body").append(iframe);

		    $(iframe).on('load',function(e){
		    	if(typeof(e.target.contentDocument) == "object"){
		    		var response = $(iframe).contents().find('body').html();

		    		if(response.indexOf('HttpException') != -1){
			    		if(_isValid(these._error)){
			    			these._error({'status':{'nerror': 404,'serror': 'Not Found'},'response': response});
			    		}
		    		}else{
		    			if(_isValid(these._success)){
		    				these._success(response);
			    		}
		    		}
		    	}else{
		    		if(_isValid(these._error)){
		    			these._error({'status':{'nerror': 404,'serror': 'Not Found'},'response': {}});
		    		}
		    	}
		    });
		}

		$(iframe).contents().find('body').html("");

		if(form.length == 0){
			form = $('<form name="__fileupload_form__" id="__fileupload_form__" style="display:none"></form>');
			$("body").append(form);
		    form.attr("action", these._url);
		    form.attr("method", "post");
		    // form.attr("encoding", "multipart/form-data");
		    form.attr("enctype", "multipart/form-data");
		    form.attr("target", iframe[0].id);
		}

		if(text.length == 0){
			text = $('<input type="text" id="__fileupload_text__" name="data" style="display:none" />');
		}

		text.val(these._data);
	    form.append(text);
	    form.append(these);
	    form.attr("file", these.val());
	    form.submit();
		fileInputParent.append(these);
	}

	function _upload(these){
		var serror = "";

		if(_isEmpty(these.val())){
			serror = "No File Selected";
		}

		if(_isEmpty(these._url)){
			serror = "No URL indicated";
		}

		if(_isEmpty(serror)){
			if(_noSupportAjaxUpload()){
				_ie_ajax_upload(these);
			}else{
				_ajax_upload(these);
			}
		}else{
			if(_isValid(these._error)){
	    		these._error({'status':{'nerror': -1,'serror': serror},'response':{}});
	    	}
		}
	}

	$.fn.extend({
		fileUpload: function(params){
			var these = this;

			if(_isValid(params)){
				if(_isValid(params.change)){
					these.on('change',function(e){
						params.change(e,_getFileName(these));
					});
				}
			}

			these.upload = function(params){
				if(_isValid(params)){
					these._url = params.url;
					these._data = params.data;
					these._success = params.success;
					these._error = params.error;
					_upload(these);
				}
			}

			return these;
		}
	});
})(jQuery);

